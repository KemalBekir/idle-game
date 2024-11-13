package models

import "time"

type MarketItem struct {
	ID        string      `json:"id"`
	Type      MineralType `json:"type"`
	Amount    float64     `json:"amount"`
	Price     float64     `json:"price"`
	Timestamp time.Time   `json:"timestamp"`
}

type MarketOrder struct {
	ID        string  `json:"id"`
	PlayerID  string  `json:"playerId"`
	ItemID    string  `json:"itemId"`
	Amount    float64 `json:"amount"`
	Price     float64 `json:"price"`
	OrderType string  `json:"orderType"` // "BUY" or "SELL"
	Status    string  `json:"status"`
}
