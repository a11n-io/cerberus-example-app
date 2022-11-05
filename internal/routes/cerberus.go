package routes

import (
	"cerberus-example-app/env"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type cerberusRoutes struct {
	env    env.EnvApp
	client cerberus.Client
}

func NewCerberusRoutes(env env.EnvApp, client cerberus.Client) Routable {
	return &cerberusRoutes{
		env:    env,
		client: client,
	}
}

func (r *cerberusRoutes) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("cerberus/token", func(c *gin.Context) { r.GetToken(c) })
}

func (r *cerberusRoutes) GetToken(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithStatusJSON(401, jsonError(fmt.Errorf("unauthorized")))
	}

	log.Println("User:", userId)

	token, err := r.client.GetToken(c.Copy())

	if err != nil {
		c.AbortWithStatusJSON(500, jsonError(err))
		return
	}

	c.JSON(http.StatusOK, jsonData(token))
}
