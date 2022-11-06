package routes

import (
	"cerberus-example-app/internal/services"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
	"github.com/gin-gonic/gin"
	"net/http"
)

type UserData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
}

type userRoutes struct {
	userService    services.UserService
	cerberusClient cerberus.Client
}

func NewUserRoutes(userService services.UserService, cerberusClient cerberus.Client) Routable {
	return &userRoutes{userService: userService, cerberusClient: cerberusClient}
}

func (r *userRoutes) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("users", func(c *gin.Context) { r.Add(c) })
	rg.GET("users", func(c *gin.Context) { r.GetAll(c) })
}

func (r *userRoutes) Add(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithStatusJSON(401, jsonError(fmt.Errorf("unauthorized")))
	}

	accountId, exists := c.Get("accountId")
	if !exists {
		c.AbortWithStatusJSON(400, jsonError(fmt.Errorf("no accountId")))
	}

	hasAccess, err := r.cerberusClient.HasAccess(c, accountId.(string), userId.(string), accountId.(string), "AddUser")
	if err != nil || !hasAccess {
		c.AbortWithStatusJSON(http.StatusForbidden, jsonError(err))
		return
	}

	var userData UserData

	if err := c.Bind(&userData); err != nil {
		c.AbortWithStatusJSON(400, jsonError(err))
		return
	}

	user, err := r.userService.Add(
		c,
		userData.Email,
		userData.Password,
		userData.Name,
		userData.Role,
	)
	if err != nil {
		c.AbortWithStatusJSON(500, jsonError(err))
		return
	}

	c.JSON(http.StatusCreated, jsonData(user))
}

func (r *userRoutes) GetAll(c *gin.Context) {

	user, err := r.userService.GetAll(
		c,
	)
	if err != nil {
		c.AbortWithStatusJSON(400, jsonError(err))
		return
	}

	c.JSON(http.StatusCreated, jsonData(user))
}
