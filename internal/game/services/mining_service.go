package services

import (
	"github.com/KemalBekir/idle-game/internal/game/models"
	"github.com/KemalBekir/idle-game/internal/game/repository"
)

type MiningService struct {
	repo repository.GameRepository
}

func NewMiningService(repo repository.GameRepository) *MiningService {
	return &MiningService{repo: repo}
}

func (s *MiningService) Mine(playerID string) error {
	player, err := s.repo.GetPlayer(playerID)
	if err != nil {
		return err
	}

	// Calculate mining yield based on player's mining power and upgrades
	yield := s.calculateYield(player)
	player.Minerals += yield

	return s.repo.SavePlayer(player)
}

func (s *MiningService) calculateYield(player *models.Player) float64 {
	baseYield := player.MiningPower

	// Apply modifiers from upgrades
	for _, upgrade := range player.Upgrades {
		baseYield *= upgrade.Multiplier
	}

	return baseYield
}

func (s *MiningService) GetPlayer(playerID string) (*models.Player, error) {
	return s.repo.GetPlayer(playerID)
}
