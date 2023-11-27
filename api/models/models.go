package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Image    string              `json:"image" bson:"image"`
	Name     string              `json:"name" bson:"name"`
	Username string              `json:"username" bson:"username"`
	Likes    map[string]struct{} `json:"likes" bson:"likes"`
}

type Credentials struct {
	Username string `json:"username" bson:"username"`
	Name     string `json:"name" bson:"name"`
	Password string `json:"password" bson:"password"`
}

type Reply struct {
	Id         primitive.ObjectID `json:"id" bson:"_id"`
	Content    string             `json:"content" bson:"content"`
	ReplyingTO string             `json:"replyingTo" bson:"replyingTo"`
	User       User               `json:"user" bson:"user"`
}

type Comment struct {
	Id      primitive.ObjectID `json:"id" bson:"_id"`
	Content string             `json:"content" bson:"content"`
	User    User               `json:"user" bson:"user"`
	Replies []Reply            `json:"replies" bson:"reply"`
}

type FeedBack struct {
	Id          primitive.ObjectID `json:"id" bson:"_id"`
	Title       string             `json:"title"  bson:"title"`
	Category    string             `json:"category" bson:"category"`
	Upvotes     int                `json:"upvotes" bson:"upvotes"`
	Status      string             `json:"status" bson:"status"`
	Description string             `json:"description" bson:"description"`
	Comments    []Comment          `json:"comments"  bson:"comments"`
	By          string             `json:"by" bson:"by"`
}
