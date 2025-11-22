#!/bin/bash

# Quick script to view all user login/signup data

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👥 VIEWING ALL USER ACCOUNTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backend is running
if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "❌ Backend server is not running!"
    echo "Please start it with: cd backend && node server.js"
    exit 1
fi

# Fetch and display users
echo "📊 Fetching user data..."
echo ""

curl -s http://localhost:5000/api/auth/users | jq -r '
"Total Users: \(.pagination.total)",
"",
(.data[] | 
"──────────────────────────────────────────────────",
"👤 \(.firstName) \(.lastName)",
"📧 Email:       \(.email)",
"🔑 Role:        \(.role)",
"✅ Validations: \(._count.validations)",
"📅 Registered:  \(.createdAt)",
""
)'

# Show statistics
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 STATISTICS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -s http://localhost:5000/api/auth/users/stats | jq -r '
"Total:     \(.data.total)",
"Admins:    \(.data.byRole.admin)",
"Users:     \(.data.byRole.user)",
"Verifiers: \(.data.byRole.verifier)",
"Recent:    \(.data.recentSignups) (last 24h)"
'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 View Options:"
echo "  • API:            curl http://localhost:5000/api/auth/users"
echo "  • Prisma Studio:  npx prisma studio (in backend folder)"
echo "  • Frontend:       http://localhost:3000/data-viewer"
echo ""
