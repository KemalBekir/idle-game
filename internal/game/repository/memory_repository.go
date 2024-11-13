package repository

import (
	"errors"
	"sync"

	"github.com/KemalBekir/idle-game/internal/game/models"
)

type MemoryRepository struct {
	players      map[string]*models.Player
	gameState    *models.GameState
	research     map[string]*models.Research
	marketOrders map[string]*models.MarketOrder
	mu           sync.RWMutex
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		players: make(map[string]*models.Player),
		gameState: &models.GameState{
			Players:   make(map[string]*models.Player),
			Asteroids: make([]*models.Asteroid, 0),
		},
		research:     make(map[string]*models.Research),
		marketOrders: make(map[string]*models.MarketOrder), // Initialize map
	}
}

// GetPlayer retrieves a player by ID.
func (r *MemoryRepository) GetPlayer(id string) (*models.Player, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	player, exists := r.players[id]
	if !exists {
		return nil, errors.New("player not found")
	}
	return player, nil
}

// SavePlayer saves a player to the repository.
func (r *MemoryRepository) SavePlayer(player *models.Player) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.players[player.ID] = player
	return nil
}

// GetUpgrades returns a predefined list of upgrades.
func (r *MemoryRepository) GetUpgrades() ([]models.Upgrade, error) {
	return []models.Upgrade{
		{
			ID:         "mining_power_1",
			Type:       models.MiningPowerUpgrade,
			Level:      1,
			Cost:       50.0,
			Multiplier: 1.5,
		},
		{
			ID:         "drone_efficiency_1",
			Type:       models.DroneEfficiencyUpgrade, // Use the new UpgradeType constant here
			Level:      1,
			Cost:       100.0,
			Multiplier: 1.3,
		},
	}, nil
}

// LoadGameState retrieves the current game state.
func (r *MemoryRepository) LoadGameState() (*models.GameState, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if r.gameState == nil {
		return nil, errors.New("no game state available")
	}
	return r.gameState, nil
}

// SaveGameState updates the game state.
func (r *MemoryRepository) SaveGameState(state *models.GameState) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.gameState = state
	return nil
}

func (r *MemoryRepository) SaveMarketOrder(order *models.MarketOrder) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if the order ID already exists
	if _, exists := r.marketOrders[order.ID]; exists {
		return errors.New("order ID already exists")
	}

	// Save the market order
	r.marketOrders[order.ID] = order
	return nil
}

func (r *MemoryRepository) GetResearch(researchID string) (*models.Research, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	research, exists := r.research[researchID]
	if !exists {
		return nil, errors.New("research not found")
	}
	return research, nil
}
