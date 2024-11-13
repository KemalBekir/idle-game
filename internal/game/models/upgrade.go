package models

type UpgradeType string

const (
	MiningPowerUpgrade     UpgradeType = "MINING_POWER"
	DroneEfficiencyUpgrade UpgradeType = "DRONE_EFFICIENCY"
	StorageCapacity        UpgradeType = "STORAGE_CAPACITY"
)

type Upgrade struct {
	ID         string      `json:"id"`
	Type       UpgradeType `json:"type"`
	Level      int         `json:"level"`
	Cost       float64     `json:"cost"`
	Multiplier float64     `json:"multiplier"`
}
