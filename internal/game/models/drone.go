package models

type DroneType string

const (
	BasicDrone    DroneType = "BASIC"
	AdvancedDrone DroneType = "ADVANCED"
	EliteDrone    DroneType = "ELITE"
)

type Drone struct {
	ID          string    `json:"id"`
	Efficiency  float64   `json:"efficiency"`
	Type        DroneType `json:"type"`
	MiningPower float64   `json:"miningPower"`
	Level       int       `json:"level"`
	Cost        float64   `json:"cost"`
}

func NewBasicDrone(id string) *Drone {
	return &Drone{
		ID:          id,
		Efficiency:  1.0,
		Type:        BasicDrone,
		MiningPower: 1.0,
		Level:       1,
		Cost:        10.0,
	}
}
