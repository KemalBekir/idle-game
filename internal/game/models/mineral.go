package models

type MineralType string

const (
	CommonMineral   MineralType = "COMMON"
	RareMineral     MineralType = "RARE"
	PreciousMineral MineralType = "PRECIOUS"
)

type Mineral struct {
	Type      MineralType `json:"type"`
	Amount    float64     `json:"amount"`
	BaseValue float64     `json:"baseValue"`
}
