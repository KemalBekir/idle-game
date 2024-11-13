package server

import (
	"encoding/json"
	"net/http"

	"github.com/KemalBekir/idle-game/internal/config"
	"github.com/KemalBekir/idle-game/internal/game/services"
	"github.com/KemalBekir/idle-game/internal/server/handlers"
)

type Server struct {
	config           *config.Config
	miningService    *services.MiningService
	upgradeService   *services.UpgradeService
	gameStateService *services.GameStateService
}

func NewServer(
	config *config.Config,
	miningService *services.MiningService,
	upgradeService *services.UpgradeService,
	gameStateService *services.GameStateService,
) *Server {
	return &Server{
		config:           config,
		miningService:    miningService,
		upgradeService:   upgradeService,
		gameStateService: gameStateService,
	}
}

func (s *Server) setupRoutes() http.Handler {
	mux := http.NewServeMux()

	// Create handlers
	miningHandler := handlers.NewMiningHandler(s.miningService)
	upgradeHandler := handlers.NewUpgradeHandler(s.upgradeService)

	// API routes
	mux.HandleFunc("/api/mine", (miningHandler.HandleMine))
	mux.HandleFunc("/api/upgrade", (upgradeHandler.HandleUpgrade))
	mux.HandleFunc("/api/state", (s.handleGameState))

	// Serve static files
	fileServer := http.FileServer(http.Dir("web/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	return mux
}

func (s *Server) Start() error {
	handler := s.setupRoutes()
	println("Server starting....")
	return http.ListenAndServe(s.config.Address, handler)
}

func (s *Server) handleGameState(w http.ResponseWriter, r *http.Request) {
	// Fetch game state from the service
	gameState, err := s.gameStateService.GetGameState()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the game state
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gameState)
}
