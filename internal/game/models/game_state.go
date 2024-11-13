package models

import "time"

type GameState struct {
	Players     map[string]*Player `json:"players"`
	Asteroids   []*Asteroid        `json:"asteroids"`
	LastUpdated time.Time          `json:"lastUpdated"`
}
