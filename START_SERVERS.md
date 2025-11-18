# How to Start CrediCore Application

## Starting Both Servers

To run the CrediCore application, you need to start both the **backend** and **frontend** servers.

### Option 1: Two Terminal Windows

#### Terminal 1 - Backend Server
```bash
cd /Users/hiteshgupta/Desktop/credcore/backend
node server.js
```

✅ Backend will run on: **http://localhost:5000**

#### Terminal 2 - Frontend (React)
```bash
cd /Users/hiteshgupta/Desktop/credcore
npm start
```

✅ Frontend will run on: **http://localhost:3000**

---

### Option 2: Single Command (Background)

From the root directory:

```bash
# Start backend in background
cd backend && node server.js &

# Return to root and start frontend
cd .. && npm start
```

---

## Verification

### Check Backend Status
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-11-18T...",
  "environment": "development"
}
```

### Check Frontend
Open browser: **http://localhost:3000**

---

## Troubleshooting

### Backend Won't Start

**Error:** `Port 5000 already in use`
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 node server.js
```

**Error:** `Cannot find module`
```bash
cd backend
npm install
```

**Error:** `Database connection failed`
```bash
# Make sure PostgreSQL is running
# Check DATABASE_URL in backend/.env
```

---

### Frontend Won't Start

**Error:** `Port 3000 already in use`
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or it will prompt to use different port
# Press 'y' to use port 3001
```

**Error:** `Module not found`
```bash
npm install
```

**Error:** `Cannot connect to backend`
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in .env file
- Visit http://localhost:3000/address-validation to see connection status

---

## Features That Require Backend

✅ **Address Validation** - `/address-validation`
✅ **Hospital Directory** - `/directory` (with live data)
✅ **Hospital Validation** - `/validation` (OCR + validation)
✅ **Schemes** - `/schemes` (with live data)

---

## Quick Start Script

Create a file `start.sh`:

```bash
#!/bin/bash

echo "🚀 Starting CrediCore Application..."

# Start backend
echo "📡 Starting backend server..."
cd backend && node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
cd ..
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

Make executable:
```bash
chmod +x start.sh
./start.sh
```

---

## Stop Servers

### Kill Backend
```bash
lsof -ti:5000 | xargs kill -9
```

### Kill Frontend
```bash
lsof -ti:3000 | xargs kill -9
# Or press Ctrl+C in terminal
```

### Kill All Node Processes
```bash
pkill -f node
```
