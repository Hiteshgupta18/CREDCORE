# 🧪 CrediCore Backend Testing Guide

Complete guide to test your CrediCore backend API.

---

## 📋 Prerequisites

Before testing, ensure:
1. ✅ Backend server is running on `http://localhost:5000`
2. ✅ PostgreSQL is installed and running
3. ✅ Database is migrated and seeded

---

## 🚀 Quick Start Testing

### Method 1: Automated Test Script (Easiest)

```bash
cd backend
./test-api.sh
```

This script automatically tests all major endpoints and shows results.

---

### Method 2: Manual cURL Commands

#### 1. Test Health Check
```bash
curl http://localhost:5000/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-18T...",
  "environment": "development"
}
```

#### 2. Test Root Endpoint
```bash
curl http://localhost:5000/
```

#### 3. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### 4. Login (Get JWT Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@credcore.com",
    "password": "password123"
  }'
```
**Save the token from response!**

#### 5. Get All Hospitals
```bash
curl http://localhost:5000/api/hospitals
```

#### 6. Validate Address (Jaccard Algorithm)
```bash
curl -X POST http://localhost:5000/api/addresses/validate \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Flat B-402 Shanti Heights Mansarovar Jaipur"
  }'
```

#### 7. Create Hospital
```bash
curl -X POST http://localhost:5000/api/hospitals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hospital",
    "registrationNo": "TEST-001",
    "licenseNumber": "LIC-001",
    "email": "test@hospital.com",
    "phone": "+91-141-1234567",
    "hospitalType": "PRIVATE",
    "addresses": [{
      "addressLine1": "123 Test Street",
      "city": "Jaipur",
      "state": "Rajasthan",
      "pincode": "302001",
      "isPrimary": true
    }]
  }'
```

#### 8. Search Hospitals
```bash
curl "http://localhost:5000/api/hospitals/search/query?q=SMS"
```

#### 9. Get All Schemes
```bash
curl http://localhost:5000/api/schemes
```

#### 10. Bulk Validate Addresses
```bash
curl -X POST http://localhost:5000/api/addresses/validate/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "addresses": [
      "Flat B-402 Shanti Heights Mansarovar Jaipur",
      "SMS Hospital JLN Marg Jaipur",
      "Plot 108 Sunrise Residency Ajmer Road"
    ]
  }'
```

---

### Method 3: Using Postman/Insomnia/Thunder Client

1. **Import the collection** from `API_TESTS.js` file
2. **Set base URL**: `http://localhost:5000`
3. **Test each endpoint** with provided examples

---

### Method 4: Using Browser (GET requests only)

Open these URLs in your browser:

- Health Check: http://localhost:5000/health
- Root: http://localhost:5000/
- All Hospitals: http://localhost:5000/api/hospitals
- All Schemes: http://localhost:5000/api/schemes
- Search: http://localhost:5000/api/hospitals/search/query?q=hospital

---

## 🔧 Setup Database (If Not Done)

### Step 1: Create Database
```bash
# If PostgreSQL is installed
createdb credcore
```

### Step 2: Run Migrations
```bash
cd backend
npx prisma migrate dev --name init
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Seed Database
```bash
npm run db:seed
```

**This creates:**
- 2 Users (admin@credcore.com / user@credcore.com)
- 4 Government schemes
- 5 Hospitals (SMS, Fortis, Eternal, CK Birla, Narayana)
- 10 Reference addresses
- Sample validation records

**Default password:** `password123`

---

## 🎯 Testing Specific Features

### Test Jaccard Address Matching

```bash
# Test 1: High similarity (should match)
curl -X POST http://localhost:5000/api/addresses/validate \
  -H "Content-Type: application/json" \
  -d '{"address": "Shanti Heights Mansarovar Jaipur"}'

# Test 2: Medium similarity
curl -X POST http://localhost:5000/api/addresses/validate \
  -H "Content-Type: application/json" \
  -d '{"address": "Plot Sunrise Residency Ajmer Road"}'

