package services

import (
	"time"

	"github.com/KemalBekir/idle-game/internal/game/models"
	"github.com/KemalBekir/idle-game/internal/game/repository"
	"github.com/google/uuid"
)

type GameStateService struct {
	repo repository.GameRepository
}

func NewGameStateService(repo repository.GameRepository) *GameStateService {
	return &GameStateService{repo: repo}
}

func (s *GameStateService) GenerateNewAsteroid() *models.Asteroid {
	return &models.Asteroid{
		ID:        generateID(), // Implementation needed
		Type:      models.SmallAsteroid,
		BaseYield: 1.0,
		Health:    100.0,
		MaxHealth: 100.0,
	}
}

func (s *GameStateService) UpdateGameState() error {
	// Load the current game state from the repository
	state, err := s.repo.LoadGameState()
	if err != nil {
		return err
	}

	// Update asteroid states
	for _, asteroid := range state.Asteroids {
		// Example: Decrease asteroid health over time or based on mining progress
		if asteroid.Health > 0 {
			asteroid.Health -= 0.5 // Simulate mining damage or degradation (you can adjust this rate)
		}

		// Simulate asteroid mining (for example, after reducing health, you extract resources)
		if asteroid.Health <= 0 {
			// Assuming base yield is the amount of mineral you get from mining the asteroid
			// You could add a mining progress check, e.g., if it's already mined, do nothing
			asteroid.BaseYield += 10 // Add 10 as an example of resources gained from the asteroid
		}

		// Optionally, check if asteroid is fully mined (max health reached)
		if asteroid.Health <= 0 && asteroid.BaseYield > asteroid.MaxHealth {
			// You can decide what to do when the asteroid is completely mined
			asteroid.BaseYield = asteroid.MaxHealth // Cap base yield to max health, or implement another rule
		}
	}

	// Update the timestamp for the last update (for tracking when game state was last updated)
	state.LastUpdated = time.Now()

	// Save the updated game state back to the repository
	return s.repo.SaveGameState(state)
}

func (s *GameStateService) GetGameState() (*models.GameState, error) {
	// Fetch the current game state from the repository
	gameState, err := s.repo.LoadGameState()
	if err != nil {
		return nil, err
	}
	return gameState, nil
}

func generateID() string {
	return uuid.NewString()
}
