# Project structure

└── idle-game/
    ├── cmd/
    │   └── server/
    │       └── main.go
    ├── internal/
    │   ├── game/
    │   │   ├── models/
    │   │   │   ├── asteroid.go
    │   │   │   ├── drone.go
    │   │   │   ├── mineral.go
    │   │   │   └── player.go
    │   │   ├── services/
    │   │   │   ├── mining_service.go
    │   │   │   ├── upgrade_service.go
    │   │   │   └── game_state_service.go
    │   │   └── repository/
    │   │       ├── interfaces.go
    │   │       └── memory_repository.go
    │   ├── server/
    │   │   ├── handlers/
    │   │   │   ├── mining_handler.go
    │   │   │   └── upgrade_handler.go
    │   │   ├── middleware/
    │   │   │   └── auth.go
    │   │   └── router.go
    │   └── config/
    │       └── config.go
    ├── web/
    │   ├── static/
    │   │   ├── css/
    │   │   │   └── styles.css
    │   │   ├── js/
    │   │   │   └── game.js
    │   │   └── assets/
    │   │       └── sprites/
    │   └── templates/
    │       └── index.html
    ├── pkg/
    │   └── utils/
    │       └── math_helpers.go
    ├── go.mod
    └── README.md