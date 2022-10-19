package routes

import (
	"cerberus-example-app/internal/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AuthData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name" `
}

type authRoutes struct {
	auth services.AuthService
}

func NewAuthRoutes(auth services.AuthService) Routable {
	return &authRoutes{auth: auth}
}

func (r *authRoutes) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("auth/register", func(c *gin.Context) { r.Register(c) })
	rg.POST("auth/login", func(c *gin.Context) { r.Login(c) })
}

func (r *authRoutes) Register(c *gin.Context) {
	var authData AuthData

	if err := c.Bind(&authData); err != nil {
		c.AbortWithError(400, err)
		return
	}

	user, err := r.auth.Register(
		authData.Email,
		authData.Password,
		authData.Name,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (r *authRoutes) Login(c *gin.Context) {
	email, password, ok := c.Request.BasicAuth()
	if !ok {
		c.AbortWithError(400, fmt.Errorf("invalid credentials"))
	}

	user, err := r.auth.Login(
		email,
		password,
	)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	c.JSON(http.StatusCreated, user)
}
