package utils

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Exp      int64  `json:"exp"`
	Username string `json:"username"`
}

func (c Claims) GenerateJWT() (string, error) {
	key := os.Getenv("SECRET_KEY")
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = c.Exp
	claims["username"] = c.Username

	signedString, err := token.SignedString([]byte(key))
	if err != nil {
		return "", fmt.Errorf("error signing token: %v", err)
	}
	return signedString, nil

}

func VerifyJwt(token string) (*jwt.Token, error) {
	t, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil {
		return nil, err
	}

	return t, nil
}

func VerifyUserPermission(c *gin.Context, feedbackBy string) error {
	authToken, err := c.Cookie("auth")

	if err != nil {
		return errors.New("auth token not found")
	}

	token, err := VerifyJwt(authToken)

	if err != nil {
		return errors.New("invalid jwt token")
	}

	claims := token.Claims.(jwt.MapClaims)

	if !strings.EqualFold(claims["username"].(string), feedbackBy) {
		log.Println(claims["username"], feedbackBy)
		return errors.New("you are unauthorized to edit this feedback")
	}

	return nil
}
