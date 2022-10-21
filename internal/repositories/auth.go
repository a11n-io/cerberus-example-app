package repositories

import (
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"log"
)

type AuthRepo interface {
	Save(accountId, email, plainPassword, name string) (User, error)
	FindOneByEmailAndPassword(email string, password string) (User, error)
}

type User struct {
	Token     string `json:"token"`
	Id        string `json:"id"`
	AccountId string `json:"accountId"`
	Name      string `json:"name"`
	Email     string `json:"email"`
}

type authRepo struct {
	db *sql.DB
}

func NewAuthRepo(db *sql.DB) AuthRepo {
	return &authRepo{
		db: db,
	}
}

func (r *authRepo) Save(accountId, email, plainPassword, name string) (user User, err error) {

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
	stmt, err := tx.Prepare("insert into user(id, account_id, email, password, name) values(?, ?, ?, ?, ?)")
	if err != nil {
		log.Println(err)
		return
	}
	defer stmt.Close()
	id := uuid.New().String()
	_, err = stmt.Exec(id, accountId, email, encryptedPassword, name)
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
		Id:        id,
		AccountId: accountId,
		Name:      name,
		Email:     email,
	}

	return
}

func (r *authRepo) FindOneByEmailAndPassword(email string, plainPassword string) (user User, err error) {

	stmt, err := r.db.Prepare("select id, account_id, name, password from user where email = ?")
	if err != nil {
		log.Println(err)
		return
	}
	defer stmt.Close()
	var id, accountId, name, password string
	err = stmt.QueryRow(email).Scan(&id, &accountId, &name, &password)
	if err != nil {
		err = fmt.Errorf("account not found or incorrect password")
		return
	}

	if !verifyPassword(plainPassword, password) {
		err = fmt.Errorf("account not found or incorrect password")
		return
	}

	user = User{
		Id:        id,
		AccountId: accountId,
		Name:      name,
		Email:     email,
	}

	return
}
