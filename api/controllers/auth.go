package controllers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/olaniyi38/golang-feedback-app/api/models"
	"github.com/olaniyi38/golang-feedback-app/api/utils"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func (con controller) SignUp(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	con.DB.Collection("feedbacks")
	defer cancel()
	usersCollection := con.DB.Collection("users")
	authCollection := con.DB.Collection("auth")
	var userCred models.Credentials
	var newUser models.User

	if err := c.BindJSON(&userCred); err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
	}

	count, err := authCollection.CountDocuments(ctx, bson.D{{Key: "username", Value: userCred.Username}})

	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	if count > 0 {
		RespondWithErr(c, errors.New("user with that username already exists"), http.StatusBadRequest)
		return
	}

	userCred.Username = strings.ToLower(userCred.Username)

	newUser.Username = userCred.Username
	newUser.Image = "https://github.com/SirDev97/product-feedback-app/blob/main/public/assets/user-images/image-suzanne.jpg?raw=true"
	newUser.Name = userCred.Name
	newUser.Likes = map[string]struct{}{}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userCred.Password), 14)
	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}
	userCred.Password = string(hashedPassword)

	_, err = authCollection.InsertOne(ctx, userCred)

	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	_, err = usersCollection.InsertOne(ctx, newUser)

	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	claims := utils.Claims{
		Exp:      time.Now().Add(time.Hour * 4).Unix(),
		Username: userCred.Username,
	}

	token, err := claims.GenerateJWT()

	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	cookie := &http.Cookie{
		Name:     "auth",
		Value:    token,
		MaxAge:   4000000,
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	}

	http.SetCookie(c.Writer, cookie)

	c.JSON(200, newUser)
}

func (con controller) SignIn(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	con.DB.Collection("feedbacks")
	defer cancel()
	usersCollection := con.DB.Collection("users")
	authCollection := con.DB.Collection("auth")

	var userCred struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var authCred models.Credentials

	var user models.User

	if err := c.BindJSON(&userCred); err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
		return
	}

	result := authCollection.FindOne(ctx, bson.D{{Key: "username", Value: userCred.Username}})
	if result.Err() != nil {
		RespondWithErr(c, errors.New("User Not found"), http.StatusNotFound)
		fmt.Println(result.Err())
		return
	}
	err := result.Decode(&authCred)
	if err != nil {
		RespondWithErr(c, err, http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(authCred.Password), []byte(userCred.Password))
	if err != nil {
		RespondWithErr(c, errors.New("incorrect password"), http.StatusNotFound)
		c.Writer.Write([]byte(err.Error()))
		return
	}

	result = usersCollection.FindOne(ctx, bson.D{{Key: "username", Value: authCred.Username}})
	err = result.Decode(&user)
	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	claims := utils.Claims{
		Exp:      time.Now().Add(time.Hour * 4).Unix(),
		Username: authCred.Username,
	}

	token, err := claims.GenerateJWT()
	if err != nil {
		RespondWithErr(c, err, http.StatusInternalServerError)
		return
	}

	cookie := &http.Cookie{
		Name:     "auth",
		Value:    token,
		MaxAge:   4000000,
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	}

	http.SetCookie(c.Writer, cookie)
	c.JSON(200, user)

}

func (con controller) VerifySignedToken(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	con.DB.Collection("feedbacks")
	defer cancel()
	usersCollection := con.DB.Collection("users")

	var User models.User
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

	exp, err := claims.GetExpirationTime()
	if err != nil {
		RespondWithErr(c, err, http.StatusUnprocessableEntity)
		return
	}

	if time.Now().Compare(exp.Time) == 1 {
		cookie := &http.Cookie{
			Name:     "auth",
			Value:    "",
			MaxAge:   -1,
			Path:     "/",
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
		}

		http.SetCookie(c.Writer, cookie)
		
		RespondWithErr(c, err, http.StatusUnauthorized)
		return
	}

	res := usersCollection.FindOne(ctx, bson.D{{Key: "username", Value: claims["username"]}})

	if err := res.Decode(&User); err != nil {
		RespondWithErr(c, res.Err(), http.StatusInternalServerError)
		return
	}

	c.JSON(200, User)

}

func (con controller) LogOut(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "auth",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	}

	http.SetCookie(c.Writer, cookie)

	c.Writer.WriteHeader(http.StatusOK)

}
