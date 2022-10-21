package repositories

import (
	"database/sql"
	"github.com/google/uuid"
	"log"
)

type AccountRepo interface {
	Create() (Account, error)
}

type Account struct {
	Id string `json:"id"`
}

type accountRepo struct {
	db *sql.DB
}

func NewAccountRepo(db *sql.DB) AccountRepo {
	return &accountRepo{
		db: db,
	}
}

func (r *accountRepo) Create() (account Account, err error) {

	tx, err := r.db.Begin()
	if err != nil {
		log.Println(err)
		return
	}
	stmt, err := tx.Prepare("insert into account(id) values(?)")
	if err != nil {
		log.Println(err)
		return
	}
	defer stmt.Close()
	id := uuid.New().String()
	_, err = stmt.Exec(id)
	if err != nil {
		log.Println(err)
		return
	}

	err = tx.Commit()
	if err != nil {
		log.Println(err)
		return
	}

	account = Account{
		Id: id,
	}

	return
}
