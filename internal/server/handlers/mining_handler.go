package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/KemalBekir/idle-game/internal/game/services"
)

type MiningHandler struct {
	miningService *services.MiningService
}

func NewMiningHandler(miningService *services.MiningService) *MiningHandler {
	return &MiningHandler{miningService: miningService}
}

func (h *MiningHandler) HandleMine(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get player ID from session/token
	playerID := r.Context().Value("playerID").(string)

	err := h.miningService.Mine(playerID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return updated game state
	player, _ := h.miningService.GetPlayer(playerID)
	json.NewEncoder(w).Encode(player)
}
