#!/bin/bash

# Real-time user monitoring script
# This will show new user registrations as they happen

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👀 MONITORING USER REGISTRATIONS IN REAL-TIME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Watching for new signups... (Press Ctrl+C to stop)"
echo ""

# Get initial count
PREVIOUS_COUNT=$(curl -s http://localhost:5000/api/auth/users | jq '.pagination.total')

echo "📊 Current users: $PREVIOUS_COUNT"
echo ""
echo "Monitoring..."
echo ""

while true; do
    # Check current count
    CURRENT_COUNT=$(curl -s http://localhost:5000/api/auth/users | jq '.pagination.total')
    
    # If count increased, show new user
    if [ "$CURRENT_COUNT" -gt "$PREVIOUS_COUNT" ]; then
        echo ""
        echo "🎉 NEW USER REGISTERED! ($CURRENT_COUNT total)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Get the latest user
        curl -s http://localhost:5000/api/auth/users | jq -r '.data[0] | 
        "👤 Name:  \(.firstName) \(.lastName)",
        "📧 Email: \(.email)",
        "🔑 Role:  \(.role)",
        "📅 Time:  \(.createdAt)"
        '
        echo ""
        
        PREVIOUS_COUNT=$CURRENT_COUNT
    fi
    
    sleep 3
done
