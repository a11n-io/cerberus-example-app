package services

import (
	"cerberus-example-app/internal/repositories"
)

type SprintService interface {
	Create(projectId, goal string) (repositories.Sprint, error)
	FindByProject(projectId string) ([]repositories.Sprint, error)
	Get(sprintId string) (repositories.Sprint, error)
	Start(sprintId string) (repositories.Sprint, error)
	End(sprintId string) (repositories.Sprint, error)
}

type sprintService struct {
	repo repositories.SprintRepo
}

func NewSprintService(repo repositories.SprintRepo) SprintService {
	return &sprintService{
		repo: repo,
	}
}

func (s *sprintService) Create(projectId, goal string) (repositories.Sprint, error) {
	sprint, err := s.repo.Create(projectId, goal)
	if err != nil {
		return repositories.Sprint{}, err
	}

	return s.repo.Get(sprint.Id)
}

func (s *sprintService) FindByProject(projectId string) ([]repositories.Sprint, error) {
	return s.repo.FindByProject(projectId)
}

func (s *sprintService) Get(sprintId string) (repositories.Sprint, error) {
	return s.repo.Get(sprintId)
}

func (s *sprintService) Start(sprintId string) (repositories.Sprint, error) {
	_, err := s.repo.Start(sprintId)
	if err != nil {
		return repositories.Sprint{}, err
	}
	return s.repo.Get(sprintId)
}

func (s *sprintService) End(sprintId string) (repositories.Sprint, error) {
	_, err := s.repo.End(sprintId)
	if err != nil {
		return repositories.Sprint{}, err
	}
	return s.repo.Get(sprintId)
}
