package server

import (
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/KemalBekir/idle-game/internal/config"
	"github.com/KemalBekir/idle-game/internal/game/services"
)

type Server struct {
	config           *config.Config
	miningService    *services.MiningService
	upgradeService   *services.UpgradeService
	gameStateService *services.GameStateService
}

func NewServer(
	config *config.Config,
	miningService *services.MiningService,
	upgradeService *services.UpgradeService,
	gameStateService *services.GameStateService,
) *Server {
	return &Server{
		config:           config,
		miningService:    miningService,
		upgradeService:   upgradeService,
		gameStateService: gameStateService,
	}
}

func (s *Server) setupRoutes() http.Handler {
	mux := http.NewServeMux()

	// Serve the index.html template when the root is accessed
	mux.HandleFunc("/", s.renderIndexPage)

	// Serve static files like CSS, JS, etc.
	fileServer := http.FileServer(http.Dir("web/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	return mux
}

func (s *Server) renderIndexPage(w http.ResponseWriter, r *http.Request) {

	// Load the template
	tmpl, err := template.ParseFiles("web/templates/index.html")
	if err != nil {
		log.Fatalf("Error loading template: %v", err)
	}

	// Execute the template
	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Fatalf("Error executing template: %v", err)
	}
}

func (s *Server) Start() error {
	handler := s.setupRoutes()

	fullURL := "http://localhost" + s.config.Address

	fmt.Printf("Server starting at %s\n", fullURL)
	return http.ListenAndServe(s.config.Address, handler)
}
