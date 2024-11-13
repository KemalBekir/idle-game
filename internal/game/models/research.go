package models

type ResearchArea string

const (
	MiningTechnology  ResearchArea = "MINING_TECH"
	DroneEfficiency   ResearchArea = "DRONE_EFFICIENCY"
	MineralProcessing ResearchArea = "MINERAL_PROCESSING"
)

type Research struct {
	ID             string       `json:"id"`
	Area           ResearchArea `json:"area"`
	Level          int          `json:"level"`
	Cost           float64      `json:"cost"`
	TimeToComplete int          `json:"timeToComplete"` // in seconds
	Bonus          float64      `json:"bonus"`
	IsCompleted    bool         `json:"isCompleted"`
}
