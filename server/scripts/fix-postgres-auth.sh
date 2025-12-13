#!/bin/bash

# Script to fix PostgreSQL peer authentication issue
# This script modifies pg_hba.conf to allow password authentication

echo "=== Fixing PostgreSQL Authentication ==="
echo ""

# Find PostgreSQL version and data directory
PG_VERSION=$(psql --version | grep -oP '\d+' | head -1)
PG_DATA_DIR="/var/lib/postgresql/data"
PG_HBA_CONF="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

# Alternative locations
if [ ! -f "$PG_HBA_CONF" ]; then
    PG_HBA_CONF="/var/lib/postgresql/${PG_VERSION}/main/pg_hba.conf"
fi

if [ ! -f "$PG_HBA_CONF" ]; then
    echo "Could not find pg_hba.conf automatically."
    echo "Please find it manually and run:"
    echo "  sudo find /etc -name pg_hba.conf 2>/dev/null"
    echo "  OR"
    echo "  sudo find /var/lib -name pg_hba.conf 2>/dev/null"
    exit 1
fi

echo "Found pg_hba.conf at: $PG_HBA_CONF"
echo ""

# Backup the original file
echo "1. Creating backup of pg_hba.conf..."
sudo cp "$PG_HBA_CONF" "${PG_HBA_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
echo "   ✓ Backup created"

echo ""
echo "2. Current authentication settings:"
sudo grep -E "^[^#]" "$PG_HBA_CONF" | head -5

echo ""
echo "3. To fix peer authentication, you need to change 'peer' to 'md5' or 'scram-sha-256'"
echo "   for local connections. Here's what you need to do:"
echo ""
echo "   Run this command to edit the file:"
echo "   sudo nano $PG_HBA_CONF"
echo ""
echo "   Find lines that look like:"
echo "   local   all             all                                     peer"
echo "   host    all             all             127.0.0.1/32            peer"
echo ""
echo "   Change 'peer' to 'md5' or 'scram-sha-256':"
echo "   local   all             all                                     md5"
echo "   host    all             all             127.0.0.1/32            md5"
echo ""
echo "   Save and exit (Ctrl+X, then Y, then Enter)"
echo ""
echo "4. After editing, restart PostgreSQL:"
echo "   sudo systemctl restart postgresql"
echo ""
echo "5. Then test the connection again:"
echo "   ./check-db.sh"

