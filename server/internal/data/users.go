package data

import (
	"database/sql"
	"time"
)

var AnonymousUser = &User{}

type User struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Version   int       `json"-"`
}

type UserModel struct {
	DB *sql.DB
}

func SaveNewPlayerInDB(id string) error {
	return nil
}

func LoadPlayerProgressFromDB(id string) error {
	return nil
}
