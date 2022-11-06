package services

import (
	"cerberus-example-app/internal/repositories"
	"context"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
)

type ProjectService interface {
	Create(ctx context.Context, accountId, name, description string) (repositories.Project, error)
	FindAll(ctx context.Context, accountId string) ([]repositories.Project, error)
	Get(ctx context.Context, projectId string) (repositories.Project, error)
}

type projectService struct {
	repo           repositories.ProjectRepo
	cerberusClient cerberus.Client
}

func NewProjectService(
	repo repositories.ProjectRepo,
	cerberusClient cerberus.Client) ProjectService {
	return &projectService{
		repo:           repo,
		cerberusClient: cerberusClient,
	}
}

func (s *projectService) Create(ctx context.Context, accountId, name, description string) (repositories.Project, error) {

	userId := ctx.Value("userId")
	if userId == nil {
		return repositories.Project{}, fmt.Errorf("no userId")
	}

	project, err := s.repo.Create(accountId, name, description)

	_, err = s.cerberusClient.CreateResource(ctx, accountId, project.Id, accountId, "Project")
	if err != nil {
		return repositories.Project{}, err
	}

	err = s.cerberusClient.CreatePermission(ctx, accountId, userId.(string), project.Id, []string{"ManageProject"})
	if err != nil {
		return repositories.Project{}, err
	}

	return project, nil
}

func (s *projectService) FindAll(ctx context.Context, accountId string) ([]repositories.Project, error) {
	return s.repo.FindByAccount(accountId)
}

func (s *projectService) Get(ctx context.Context, projectId string) (repositories.Project, error) {
	return s.repo.Get(projectId)
}