# Test 3: Low similarity (should not match)
curl -X POST http://localhost:5000/api/addresses/validate \
  -H "Content-Type: application/json" \
  -d '{"address": "Random Street Delhi"}'
```

### Test Authentication Flow

```bash
# 1. Register
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "test123",
    "firstName": "New",
    "lastName": "User"
  }')

echo $REGISTER_RESPONSE

# 2. Login and get token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "test123"
  }')

echo $LOGIN_RESPONSE

# Extract token (on macOS/Linux)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Use token to get current user
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Pagination

```bash
# Get first page (10 results)
curl "http://localhost:5000/api/hospitals?page=1&limit=10"

# Get second page
curl "http://localhost:5000/api/hospitals?page=2&limit=10"

# Filter by status
curl "http://localhost:5000/api/hospitals?status=VERIFIED"

# Filter by type
curl "http://localhost:5000/api/hospitals?type=PRIVATE"
```

### Test Filtering

```bash
# Get verified hospitals only
curl "http://localhost:5000/api/hospitals?verified=true"

# Get active schemes only
curl "http://localhost:5000/api/schemes?isActive=true"

# Get pending validations
curl "http://localhost:5000/api/validations?status=PENDING"
```

---

## 🐛 Troubleshooting

### Backend Not Responding (HTTP 000 errors)

```bash
# Check if backend is running
lsof -ti:5000

# If not running, start it
cd backend
node server.js
```

### Database Connection Errors

```bash
# Check PostgreSQL status
pg_isready

# Check .env file
cat .env | grep DATABASE_URL

# Test connection
npx prisma db pull
```

### Prisma Client Errors

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database if needed
npm run db:reset
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
# PORT=5001
```

---

## 📊 Expected Test Results

After seeding database, you should have:

**Hospitals:** 5 hospitals
- SMS Hospital (VERIFIED)
- Fortis Hospital (VERIFIED)
- Eternal Hospital (VERIFIED)
- CK Birla Hospital (VERIFIED)
- Narayana Hospital (PENDING)

**Schemes:** 4 schemes
- Ayushman Bharat
- CGHS
- Bhamashah Swasthya Bima Yojana
- ESI Scheme

**Users:** 2 users
- admin@credcore.com (ADMIN role)
- user@credcore.com (USER role)

**Reference Addresses:** 10 addresses for Jaccard matching

---

## 🎨 Using Prisma Studio (Database GUI)

```bash
cd backend
npx prisma studio
```

Opens at: http://localhost:5555

You can:
- View all database tables
- Add/edit/delete records
- Browse relationships
- Test queries

---

## 📝 API Response Examples

### Successful Hospital Creation
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Test Hospital",
    "registrationNo": "TEST-001",
    "status": "PENDING",
    "addresses": [...]
  }
}
```

### Address Validation Response
```json
{
  "success": true,
  "data": {
    "inputAddress": "Flat B-402 Shanti Heights Mansarovar Jaipur",
    "matches": [
      {
        "referenceAddress": {...},
        "similarity": 0.75,
        "isMatch": true
      }
    ],
    "bestMatch": {...}
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Hospital not found"
}
```

---

## 🔍 Checking Server Logs

Backend logs show:
- Incoming requests (via Morgan)
- Database queries (Prisma)
- Errors and stack traces

Watch logs in real-time:
```bash
cd backend
npm run dev
# Now make API calls and watch the logs
```

---

## 📚 Additional Resources

- **API Documentation**: See `API_TESTS.js` for all endpoints
- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com
- **Backend README**: `backend/README.md`

---

## ✅ Testing Checklist

- [ ] Backend server starts successfully
- [ ] Health endpoint responds
- [ ] Database connection works
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Hospital CRUD operations work
- [ ] Address validation (Jaccard) works
- [ ] Scheme management works
- [ ] Search and filtering work
- [ ] Pagination works
- [ ] Error handling works

---

**Need help?** Check the backend terminal for error messages or run `./test-api.sh` for automated testing.
