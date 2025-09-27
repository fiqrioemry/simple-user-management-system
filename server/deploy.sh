#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1"; }

main() {
  info "Starting deployment..."

  # Check docker-compose
  if [ ! -f "docker-compose.yml" ]; then
    err "docker-compose.yml not found"
    exit 1
  fi

  # Stop and rebuild
  info "Stopping existing containers..."
  docker-compose -p usermanagement_app down -v

  info "Building and running containers..."
  docker-compose -p usermanagement_app up -d --build || {
    err "Failed to start containers"
    exit 1
  }

  # Init database
  info "Setting up database..."
  docker exec usermanagement_app node init-mysql.js || {
    err "Database creation failed"
    exit 1
  }

  info "Running migrations..."
  docker exec usermanagement_app npx sequelize-cli db:migrate || {
    err "Database migration failed"
    exit 1
  }

  
  info "Running seeders..."
  if ! docker exec usermanagement_app npx sequelize-cli db:seed:undo; then
    warn "Seeding failed (may be normal if seeds already exist)"
  fi


  info "Running seeders..."
  if ! docker exec usermanagement_app npx sequelize-cli db:seed:all; then
    warn "Seeding failed (may be normal if seeds already exist)"
  fi

  info "Deployment completed successfully!"
  info "Server is running on port 6000"
}

trap 'err "Deployment interrupted"; exit 1' INT TERM
main "$@"
