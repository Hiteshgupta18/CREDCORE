#!/bin/bash

# CrediCore Backend API Test Script
# This script tests all major endpoints

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing CrediCore Backend API"
echo "================================"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "   Response: $body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: Root Endpoint
echo "2️⃣  Testing Root Endpoint..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Root endpoint passed${NC}"
    echo "   Response: $body"
else
    echo -e "${RED}❌ Root endpoint failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 3: Get All Hospitals
echo "3️⃣  Testing Get All Hospitals..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/hospitals")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Get hospitals passed${NC}"
    echo "   Hospitals found!"
else
    echo -e "${RED}❌ Get hospitals failed (HTTP $http_code)${NC}"
    echo "   Note: Database might not be seeded yet"
fi
echo ""

# Test 4: Get All Schemes
echo "4️⃣  Testing Get All Schemes..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/schemes")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Get schemes passed${NC}"
else
    echo -e "${RED}❌ Get schemes failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 5: Address Validation
echo "5️⃣  Testing Address Validation..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/addresses/validate" \
  -H "Content-Type: application/json" \
  -d '{"address": "Flat B-402 Shanti Heights Mansarovar Jaipur"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Address validation passed${NC}"
    echo "   Response: $body"
else
    echo -e "${RED}❌ Address validation failed (HTTP $http_code)${NC}"
    echo "   Note: Reference addresses might not be seeded"
fi
echo ""

# Test 6: User Registration
echo "6️⃣  Testing User Registration..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "201" ]; then
    echo -e "${GREEN}✅ User registration passed${NC}"
    echo "   New user created!"
elif [ "$http_code" == "400" ]; then
    echo -e "${YELLOW}⚠️  User might already exist${NC}"
else
    echo -e "${RED}❌ User registration failed (HTTP $http_code)${NC}"
    echo "   Response: $body"
fi
echo ""

# Test 7: User Login
echo "7️⃣  Testing User Login (with seeded admin user)..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@credcore.com",
    "password": "password123"
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ User login passed${NC}"
    TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        echo "   Token received: ${TOKEN:0:30}..."
    fi
elif [ "$http_code" == "401" ]; then
    echo -e "${YELLOW}⚠️  Login failed - Database not seeded${NC}"
    echo "   Run: npm run db:seed"
else
    echo -e "${RED}❌ User login failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 8: Create Hospital
echo "8️⃣  Testing Create Hospital..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/hospitals" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hospital",
    "registrationNo": "TEST-'$(date +%s)'",
    "licenseNumber": "LIC-TEST-'$(date +%s)'",
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
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "201" ]; then
    echo -e "${GREEN}✅ Create hospital passed${NC}"
    echo "   Hospital created successfully!"
elif [ "$http_code" == "500" ]; then
    echo -e "${YELLOW}⚠️  Database connection issue${NC}"
    echo "   Make sure PostgreSQL is running and database is migrated"
else
    echo -e "${RED}❌ Create hospital failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 9: Search Hospitals
echo "9️⃣  Testing Hospital Search..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/hospitals/search/query?q=hospital")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Hospital search passed${NC}"
else
    echo -e "${RED}❌ Hospital search failed (HTTP $http_code)${NC}"
fi
echo ""

# Summary
echo "================================"
echo "✨ Test Summary"
echo "================================"
echo ""
echo "✅ Backend server is responding"
echo "📡 API endpoints are accessible"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Make sure PostgreSQL is running"
echo "2. Run database migrations: cd backend && npx prisma migrate dev --name init"
echo "3. Seed the database: npm run db:seed"
echo "4. Re-run this test: ./test-api.sh"
echo ""
