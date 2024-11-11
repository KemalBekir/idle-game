package main

import (
	"image/color"
	"log"

	"github.com/hajimehoshi/ebiten/v2"
	"github.com/hajimehoshi/ebiten/v2/ebitenutil"
	"github.com/hajimehoshi/ebiten/v2/vector"
)

// Game struct with no additional fields for simplicity
type Game struct{}

// Update function - required for Ebiten
func (g *Game) Update() error {
	// No updates needed for this test
	return nil
}

// Draw function - draws a rectangle and some text
func (g *Game) Draw(screen *ebiten.Image) {
	screen.Fill(color.RGBA{50, 50, 100, 255}) // Background color
	rectColor := color.RGBA{255, 0, 0, 255}
	vector.DrawFilledRect(screen, 50.0, 50.0, 100.0, 100.0, rectColor, false)
	ebitenutil.DebugPrint(screen, "Ebiten WebAssembly is working!") // Test text
}

// Layout function - sets the screen dimensions
func (g *Game) Layout(outsideWidth, outsideHeight int) (int, int) {
	return 320, 240
}

func main() {
	// Create a new Game instance and run it
	game := &Game{}
	ebiten.SetWindowSize(640, 480)
	ebiten.SetWindowTitle("Ebiten Wasm Test")

	if err := ebiten.RunGame(game); err != nil {
		log.Fatal(err)
	}

}
