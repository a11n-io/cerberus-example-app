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
	cerberus "github.com/a11n-io/go-cerberus"
	"github.com/golang-migrate/migrate/v4"
	cerberusmigrate "github.com/golang-migrate/migrate/v4/database/cerberus"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"log"
)

func main() {
	// App context
	ctx := context.Background()

	// env config
	_env := env.GetEnv(".env.dev")

	cerberusClient := cerberus.NewClient(fmt.Sprintf("http://%s:%s", _env.CERBERUS_HOST, _env.CERBERUS_PORT),
		_env.CERBERUS_API_KEY, _env.CERBERUS_API_SECRET)

	//cerberusToken, err := cerberusClient.GetToken(ctx)
	//if err != nil {
	//	log.Fatalf("could not get cerberus token %v", err.Error())
	//}
	//
	//context := context.WithValue(ctx, "cerberusToken", cerberusToken)
	//err = cerberusClient.Migrate(context, "(CreateResourceType \"RTRT\" \"\")")
	//if err != nil {
	//	log.Fatalf("could not migrate cerberus %v", err.Error())
	//}

	db, err := database.NewDB()
	utils.PanicOnError(err)
	defer func() {
		utils.PanicOnError(db.Close())
	}()

	cdriver, err := cerberusmigrate.WithInstance(cerberusClient, &cerberusmigrate.Config{})
	if err != nil {
		log.Fatalf("could not get cerberus driver: %v", err.Error())
	}
	cm, err := migrate.NewWithDatabaseInstance(
		"file://cerberusmigrations", "cerberus", cdriver)
	if err != nil {
		log.Fatalf("could not get cerberus migrate: %v", err.Error())
	} else {
		if err := cm.Up(); err != nil {
			log.Println(err)
		}
		log.Println("cerberus migration done")
	}

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
		log.Println("sqlite migration done")
	}

	userService := services.NewUserService(
		repositories.NewUserRepo(db),
		repositories.NewAccountRepo(db),
		_env.JWT_SECRET, _env.SALT_ROUNDS, cerberusClient)

	publicRoutes := publicRoutes(userService)

	privateRoutes := privateRoutes(
		cerberusClient,
		userService,
		services.NewProjectService(repositories.NewProjectRepo(db), cerberusClient),
		services.NewSprintService(repositories.NewSprintRepo(db), cerberusClient),
		services.NewStoryService(repositories.NewStoryRepo(db), cerberusClient))

	// Run server with context
	webserver := server.NewWebServer(ctx, _env.APP_PORT, _env.JWT_SECRET, publicRoutes, privateRoutes)
	webserver.Start()
}

func publicRoutes(
	authService services.UserService) []routes.Routable {
	return []routes.Routable{
		routes.NewAuthRoutes(authService),
	}
}

func privateRoutes(
	cerberusClient cerberus.Client,
	userService services.UserService,
	projectService services.ProjectService,
	sprintService services.SprintService,
	storyService services.StoryService) []routes.Routable {
	return []routes.Routable{
		routes.NewUserRoutes(userService, cerberusClient),
		routes.NewProjectRoutes(projectService, cerberusClient),
		routes.NewSprintRoutes(sprintService, cerberusClient),
		routes.NewStoryRoutes(storyService, cerberusClient),
	}
}
