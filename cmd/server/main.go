package main

import (
	"log"

	"github.com/KemalBekir/idle-game/internal/config"
	"github.com/KemalBekir/idle-game/internal/game/repository"
	"github.com/KemalBekir/idle-game/internal/game/services"
	"github.com/KemalBekir/idle-game/internal/server"
)

func main() {
	cfg := config.Load()

	// Initialize repositories
	gameRepo := repository.NewMemoryRepository()

	// Initialize services
	miningService := services.NewMiningService(gameRepo)
	upgradeService := services.NewUpgradeService(gameRepo)
	gameStateService := services.NewGameStateService(gameRepo)

	// Initialize and start server
	srv := server.NewServer(cfg, miningService, upgradeService, gameStateService)
	log.Fatal(srv.Start())
}
