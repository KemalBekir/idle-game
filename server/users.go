package main

import (
	"github.com/google/uuid"
)

// Function to generate a new Unique ID

func GenerateID() string {
	id := uuid.New().String()
	return id
}
