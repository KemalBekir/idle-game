package config

type Config struct {
	Address      string
	StaticDir    string
	TemplatesDir string
	DatabaseURL  string
	Debug        bool
}

func Load() *Config {
	// In a real implementation, this would load from environment variables or config file
	return &Config{
		Address:      ":8080",
		StaticDir:    "web/static",
		TemplatesDir: "web/templates",
		Debug:        true,
	}
}
