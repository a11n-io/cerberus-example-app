package services

import (
	"cerberus-example-app/internal/database"
	"cerberus-example-app/internal/repositories"
	"cerberus-example-app/internal/services/jwtutils"
	"context"
	"fmt"
	cerberus "github.com/a11n-io/go-cerberus"
	"github.com/google/uuid"
	"log"
)

type UserService interface {
	Register(ctx context.Context, email, plainPassword, name string) (repositories.User, error)
	Login(ctx context.Context, email string, password string) (repositories.User, error)
	Add(ctx context.Context, email, plainPassword, name, roleId string) (repositories.User, error)
	GetAll(ctx context.Context) ([]cerberus.User, error)
}

type userService struct {
	txProvider     database.TxProvider
	userRepo       repositories.UserRepo
	accountRepo    repositories.AccountRepo
	jwtSecret      string
	saltRounds     int
	cerberusClient cerberus.CerberusClient
}

func NewUserService(
	txProvider database.TxProvider,
	userRepo repositories.UserRepo,
	accountRepo repositories.AccountRepo,
	jwtSecret string,
	saltRounds int,
	cerberusClient cerberus.CerberusClient) UserService {
	return &userService{
		txProvider:     txProvider,
		userRepo:       userRepo,
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
func (s *userService) Register(ctx context.Context, email, plainPassword, name string) (_ repositories.User, err error) {

	log.Println("Register", email, plainPassword, name)

	tx, err := s.txProvider.GetTransaction()
	if err != nil {
		return repositories.User{}, err
	}

	account, err := s.accountRepo.Create(tx)
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	user, err := s.userRepo.Save(account.Id, email, plainPassword, name, tx)
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	// CERBERUS create account resource, user and role
	log.Println("Creating Cerberus artifacts")
	cerberusToken, err := s.cerberusClient.GetUserToken(ctx, account.Id, user.Id)
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	cerberusContext := context.WithValue(ctx, "cerberusToken", cerberusToken)

	roleId := uuid.New().String()

	err = s.cerberusClient.Execute(cerberusContext,
		s.cerberusClient.CreateAccountCmd(account.Id),
		s.cerberusClient.CreateResourceCmd(account.Id, "", "Account"),
		s.cerberusClient.CreateUserCmd(user.Id, user.Email, user.Name),
		s.cerberusClient.CreateRoleCmd(roleId, "AccountAdministrator"),
		s.cerberusClient.AssignRoleCmd(roleId, user.Id),
		s.cerberusClient.CreatePermissionCmd(roleId, account.Id, []string{"CanManageAccount"}))
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	subject := user.Id
	token, err := jwtutils.Sign(subject, toClaims(user, cerberusToken), s.jwtSecret)
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	return userWithTokens(user, token, cerberusToken), tx.Commit()
}

// Login finds a user and returns that user with a jwt token
func (s *userService) Login(ctx context.Context, email string, password string) (_ repositories.User, err error) {

	user, err := s.userRepo.FindOneByEmailAndPassword(email, password)
	if err != nil {
		return repositories.User{}, err
	}

	// get cerberus token
	cerberusToken, err := s.cerberusClient.GetUserToken(ctx, user.AccountId, user.Id)
	if err != nil {
		return repositories.User{}, err
	}

	subject := user.Id
	token, err := jwtutils.Sign(subject, toClaims(user, cerberusToken), s.jwtSecret)
	if err != nil {
		return repositories.User{}, err
	}

	return userWithTokens(user, token, cerberusToken), nil
}

func (s *userService) Add(ctx context.Context, email, plainPassword, name, roleId string) (_ repositories.User, err error) {

	accountId := ctx.Value("accountId")
	if accountId == nil {
		return repositories.User{}, fmt.Errorf("no accountId")
	}

	tx, err := s.txProvider.GetTransaction()
	if err != nil {
		return repositories.User{}, err
	}

	user, err := s.userRepo.Save(accountId.(string), email, plainPassword, name, tx)
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	err = s.cerberusClient.Execute(ctx,
		s.cerberusClient.CreateUserCmd(user.Id, user.Email, user.Name),
		s.cerberusClient.AssignRoleCmd(roleId, user.Id))
	if err != nil {
		if rbe := tx.Rollback(); rbe != nil {
			err = fmt.Errorf("rollback error (%v) after %w", rbe, err)
		}
		return repositories.User{}, err
	}

	return user, tx.Commit()
}

func (s *userService) GetAll(ctx context.Context) (_ []cerberus.User, err error) {

	accountId := ctx.Value("accountId")
	if accountId == nil {
		return []cerberus.User{}, fmt.Errorf("no accountId")
	}

	return s.cerberusClient.GetUsers(ctx)
}

func toClaims(user repositories.User, cerberusToken string) map[string]interface{} {
	return map[string]interface{}{
		"sub":           user.Id,
		"email":         user.Email,
		"name":          user.Name,
		"accountId":     user.AccountId,
		"cerberusToken": cerberusToken,
	}
}

func userWithTokens(user repositories.User, token, cerberusToken string) repositories.User {
	return repositories.User{
		Token:         token,
		CerberusToken: cerberusToken,
		Id:            user.Id,
		AccountId:     user.AccountId,
		Email:         user.Email,
		Name:          user.Name,
	}
}
