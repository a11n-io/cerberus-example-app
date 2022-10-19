package repositories

import (
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"log"
)

type AuthRepo interface {
	Save(userId, email, plainPassword, name string) (User, error)
	FindOneByEmailAndPassword(email string, password string) (User, error)
}

type User struct {
	Token string `json:"token"`
	Id    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type authRepo struct {
	db *sql.DB
}

func NewAuthRepo(db *sql.DB) AuthRepo {
	return &authRepo{
		db: db,
	}
}

func (r *authRepo) Save(userId, email, plainPassword, name string) (user User, err error) {

	encryptedPassword, err := encryptPassword(plainPassword)
	if err != nil {
		log.Println(err)
		return
	}

	tx, err := r.db.Begin()
	if err != nil {
		log.Println(err)
		return
	}
	stmt, err := tx.Prepare("insert into user(id, email, password, name) values(?, ?, ?, ?)")
	if err != nil {
		log.Println(err)
		return
	}
	defer stmt.Close()
	id := uuid.New().String()
	_, err = stmt.Exec(id, email, encryptedPassword, name)
	if err != nil {
		log.Println(err)
		return
	}

	err = tx.Commit()
	if err != nil {
		log.Println(err)
		return
	}

	user = User{
		Id:    id,
		Name:  name,
		Email: email,
	}

	return
}

func (r *authRepo) FindOneByEmailAndPassword(email string, plainPassword string) (user User, err error) {

	stmt, err := r.db.Prepare("select id, name, password from user where email = ?")
	if err != nil {
		log.Println(err)
		return
	}
	defer stmt.Close()
	var id, name, password string
	err = stmt.QueryRow(email).Scan(&id, &name, &password)
	if err != nil {
		err = fmt.Errorf("account not found or incorrect password")
		return
	}

	if !verifyPassword(plainPassword, password) {
		err = fmt.Errorf("account not found or incorrect password")
		return
	}

	user = User{
		Id:    id,
		Name:  name,
		Email: email,
	}

	return
}
