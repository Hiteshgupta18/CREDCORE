# #!/bin/bash

# # Stop all CrediCore servers

# echo "🛑 Stopping CrediCore Servers..."

# # Stop backend (port 5000)
# if lsof -ti:5000 > /dev/null 2>&1; then
#     echo "Stopping backend server..."
#     lsof -ti:5000 | xargs kill -9 2>/dev/null
#     echo "✓ Backend stopped"
# else
#     echo "Backend not running"
# fi

# # Stop frontend (port 3000)
# if lsof -ti:3000 > /dev/null 2>&1; then
#     echo "Stopping frontend server..."
#     lsof -ti:3000 | xargs kill -9 2>/dev/null
#     echo "✓ Frontend stopped"
# else
#     echo "Frontend not running"
# fi

# # Clean up any remaining node processes
# pkill -f "react-scripts" 2>/dev/null || true

# echo ""
# echo "✅ All servers stopped"
