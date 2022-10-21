package main

import (
	"cerberus-example-app/env"
	"cerberus-example-app/internal/database"
	"cerberus-example-app/internal/repositories"
	"cerberus-example-app/internal/routes"
	"cerberus-example-app/internal/server"
	"cerberus-example-app/internal/services"
	"cerberus-example-app/internal/utils"
	"context"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	cerberus "github.com/superkruger/go-cerberus"
	"log"
)

func main() {
	// App context
	ctx := context.Background()

	// env config
	_env := env.GetEnv(".env.dev")

	log.Println("New Client", _env.CERBERUS_API_SECRET)

	cerberusClient := cerberus.NewClient(fmt.Sprintf("http://%s:%s", _env.CERBERUS_HOST, _env.CERBERUS_PORT),
		_env.CERBERUS_API_KEY, _env.CERBERUS_API_SECRET)

	db, err := database.NewDB()
	utils.PanicOnError(err)
	defer func() {
		utils.PanicOnError(db.Close())
	}()

	// migrate
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations", "sqlite3", driver)
	if err != nil {
		log.Println(err)
	} else {
		if err := m.Up(); err != nil {
			log.Println(err)
		}
		log.Println("migration done")
	}
	publicRoutes := publicRoutes(
		services.NewAuthService(repositories.NewAuthRepo(db), repositories.NewAccountRepo(db), _env.JWT_SECRET, _env.SALT_ROUNDS),
	)

	privateRoutes := privateRoutes(
		_env,
		cerberusClient,
		services.NewProjectService(repositories.NewProjectRepo(db)),
		services.NewSprintService(repositories.NewSprintRepo(db)))

	// Run server with context
	webserver := server.NewWebServer(ctx, _env.APP_PORT, _env.JWT_SECRET, publicRoutes, privateRoutes)
	webserver.Start()
}

func publicRoutes(
	authService services.AuthService) []routes.Routable {
	return []routes.Routable{
		routes.NewAuthRoutes(authService),
	}
}

func privateRoutes(
	env env.EnvApp,
	cerberusClient cerberus.Client,
	projectService services.ProjectService,
	sprintService services.SprintService) []routes.Routable {
	return []routes.Routable{
		routes.NewCerberusRoutes(env, cerberusClient),
		routes.NewProjectRoutes(projectService),
		routes.NewSprintRoutes(sprintService),
	}
}
