package repository

import "github.com/KemalBekir/idle-game/internal/game/models"

type GameRepository interface {
	GetPlayer(id string) (*models.Player, error)
	SavePlayer(player *models.Player) error
	GetUpgrades() ([]models.Upgrade, error)
	SaveGameState(state *models.GameState) error
	LoadGameState() (*models.GameState, error)
	SaveMarketOrder(order *models.MarketOrder) error
	GetResearch(researchID string) (*models.Research, error)
}
