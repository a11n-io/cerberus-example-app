package services

import (
	"cerberus-example-app/internal/repositories"
	"cerberus-example-app/internal/services/jwtutils"
	"context"
	"github.com/google/uuid"
	cerberus "github.com/superkruger/go-cerberus"
	"log"
)

type AuthService interface {
	Register(email, plainPassword, name string) (repositories.User, error)
	Login(email string, password string) (repositories.User, error)
}

type authService struct {
	authRepo       repositories.AuthRepo
	accountRepo    repositories.AccountRepo
	jwtSecret      string
	saltRounds     int
	cerberusClient cerberus.Client
}

func NewAuthService(
	authRepo repositories.AuthRepo,
	accountRepo repositories.AccountRepo,
	jwtSecret string,
	saltRounds int,
	cerberusClient cerberus.Client) AuthService {
	return &authService{
		authRepo:       authRepo,
		accountRepo:    accountRepo,
		jwtSecret:      jwtSecret,
		saltRounds:     saltRounds,
		cerberusClient: cerberusClient,
	}
}

// Register should register a new user
//
// The properties also be used to generate a JWT `token` which should be included
// with the returned user.
func (s *authService) Register(email, plainPassword, name string) (_ repositories.User, err error) {

	log.Println("Register", email, plainPassword, name)

	account, err := s.accountRepo.Create()
	if err != nil {
		return repositories.User{}, err
	}

	user, err := s.authRepo.Save(account.Id, email, plainPassword, name)
	if err != nil {
		return repositories.User{}, err
	}

	// CERBERUS create account resource, user and role
	log.Println("Creating Cerberus artifacts")
	ctx := context.Background()
	jwtToken, err := s.cerberusClient.GetToken(ctx)
	if err != nil {
		return repositories.User{}, err
	}

	_, err = s.cerberusClient.CreateAccount(ctx, jwtToken, account.Id)
	if err != nil {
		return repositories.User{}, err
	}

	_, err = s.cerberusClient.CreateResource(ctx, jwtToken, account.Id, account.Id, "Account")
	if err != nil {
		return repositories.User{}, err
	}

	_, err = s.cerberusClient.CreateUser(ctx, jwtToken, account.Id, user.Id, user.Email, user.Name)
	if err != nil {
		return repositories.User{}, err
	}

	roleId := uuid.New().String()
	_, err = s.cerberusClient.CreateRole(ctx, jwtToken, account.Id, roleId, "AccountAdministrator")
	if err != nil {
		return repositories.User{}, err
	}

	err = s.cerberusClient.AssignRole(ctx, jwtToken, account.Id, roleId, user.Id)
	if err != nil {
		return repositories.User{}, err
	}

	err = s.cerberusClient.CreatePermission(ctx, jwtToken, account.Id, roleId, account.Id, []string{"ManageAccount"})
	if err != nil {
		return repositories.User{}, err
	}

	subject := user.Id
	token, err := jwtutils.Sign(subject, userToClaims(user), s.jwtSecret)
	if err != nil {
		return repositories.User{}, err
	}

	return userWithToken(user, token), nil
}

// Login finds a user and returns that user with a jwt token
func (s *authService) Login(email string, password string) (_ repositories.User, err error) {

	user, err := s.authRepo.FindOneByEmailAndPassword(email, password)
	if err != nil {
		return repositories.User{}, err
	}

	subject := user.Id
	token, err := jwtutils.Sign(subject, userToClaims(user), s.jwtSecret)
	if err != nil {
		return repositories.User{}, err
	}

	return userWithToken(user, token), nil
}

func userToClaims(user repositories.User) map[string]interface{} {
	return map[string]interface{}{
		"sub":   user.Id,
		"email": user.Email,
		"name":  user.Name,
	}
}

func userWithToken(user repositories.User, token string) repositories.User {
	return repositories.User{
		Token:     token,
		Id:        user.Id,
		AccountId: user.AccountId,
		Email:     user.Email,
		Name:      user.Name,
	}
}
