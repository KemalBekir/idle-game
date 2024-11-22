package models

import (
	"math/rand"
	"time"

	"github.com/google/uuid"
)

type SpaceJunk struct {
	ID       string        `json:"id"`
	X        float64       `json:"x"`
	Y        float64       `json:"y"`
	Reward   int           `json:"reward"`
	Lifespan time.Duration `json:"lifespan"`
}

// Generate random space junk
func GenerateSpaceJunk() SpaceJunk {
	return SpaceJunk{
		ID:       generateUUID(),                              // Use a unique ID generator
		X:        rand.Float64() * 100,                        // Example: X-coordinate
		Y:        rand.Float64() * 100,                        // Example: Y-coordinate
		Reward:   rand.Intn(9000) + 1000,                      // Reward between 1000 and 10000
		Lifespan: time.Second * time.Duration(rand.Intn(5)+5), // Lifespan between 5 and 10 seconds
	}
}

func generateUUID() string {
	return uuid.NewString()
}
