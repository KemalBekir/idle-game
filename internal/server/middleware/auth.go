package middleware

import (
	"context"
	"net/http"

	"github.com/dgrijalva/jwt-go"
)

type Claims struct {
	PlayerID string `json:"playerId"`
	jwt.StandardClaims
}

func Auth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte("your-secret-key"), nil // Use proper secret management in production
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "playerID", claims.PlayerID)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
