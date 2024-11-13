package services

import (
	"errors"

	"github.com/KemalBekir/idle-game/internal/game/models"
	"github.com/KemalBekir/idle-game/internal/game/repository"
)

type MarketService struct {
	repo repository.GameRepository
}

func NewMarketService(repo repository.GameRepository) *MarketService {
	return &MarketService{
		repo: repo,
	}
}

func (s *MarketService) PlaceOrder(playerID string, order *models.MarketOrder) error {
	player, err := s.repo.GetPlayer(playerID)
	if err != nil {
		return err
	}

	if order.OrderType == "SELL" {
		// Check if player has enough minerals
		mineralAmount := player.GetMineralAmount(order.ItemID)
		if mineralAmount < order.Amount {
			return errors.New("insufficient minerals")
		}
	} else {
		// Check if player has enough currency
		totalCost := order.Amount * order.Price
		if player.Minerals < totalCost {
			return errors.New("insufficient funds")
		}
	}

	// Save order and update player state
	if err := s.repo.SaveMarketOrder(order); err != nil {
		return err
	}

	return s.matchOrders(order)
}

func (s *MarketService) matchOrders(order *models.MarketOrder) error {
	// Example logic for matching orders (can be customized)
	// This is a simplified placeholder, you can add your actual order matching logic here
	if order.OrderType == "SELL" {
		// Try to match sell orders with buy orders
	} else {
		// Try to match buy orders with sell orders
	}

	// For now, just return nil (no actual matching logic implemented)
	return nil
}
