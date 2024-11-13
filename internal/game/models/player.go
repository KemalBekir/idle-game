package models

type Player struct {
	ID          string             `json:"id"`
	Minerals    float64            `json:"minerals"`
	Items       map[string]float64 // Key: ItemID, Value: Amount of that item (mineral type, etc.)
	MiningPower float64            `json:"miningPower"`
	Drones      []Drone            `json:"drones"`
	Upgrades    []Upgrade          `json:"upgrades"`
}

func NewPlayer(id string) *Player {
	return &Player{
		ID:          id,
		MiningPower: 1.0,
		Drones:      make([]Drone, 0),
		Upgrades:    make([]Upgrade, 0),
	}
}

func (p *Player) GetMineralAmount(itemID string) float64 {
	if amount, exists := p.Items[itemID]; exists {
		return amount
	}
	return 0 // If itemID not found, return 0
}
