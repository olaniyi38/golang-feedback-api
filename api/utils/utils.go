package utils

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"os"
)

type Claims struct {
	Exp int64 `json:"exp"`
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
