package repository

import (
	"database/sql"

	"github.com/KemalBekir/idle-game/internal/game/models"
	_ "github.com/lib/pq"
)

type PostgresRepository struct {
	db *sql.DB
}

func NewPostgresRepository(connString string) (*PostgresRepository, error) {
	db, err := sql.Open("postgres", connString)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &PostgresRepository{db: db}, nil
}

func (r *PostgresRepository) SavePlayer(player *models.Player) error {
	query := `
        INSERT INTO players (id, minerals, mining_power)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE
        SET minerals = $2, mining_power = $3
    `

	_, err := r.db.Exec(query, player.ID, player.Minerals, player.MiningPower)
	return err
}
