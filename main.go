package main

import (
	"context"
	"log"

	"github.com/gin-contrib/cors"
	_ "github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/olaniyi38/golang-feedback-app/api/controllers"
	"github.com/olaniyi38/golang-feedback-app/api/db"
	"github.com/olaniyi38/golang-feedback-app/api/middleware"
)



func main() {
	dbClient := db.Init()
	con := controllers.New(dbClient.Database("product-feedbacks"))
	router := gin.Default()
	corsConfig := cors.DefaultConfig()

	defer func() {
		if err := dbClient.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	
	corsConfig.AllowOrigins = []string{"http://localhost:5173", "http://localhost:3000", "https://feedback-app-hazel.vercel.app"}
	corsConfig.AllowCredentials = true
	corsConfig.AddAllowHeaders("Cookie")

	router.Use(cors.New(corsConfig))

	// router.Use(static.Serve("/", static.LocalFile("./ui/dist/", true)))

	// // router.NoRoute(func(c *gin.Context) {
	// // 	c.File("./ui/dist/index.html")
	// // })

	// router.GET("/", func(ctx *gin.Context) {
	// 	router.StaticFile("/ui/dist/index.html", "./ui/dist/index.html")
	// })

	router.GET("/feedbacks", middleware.VerifyJWT(con.GetFeedbacks))

	router.GET("/fetch-user", con.VerifySignedToken)

	router.POST("/auth/logout", middleware.VerifyJWT(con.LogOut))

	router.POST("/create-feedback", middleware.VerifyJWT(con.PostFeedback))

	router.POST("/auth/sign-in", con.SignIn)

	router.POST("/auth/sign-up", con.SignUp)

	router.PUT("/edit-feedback", middleware.VerifyJWT(con.EditFeedback))

	router.PATCH("/like-feedback", middleware.VerifyJWT(con.LikeFeedback))

	router.DELETE("/delete-feedback/:id", middleware.VerifyJWT(con.DeleteFeedback))

	err := router.Run(":4000")

	if err != nil {
		log.Fatal(err)
	}
}
