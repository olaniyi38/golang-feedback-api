package controllers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/golang-jwt/jwt/v5"
	_ "golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"github.com/olaniyi38/golang-feedback-app/api/models"
	"github.com/olaniyi38/golang-feedback-app/api/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (con controller) GetFeedbacks(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	feedbacks := []models.FeedBack{}
	collection := con.DB.Collection("feedbacks")
	defer cancel()

	results, err := collection.Find(ctx, bson.M{})
	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}
	defer results.Close(ctx)

	for results.Next(ctx) {
		var feedback models.FeedBack
		if err = results.Decode(&feedback); err != nil {
			RespondWithErr(c, err, http.StatusInternalServerError)
			return
		}

		feedbacks = append(feedbacks, feedback)
	}

	time.Sleep(time.Second * 5)

	c.JSON(200, feedbacks)
}

func (con controller) PostFeedback(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var feedback models.FeedBack
	collection := con.DB.Collection("feedbacks")
	defer cancel()

	if err := c.BindJSON(&feedback); err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
		return
	}

	result, err := collection.InsertOne(ctx, feedback)

	if err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
	}

	c.JSON(200, result.InsertedID)
}

func (con controller) EditFeedback(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var newFeedback models.FeedBack
	collection := con.DB.Collection("feedbacks")
	defer cancel()

	err := c.BindJSON(&newFeedback)

	if err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
		return
	}

	authToken, err := c.Cookie("auth")

	if err != nil {
		RespondWithErr(c, err, http.StatusUnauthorized)
		return
	}

	token, err := utils.VerifyJwt(authToken)

	if err != nil {
		RespondWithErr(c, err, http.StatusUnauthorized)
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	fmt.Println(claims["username"])

	if claims["username"] != newFeedback.By {
		RespondWithErr(c, errors.New("You are unauthorized to edit this feedback"), http.StatusUnauthorized)
		return
	}

	result, err := collection.ReplaceOne(ctx, bson.D{{Key: "_id", Value: newFeedback.Id}}, newFeedback)

	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	c.JSON(200, result.MatchedCount)
}

func (con controller) DeleteFeedback(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	feedbackId, _ := c.Params.Get("id")
	collection := con.DB.Collection("feedbacks")
	defer cancel()

	objectId, err := primitive.ObjectIDFromHex(feedbackId)

	if err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
		return
	}

	var feedback models.FeedBack

	err = collection.FindOne(ctx, bson.D{{Key: "_id", Value: objectId}}).Decode(&feedback)

	if err != nil {
		RespondWithErr(c, errors.New("feedback not found"), http.StatusBadRequest)
		return
	}

	authToken, err := c.Cookie("auth")

	if err != nil {
		RespondWithErr(c, err, http.StatusUnauthorized)
		return
	}

	token, err := utils.VerifyJwt(authToken)

	if err != nil {
		RespondWithErr(c, errors.New("Invalid Jwt"), http.StatusUnauthorized)
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	fmt.Println(claims["username"])

	if claims["username"] != feedback.By {
		RespondWithErr(c, errors.New("You are unauthorized to edit this feedback"), http.StatusUnauthorized)
		return
	}

	result, err := collection.DeleteOne(ctx, bson.D{{Key: "_id", Value: objectId}})

	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, result.DeletedCount)

}

func (con controller) LikeFeedback(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	usersCollection := con.DB.Collection("users")
	defer cancel()

	var data struct {
		Likes    map[string]struct{}
		Username string
	}

	if err := c.BindJSON(&data); err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
		return
	}

	filter := bson.D{{Key: "username", Value: data.Username}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "likes", Value: data.Likes}}}}

	result, err := usersCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	c.JSON(200, result.ModifiedCount)

}
