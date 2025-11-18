# CrediCore Frontend-Backend Integration Status

## ✅ Current Status (November 18, 2025)

### Servers Running
- ✅ **Frontend**: http://localhost:3000 (React)
- ✅ **Backend**: http://localhost:5000 (Express/Node.js)
- ✅ **Health Check**: http://localhost:5000/health

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CrediCore Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌───────────────────────┐ │
│  │  Frontend (React)    │◄───────►│  Backend (Express)    │ │
│  │  Port: 3000         │   HTTP   │  Port: 5000          │ │
│  │                      │   API    │                       │ │
│  │  - React 19         │          │  - Express.js         │ │
│  │  - React Router     │          │  - Prisma ORM         │ │
│  │  - Mapbox GL        │          │  - JWT Auth           │ │
│  │  - Tesseract OCR    │          │  - CORS enabled       │ │
│  │  - Axios            │          │  - PostgreSQL         │ │
│  └──────────────────────┘          └───────────────────────┘ │
│           │                                   │               │
│           │                                   │               │
│           ▼                                   ▼               │
│  ┌──────────────────────┐         ┌───────────────────────┐ │
│  │  Static Assets       │         │  Database             │ │
│  │  - Images            │         │  PostgreSQL           │ │
│  │  - CSS/Styles        │         │  Port: 5432          │ │
│  │  - Mapbox Tiles      │         │  Schema: credcore     │ │
│  └──────────────────────┘         └───────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. API Communication

**Base URL Configuration:**
```javascript
// Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api

// Backend (.env)
FRONTEND_URL=http://localhost:3000
```

**CORS Setup:**
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 2. API Endpoints Integrated

#### ✅ Working Endpoints:
- **Health Check**: `GET /health`
- **Hospitals**: `GET/POST/PUT/DELETE /api/hospitals`
- **Addresses**: `GET/POST /api/addresses`
- **Address Validation**: `POST /api/addresses/validate`
- **Schemes**: `GET/POST /api/schemes`
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`

#### 🔄 Frontend Pages Using Backend:
1. **Address Validation** (`/address-validation`)
   - Service: `AddressValidationService.compareAddress()`
   - Endpoint: `POST /api/addresses/compare`
   
2. **Hospital Validation** (`/validation`)
   - Service: `HospitalValidationService`
   - OCR + Database validation
   
3. **Directory** (`/directory`)
   - Displays hospital data from backend
   - Map integration with coordinates

4. **Schemes** (`/schemes`)
   - Fetches government schemes from backend

---

## Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoiZ2F1dGFtamkiLCJhIjoiY21oZTM2dnJ4MDg1NDJscXl1YXJvMnd1NSJ9._jTb5haeAFDzD0XXgH6dnQ
PORT=3001  # Fallback if 3000 is busy
```

### Backend (.env)
```env
DATABASE_URL=postgresql://hiteshgupta:password@localhost:5432/credcore?schema=public
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

---

## Database Setup

### Status: ⚠️ Needs Configuration

The backend requires PostgreSQL with the `credcore` database:

```bash
# 1. Start PostgreSQL
brew services start postgresql@14

# 2. Create database
createdb credcore

# 3. Run Prisma migrations
cd backend
npx prisma migrate dev

# 4. Seed database
npm run db:seed
```

### Prisma Schema
Located at: `backend/prisma/schema.prisma`

**Models:**
- User (Authentication)
- Hospital (Hospital records)
- Address (Location data)
- Scheme (Government schemes)
- HospitalScheme (Many-to-many)
- Validation (OCR results)
- ReferenceAddress (Master data)
- ActivityLog (Audit trail)

---

## API Services (Frontend)

### 1. Address Validation Service
```javascript
// src/services/api.js
AddressValidationService.compareAddress(inputAddress)
AddressValidationService.testConnection()
```

### 2. Hospital Validation Service
```javascript
// src/services/hospitalValidationService.js
HospitalValidationService.saveOCRResults(data)
HospitalValidationService.getAllProviders()
```

---

## Quick Start Commands

### Start Both Servers
```bash
# Using the script
./start-servers.sh

# Manual start
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
npm start
```

### Stop Both Servers
```bash
# Using the script
./stop-servers.sh

# Manual stop
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Check Status
```bash
# Check ports
lsof -ti:3000  # Frontend
lsof -ti:5000  # Backend

# Test backend health
curl http://localhost:5000/health

# Test API
curl http://localhost:5000/api/hospitals
```

---

## Features Status

| Feature | Frontend | Backend | Database | Status |
|---------|----------|---------|----------|--------|
| Home Page | ✅ | - | - | ✅ Working |
| Login/Signup | ✅ | ✅ | ⚠️ | 🔧 Needs DB |
| Hospital Validation | ✅ | ✅ | ⚠️ | 🔧 Needs DB |
| Address Validation | ✅ | ✅ | ⚠️ | 🔧 Needs DB |
| Directory | ✅ | ✅ | ⚠️ | ✅ Mock Data |
| Schemes | ✅ | ✅ | ⚠️ | 🔧 Needs DB |
| Mapbox Integration | ✅ | - | - | ✅ Working |
| OCR (Tesseract) | ✅ | - | - | ✅ Working |

---

## Testing Integration

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
# Expected: {"status":"OK","timestamp":"...","environment":"development"}
```

### 2. Test API Connection from Frontend
Visit: http://localhost:3000/address-validation
- Should show: "✅ Connected to backend server"

### 3. Test CORS
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:5000/api/hospitals
```

---

## Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
1. Check backend is running: `lsof -ti:5000`
2. Check health: `curl http://localhost:5000/health`
3. Check CORS settings in `backend/server.js`
4. Verify `REACT_APP_API_URL` in frontend `.env`

### Issue: "Database connection error"
**Solution:**
1. Start PostgreSQL: `brew services start postgresql@14`
2. Create database: `createdb credcore`
3. Run migrations: `cd backend && npx prisma migrate dev`
4. Check `DATABASE_URL` in `backend/.env`

### Issue: "Port already in use"
**Solution:**
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

---

## Development Workflow

### Making Changes

**Frontend changes:**
- Edit files in `src/`
- Hot reload automatically updates
- Check browser console for errors

**Backend changes:**
- Edit files in `backend/`
- Restart server: `./stop-servers.sh && ./start-servers.sh`
- Check terminal for errors

**Database changes:**
- Edit `backend/prisma/schema.prisma`
- Run: `npx prisma migrate dev --name your_change`
- Regenerate client: `npx prisma generate`

---

## Deployment Considerations

### Environment Variables (Production)
```env
# Frontend
REACT_APP_API_URL=https://api.credcore.com
REACT_APP_MAPBOX_TOKEN=<production-token>

# Backend
DATABASE_URL=<production-db-url>
NODE_ENV=production
JWT_SECRET=<strong-secret-key>
FRONTEND_URL=https://credcore.com
```

### Build Commands
```bash
# Frontend
npm run build
# Output: build/ directory

# Backend
# No build needed, runs with Node.js
node server.js
```

---

## Next Steps

1. ✅ Both servers running
2. ⚠️ Setup PostgreSQL database
3. ⚠️ Run database migrations
4. ⚠️ Seed initial data
5. ✅ Test all API endpoints
6. ✅ Verify CORS configuration
7. ⚠️ Test authentication flow
8. ✅ Test map integration
9. ⚠️ Test OCR + validation flow

---

## Support

For issues:
1. Check logs: `tail -f backend.log` or `tail -f frontend.log`
2. Check browser console (F12)
3. Review this integration guide
4. See `START_SERVERS.md` for detailed troubleshooting
