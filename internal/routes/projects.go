package routes

import (
	"cerberus-example-app/internal/services"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ProjectData struct {
	Name        string `json:"name" `
	Description string `json:"description"`
}

type projectRoutes struct {
	service        services.ProjectService
	cerberusClient cerberus.Client
}

func NewProjectRoutes(service services.ProjectService, cerberusClient cerberus.Client) Routable {
	return &projectRoutes{service: service, cerberusClient: cerberusClient}
}

func (r *projectRoutes) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("accounts/:accountId/projects", func(c *gin.Context) { r.Create(c) })
	rg.GET("accounts/:accountId/projects", func(c *gin.Context) { r.FindAll(c) })
	rg.GET("projects/:projectId", func(c *gin.Context) { r.Get(c) })
}

func (r *projectRoutes) Create(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithStatusJSON(401, jsonError(fmt.Errorf("unauthorized")))
	}

	var projectData ProjectData

	accountId := c.Param("accountId")
	if accountId == "" {
		c.AbortWithStatusJSON(400, jsonError(fmt.Errorf("missing accountId")))
		return
	}

	hasAccess, err := r.cerberusClient.HasAccess(c, accountId, userId.(string), accountId, "CreateProject")
	if err != nil || !hasAccess {
		c.AbortWithStatusJSON(http.StatusForbidden, jsonError(err))
		return
	}

	if err := c.Bind(&projectData); err != nil {
		c.AbortWithStatusJSON(400, jsonError(err))
		return
	}

	project, err := r.service.Create(
		c,
		accountId,
		projectData.Name,
		projectData.Description,
	)
	if err != nil {
		c.AbortWithStatusJSON(500, jsonError(err))
		return
	}

	c.JSON(http.StatusCreated, jsonData(project))
}

func (r *projectRoutes) FindAll(c *gin.Context) {
	//userId, exists := c.Get("userId")
	//if !exists {
	//	c.AbortWithStatusJSON(401, jsonError(fmt.Errorf("unauthorized")))
	//}

	accountId := c.Param("accountId")
	if accountId == "" {
		c.AbortWithStatusJSON(400, jsonError(fmt.Errorf("missing accountId")))
		return
	}

	projects, err := r.service.FindAll(
		c,
		accountId,
	)
	if err != nil {
		c.AbortWithStatusJSON(500, jsonError(err))
		return
	}

	c.JSON(http.StatusOK, jsonData(projects))
}

func (r *projectRoutes) Get(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithStatusJSON(401, jsonError(fmt.Errorf("unauthorized")))
	}

	accountId, exists := c.Get("accountId")
	if !exists {
		c.AbortWithStatusJSON(400, jsonError(fmt.Errorf("no accountId")))
	}

	projectId := c.Param("projectId")
	if projectId == "" {
		c.AbortWithStatusJSON(400, jsonError(fmt.Errorf("missing projectId")))
		return
	}

	hasAccess, err := r.cerberusClient.HasAccess(c, accountId.(string), userId.(string), projectId, "ReadProject")
	if err != nil || !hasAccess {
		c.AbortWithStatusJSON(http.StatusForbidden, jsonError(err))
		return
	}

	project, err := r.service.Get(
		c,
		projectId,
	)
	if err != nil {
		c.AbortWithStatusJSON(500, jsonError(err))
		return
	}

	c.JSON(http.StatusOK, jsonData(project))
}
