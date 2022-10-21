package services

import (
	"cerberus-example-app/internal/repositories"
)

type ProjectService interface {
	Create(accountId, name, description string) (repositories.Project, error)
	FindAll(accountId string) ([]repositories.Project, error)
	Get(projectId string) (repositories.Project, error)
}

type projectService struct {
	repo repositories.ProjectRepo
}

func NewProjectService(repo repositories.ProjectRepo) ProjectService {
	return &projectService{
		repo: repo,
	}
}

func (s *projectService) Create(accountId, name, description string) (repositories.Project, error) {
	return s.repo.Create(accountId, name, description)
}

func (s *projectService) FindAll(accountId string) ([]repositories.Project, error) {
	return s.repo.FindByAccount(accountId)
}

func (s *projectService) Get(projectId string) (repositories.Project, error) {
	return s.repo.Get(projectId)
}
