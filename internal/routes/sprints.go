package routes

import (
	"cerberus-example-app/internal/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type SprintData struct {
	Goal string `json:"goal"`
}

type sprintRoutes struct {
	service services.SprintService
}

func NewSprintRoutes(service services.SprintService) Routable {
	return &sprintRoutes{service: service}
}

func (r *sprintRoutes) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("projects/:projectId/sprints", func(c *gin.Context) { r.Create(c) })
	rg.GET("projects/:projectId/sprints", func(c *gin.Context) { r.FindByProject(c) })
	rg.GET("sprints/:sprintId", func(c *gin.Context) { r.Get(c) })
	rg.POST("sprints/:sprintId/start", func(c *gin.Context) { r.Start(c) })
	rg.POST("sprints/:sprintId/end", func(c *gin.Context) { r.End(c) })
}

func (r *sprintRoutes) Create(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	var resourceTypeData SprintData

	projectId := c.Param("projectId")
	if projectId == "" {
		c.AbortWithError(400, fmt.Errorf("missing projectId"))
		return
	}

	if err := c.Bind(&resourceTypeData); err != nil {
		c.AbortWithError(400, err)
		return
	}

	sprint, err := r.service.Create(
		projectId,
		resourceTypeData.Goal,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusCreated, sprint)
}

func (r *sprintRoutes) FindByProject(c *gin.Context) {
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

	sprints, err := r.service.FindByProject(
		projectId,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusOK, sprints)
}

func (r *sprintRoutes) Start(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	sprintId := c.Param("sprintId")
	if sprintId == "" {
		c.AbortWithError(400, fmt.Errorf("missing sprintId"))
		return
	}

	rts, err := r.service.Start(
		sprintId,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusOK, rts)
}

func (r *sprintRoutes) End(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	sprintId := c.Param("sprintId")
	if sprintId == "" {
		c.AbortWithError(400, fmt.Errorf("missing sprintId"))
		return
	}

	rts, err := r.service.End(
		sprintId,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusOK, rts)
}

func (r *sprintRoutes) Get(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
	}

	log.Println("User:", userId)

	sprintId := c.Param("sprintId")
	if sprintId == "" {
		c.AbortWithError(400, fmt.Errorf("missing sprintId"))
		return
	}

	sprint, err := r.service.Get(
		sprintId,
	)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(http.StatusOK, sprint)
}
