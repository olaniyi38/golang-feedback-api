package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
)

type controller struct {
	DB *mongo.Database
}

func New(db *mongo.Database) controller {
	return controller{db}
}

func RespondWithErr(c *gin.Context, err error, status int) {
	Error := struct {
		Error string `json:"error"`
	}{
		Error: err.Error(),
	}
	c.JSON(status, Error)
	fmt.Println(err)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("error loading envs")
	}
}
