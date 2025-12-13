#!/bin/bash

# Script to reset PostgreSQL password
# Usage: ./reset-postgres-password.sh [new_password]

NEW_PASSWORD="${1:-postgres1}"

echo "=== Resetting PostgreSQL Password ==="
echo ""

# Method 1: Using sudo to connect as postgres user (no password needed)
echo "1. Resetting password for 'postgres' user..."
echo "   New password will be: $NEW_PASSWORD"
echo ""

# Try to reset password using sudo
if sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';" 2>/dev/null; then
    echo "   ✓ Password reset successfully!"
    echo ""
    echo "2. Testing new password..."
    if PGPASSWORD="$NEW_PASSWORD" psql -h localhost -U postgres -d postgres -c "SELECT 'Password works!' as status;" 2>/dev/null; then
        echo "   ✓ Password test successful!"
    else
        echo "   ⚠ Password set but test failed. Try connecting manually."
    fi
else
    echo "   ✗ Failed to reset password using sudo method"
    echo ""
    echo "   Try this manually:"
    echo "   sudo -u postgres psql"
    echo "   Then run: ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';"
    echo "   Then exit: \\q"
fi

echo ""
echo "3. Make sure your .env file has the correct password:"
echo "   DB_PASSWORD=$NEW_PASSWORD"
echo ""

