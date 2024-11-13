package handlers

import (
	"net/http"

	"github.com/KemalBekir/idle-game/internal/game/services"
)

type UpgradeHandler struct {
	upgradeService *services.UpgradeService
}

func NewUpgradeHandler(upgradeService *services.UpgradeService) *UpgradeHandler {
	return &UpgradeHandler{upgradeService: upgradeService}
}

// HandleUpgrade handles the upgrade process
func (h *UpgradeHandler) HandleUpgrade(w http.ResponseWriter, r *http.Request) {
	// TODO - logic to handle upgrades
}
