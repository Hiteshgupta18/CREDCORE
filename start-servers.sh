#!/bin/bash

# CrediCore - Start Both Frontend and Backend
# This script starts both servers and checks their health

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║   🏥 CrediCore Application Startup           ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to check if port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to wait for server
wait_for_server() {
    local url=$1
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    return 1
}

echo "📋 Pre-flight Checks..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm $(npm --version)"

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} Frontend .env file not found"
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠${NC} Backend .env file not found"
fi

echo ""
echo "🔧 Checking ports..."

# Check if ports are already in use
if check_port 5000; then
    echo -e "${YELLOW}⚠${NC} Port 5000 already in use (Backend might be running)"
    BACKEND_RUNNING=true
else
    BACKEND_RUNNING=false
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠${NC} Port 3000 already in use (Frontend might be running)"
    FRONTEND_RUNNING=true
else
    FRONTEND_RUNNING=false
fi

echo ""

# Start Backend
if [ "$BACKEND_RUNNING" = false ]; then
    echo "🚀 Starting Backend Server..."
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Start backend in background
    node server.js > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✓${NC} Backend starting (PID: $BACKEND_PID)"
    
    cd ..
    
    # Wait for backend to be ready
    echo "⏳ Waiting for backend to start..."
    if wait_for_server "http://localhost:5000/health"; then
        echo -e "${GREEN}✓${NC} Backend is ready on http://localhost:5000"
    else
        echo -e "${RED}❌ Backend failed to start${NC}"
        cat backend.log
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Backend already running on http://localhost:5000"
fi

echo ""

# Start Frontend
if [ "$FRONTEND_RUNNING" = false ]; then
    echo "🌐 Starting Frontend Server..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    BROWSER=none npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓${NC} Frontend starting (PID: $FRONTEND_PID)"
    
    cd ..
    
    # Wait for frontend to be ready
    echo "⏳ Waiting for frontend to start..."
    if wait_for_server "http://localhost:3000"; then
        echo -e "${GREEN}✓${NC} Frontend is ready on http://localhost:3000"
    else
        echo -e "${RED}❌ Frontend failed to start${NC}"
        cat frontend.log
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Frontend already running on http://localhost:3000"
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║   ✅ All Services Running!                    ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "🌐 Frontend:  http://localhost:3000"
echo "📡 Backend:   http://localhost:5000"
echo "❤️  Health:    http://localhost:5000/health"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   ./stop-servers.sh"
echo "   OR manually: lsof -ti:5000 | xargs kill && lsof -ti:3000 | xargs kill"
echo ""
