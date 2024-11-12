package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

type GameData struct {
	Minerals int
	Oil      int
	User     string
}

// startServer handles compilation and serving files
func startServer() {
	// Paths to main.go and main.wasm
	mainGoPath := "../main.go"
	mainWasmPath := "../main.wasm"

	// Check modification times of main.go and main.wasm
	goFileInfo, err := os.Stat(mainGoPath)
	if err != nil {
		log.Fatalf("failed to get main.go info: %v", err)
	}

	wasmFileInfo, err := os.Stat(mainWasmPath)
	// Rebuild if main.wasm doesn't exist or is older than main.go
	if err != nil || goFileInfo.ModTime().After(wasmFileInfo.ModTime()) {
		log.Println("Rebuilding main.wasm...")
		cmd := exec.Command("go", "build", "-o", mainWasmPath, mainGoPath)
		if err := cmd.Run(); err != nil {
			log.Fatalf("failed to compile main.go: %v", err)
		}
	}

	// Handle the root URL by serving index.html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "../index.html")
			return
		}

		// Set correct MIME type for .wasm files
		if filepath.Ext(r.URL.Path) == ".wasm" {
			w.Header().Set("Content-Type", "application/wasm")
		}

		// Serve other files from the root directory
		http.ServeFile(w, r, "../"+r.URL.Path[1:])
	})

	// Add API routes here as needed

	// Start the server on port 8080
	log.Println("Serving on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func main() {
	startServer()
}
