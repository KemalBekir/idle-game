// services/upgrade_service.go
package services

import (
	"github.com/KemalBekir/idle-game/internal/game/models"
	"github.com/KemalBekir/idle-game/internal/game/repository"
)

type UpgradeService struct {
	repo repository.GameRepository // Assuming GameRepository has upgrade-related methods
}

func NewUpgradeService(repo repository.GameRepository) *UpgradeService {
	return &UpgradeService{repo: repo}
}

// Example method to retrieve upgrades
func (s *UpgradeService) GetUpgrades() ([]models.Upgrade, error) {
	return s.repo.GetUpgrades()
}
