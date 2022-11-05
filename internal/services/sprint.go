package services

import (
	"cerberus-example-app/internal/repositories"
	"context"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
)

type SprintService interface {
	Create(ctx context.Context, projectId, goal string) (repositories.Sprint, error)
	FindByProject(ctx context.Context, projectId string) ([]repositories.Sprint, error)
	Get(ctx context.Context, sprintId string) (repositories.Sprint, error)
	Start(ctx context.Context, sprintId string) (repositories.Sprint, error)
	End(ctx context.Context, sprintId string) (repositories.Sprint, error)
}

type sprintService struct {
	repo           repositories.SprintRepo
	cerberusClient cerberus.Client
}

func NewSprintService(
	repo repositories.SprintRepo,
	cerberusClient cerberus.Client) SprintService {
	return &sprintService{
		repo:           repo,
		cerberusClient: cerberusClient,
	}
}

func (s *sprintService) Create(ctx context.Context, projectId, goal string) (repositories.Sprint, error) {

	sprint, err := s.repo.Create(projectId, goal)
	if err != nil {
		return repositories.Sprint{}, err
	}

	accountId := ctx.Value("accountId")
	if accountId == nil {
		return repositories.Sprint{}, fmt.Errorf("no accountId")
	}

	_, err = s.cerberusClient.CreateResource(ctx, accountId.(string), sprint.Id, projectId, "Sprint")
	if err != nil {
		return repositories.Sprint{}, err
	}

	return s.repo.Get(sprint.Id)
}

func (s *sprintService) FindByProject(ctx context.Context, projectId string) ([]repositories.Sprint, error) {
	return s.repo.FindByProject(projectId)
}

func (s *sprintService) Get(ctx context.Context, sprintId string) (repositories.Sprint, error) {
	return s.repo.Get(sprintId)
}

func (s *sprintService) Start(ctx context.Context, sprintId string) (repositories.Sprint, error) {
	_, err := s.repo.Start(sprintId)
	if err != nil {
		return repositories.Sprint{}, err
	}
	return s.repo.Get(sprintId)
}

func (s *sprintService) End(ctx context.Context, sprintId string) (repositories.Sprint, error) {
	_, err := s.repo.End(sprintId)
	if err != nil {
		return repositories.Sprint{}, err
	}
	return s.repo.Get(sprintId)
}
