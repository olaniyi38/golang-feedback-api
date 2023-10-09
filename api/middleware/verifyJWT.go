package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"product-feedback.com/api/controllers"
	"product-feedback.com/api/utils"
)

func VerifyJWT(handlerFunc func(c *gin.Context)) func(c *gin.Context) {
	return func(c *gin.Context) {
		authToken, err := c.Cookie("auth")

		if err != nil {
			controllers.RespondWithErr(c, err, http.StatusUnauthorized)
			return
		}
        
		token, err := utils.VerifyJwt(authToken)

		if err != nil {
			controllers.RespondWithErr(c, err, http.StatusUnauthorized)
			return
		}
		exp, err := token.Claims.GetExpirationTime()

		if time.Now().Compare(exp.Time) == 1 {
			controllers.RespondWithErr(c, err, http.StatusUnauthorized)
			return
		}

		if token.Valid {
			handlerFunc(c)
			return
		}

		controllers.RespondWithErr(c, err, http.StatusUnauthorized)

	}

}
