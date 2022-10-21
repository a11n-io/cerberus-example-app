package routes

import (
	"cerberus-example-app/internal/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type ProjectData struct {
	Name        string `json:"name" `
	Description string `json:"description"`
}

type projectRoutes struct {
	service services.ProjectService
}

func NewProjectRoutes(service services.ProjectService) Routable {
	return &projectRoutes{service: service}
}

func (r *projectRoutes) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("accounts/:accountId/projects", func(c *gin.Context) { r.Create(c) })
	rg.GET("accounts/:accountId/projects", func(c *gin.Context) { r.FindAll(c) })
	rg.GET("projects/:projectId", func(c *gin.Context) { r.Get(c) })
}

func (r *projectRoutes) Create(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	var projectData ProjectData

	accountId := c.Param("accountId")
	if accountId == "" {
		c.AbortWithError(400, fmt.Errorf("missing accountId"))
		return
	}

	if err := c.Bind(&projectData); err != nil {
		c.AbortWithError(400, err)
		return
	}

	project, err := r.service.Create(
		accountId,
		projectData.Name,
		projectData.Description,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusCreated, project)
}

func (r *projectRoutes) FindAll(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	accountId := c.Param("accountId")
	if accountId == "" {
		c.AbortWithError(400, fmt.Errorf("missing accountId"))
		return
	}

	projects, err := r.service.FindAll(
		accountId,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusOK, projects)
}

func (r *projectRoutes) Get(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	projectId := c.Param("projectId")
	if projectId == "" {
		c.AbortWithError(400, fmt.Errorf("missing projectId"))
		return
	}

	project, err := r.service.Get(
		projectId,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusOK, project)
}
