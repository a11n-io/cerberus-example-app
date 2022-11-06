package services

import (
	"cerberus-example-app/internal/repositories"
	"context"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
)

type StoryService interface {
	Create(ctx context.Context, sprintId, description string) (repositories.Story, error)
	FindBySprint(ctx context.Context, sprintId string) ([]repositories.Story, error)
	Get(ctx context.Context, storyId string) (repositories.Story, error)
	Assign(ctx context.Context, storyId, userId string) (repositories.Story, error)
	Estimate(ctx context.Context, storyId string, estimation int) (repositories.Story, error)
	ChangeStatus(ctx context.Context, storyId, status string) (repositories.Story, error)
}

type storyService struct {
	repo           repositories.StoryRepo
	cerberusClient cerberus.Client
}

func NewStoryService(
	repo repositories.StoryRepo,
	cerberusClient cerberus.Client) StoryService {
	return &storyService{
		repo:           repo,
		cerberusClient: cerberusClient,
	}
}

func (s *storyService) Create(ctx context.Context, sprintId, description string) (repositories.Story, error) {

	userId := ctx.Value("userId")
	if userId == nil {
		return repositories.Story{}, fmt.Errorf("no userId")
	}

	accountId := ctx.Value("accountId")
	if accountId == nil {
		return repositories.Story{}, fmt.Errorf("no accountId")
	}

	story, err := s.repo.Create(sprintId, description)
	if err != nil {
		return repositories.Story{}, err
	}

	_, err = s.cerberusClient.CreateResource(ctx, accountId.(string), story.Id, sprintId, "Story")
	if err != nil {
		return repositories.Story{}, err
	}

	err = s.cerberusClient.CreatePermission(ctx, accountId.(string), userId.(string), story.Id, []string{"ManageStory"})
	if err != nil {
		return repositories.Story{}, err
	}

	return s.repo.Get(story.Id)
}

func (s *storyService) FindBySprint(ctx context.Context, sprintId string) ([]repositories.Story, error) {
	return s.repo.FindBySprint(sprintId)
}

func (s *storyService) Get(ctx context.Context, storyId string) (repositories.Story, error) {
	return s.repo.Get(storyId)
}

func (s *storyService) Assign(ctx context.Context, storyId, userId string) (repositories.Story, error) {
	_, err := s.repo.Assign(storyId, userId)
	if err != nil {
		return repositories.Story{}, err
	}
	return s.repo.Get(storyId)
}

func (s *storyService) Estimate(ctx context.Context, storyId string, estimation int) (repositories.Story, error) {
	_, err := s.repo.Estimate(storyId, estimation)
	if err != nil {
		return repositories.Story{}, err
	}
	return s.repo.Get(storyId)
}

func (s *storyService) ChangeStatus(ctx context.Context, storyId, status string) (repositories.Story, error) {
	_, err := s.repo.ChangeStatus(storyId, status)
	if err != nil {
		return repositories.Story{}, err
	}
	return s.repo.Get(storyId)
}
