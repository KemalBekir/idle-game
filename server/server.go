package main

import (
	"log"
	"net/http"
	"os/exec"
	"path/filepath"
)

// startServer handles compilation and serving files
func startServer() {
	// Compile main.go (located in the root folder) to WebAssembly
	cmd := exec.Command("go", "build", "-o", "../main.wasm", "../main.go")
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to compile main.go: %v", err)
	}

	// Handle the root URL by serving index.html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If the request is for the root URL, serve the index.html file
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "../index.html")
			return
		}

		// If the request is for a .wasm file, set the correct content-type
		if filepath.Ext(r.URL.Path) == ".wasm" {
			w.Header().Set("Content-Type", "application/wasm")
		}

		// Otherwise, serve the file from the root directory (e.g., .wasm, .js)
		fs := http.FileServer(http.Dir("../"))
		fs.ServeHTTP(w, r) // Correctly use ServeHTTP
	})

	// Start the server on port 8080
	log.Println("Serving on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func main() {
	startServer()
}
