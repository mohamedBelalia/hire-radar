#!/bin/bash

# Script to check PostgreSQL connection
# Usage: ./check-db.sh

echo "=== PostgreSQL Connection Check ==="
echo ""

# Check if PostgreSQL is running
echo "1. Checking if PostgreSQL service is running..."
if systemctl is-active --quiet postgresql || systemctl is-active --quiet postgresql@*; then
    echo "   ✓ PostgreSQL service is running"
else
    echo "   ✗ PostgreSQL service is NOT running"
    echo ""
    echo "   To start PostgreSQL, run:"
    echo "   sudo systemctl start postgresql"
    echo "   OR"
    echo "   sudo service postgresql start"
    exit 1
fi

echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "2. ✗ psql command not found. Install PostgreSQL client:"
    echo "   sudo apt install postgresql-client"
    exit 1
else
    echo "2. ✓ psql command found"
fi

echo ""

# Try to connect (this will use default postgres user)
echo "3. Testing connection to PostgreSQL..."
echo "   (You may be prompted for password)"

# Try to connect as postgres user
# Use -h localhost to force TCP/IP connection (avoids peer authentication)
if PGPASSWORD="${DB_PASSWORD:-postgres1}" psql -h localhost -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-postgres}" -d "${DB_NAME:-hireradar}" -c "SELECT version();" &> /dev/null 2>&1; then
    echo "   ✓ Successfully connected to database!"
    echo ""
    echo "4. Database information:"
    PGPASSWORD="${DB_PASSWORD:-postgres1}" psql -h localhost -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-postgres}" -d "${DB_NAME:-hireradar}" -c "\conninfo"
    echo ""
    echo "5. Listing databases:"
    PGPASSWORD="${DB_PASSWORD:-postgres1}" psql -h localhost -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-postgres}" -c "\l" | grep -E "Name|${DB_NAME:-hireradar}"
else
    echo "   ✗ Failed to connect to database"
    echo ""
    echo "   Make sure:"
    echo "   - PostgreSQL is running"
    echo "   - Database '${DB_NAME:-hireradar}' exists"
    echo "   - User '${DB_USERNAME:-postgres}' has access"
    echo "   - Password is correct"
    echo "   - Connection settings in .env file are correct"
    exit 1
fi

echo ""
echo "=== All checks passed! ==="

