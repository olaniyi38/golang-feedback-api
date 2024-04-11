package controllers

import (
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)


type controller struct {
	DB *mongo.Database
}

func New(db *mongo.Database) *controller {
	return &controller{db}
}


func RespondWithErr(c *gin.Context, err error, code int) {
	Error := struct {
		Error string `json:"error"`
	}{
		Error: err.Error(),
	}

	if code > 499 {
		log.Printf("Responding with 5XX error: %v", err)
	}

	c.JSON(code, Error)

}

