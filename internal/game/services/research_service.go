package services

import (
	"errors"
	"log"
	"time"

	"github.com/KemalBekir/idle-game/internal/game/models"
	"github.com/KemalBekir/idle-game/internal/game/repository"
)

type ResearchService struct {
	repo repository.GameRepository
}

func (s *ResearchService) StartResearch(playerID string, researchID string) error {
	player, err := s.repo.GetPlayer(playerID)
	if err != nil {
		return err
	}

	research, err := s.repo.GetResearch(researchID)
	if err != nil {
		return err
	}

	if player.Minerals < research.Cost {
		return errors.New("insufficient minerals")
	}

	player.Minerals -= research.Cost
	research.IsCompleted = false

	// Start research completion timer
	go s.processResearch(playerID, research)

	return s.repo.SavePlayer(player)
}

func (s *ResearchService) processResearch(playerID string, research *models.Research) {
	time.Sleep(time.Duration(research.TimeToComplete) * time.Second)

	player, err := s.repo.GetPlayer(playerID)
	if err != nil {
		log.Printf("Error processing research: %v", err)
		return
	}

	research.IsCompleted = true
	s.applyResearchBonus(player, research)

	if err := s.repo.SavePlayer(player); err != nil {
		log.Printf("Error saving player after research: %v", err)
	}
}

func (s *ResearchService) applyResearchBonus(player *models.Player, research *models.Research) {
	// Example of applying a bonus
	switch research.ID {
	case "mining_efficiency":
		// Increase mining power after completing mining efficiency research
		player.MiningPower *= 1.2 // Increase by 20% as an example
	case "drone_optimization":
		// Add new drones after completing drone optimization research
		player.Drones = append(player.Drones, models.Drone{ID: "drone_01", Efficiency: 1.1})
		// You can add more research effects here as needed
	default:
		log.Printf("Unknown research: %s", research.ID)
	}
}
