package models

type AsteroidType string

const (
	SmallAsteroid  AsteroidType = "SMALL"
	MediumAsteroid AsteroidType = "MEDIUM"
	LargeAsteroid  AsteroidType = "LARGE"
)

type Asteroid struct {
	ID          string       `json:"id"`
	Type        AsteroidType `json:"type"`
	MineralType MineralType  `json:"mineralType"`
	BaseYield   float64      `json:"baseYield"`
	Health      float64      `json:"health"`
	MaxHealth   float64      `json:"maxHealth"`
}
