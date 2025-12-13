#!/bin/bash

# Script to check pg_hba.conf configuration
# This helps identify which authentication method is being used

echo "=== Checking PostgreSQL Authentication Configuration ==="
echo ""

# Find pg_hba.conf
PG_HBA_CONF=""
for path in /etc/postgresql/*/main/pg_hba.conf /var/lib/postgresql/*/main/pg_hba.conf; do
    if [ -f "$path" ]; then
        PG_HBA_CONF="$path"
        break
    fi
done

if [ -z "$PG_HBA_CONF" ]; then
    echo "Could not find pg_hba.conf automatically."
    echo "Please find it manually:"
    echo "  sudo find /etc -name pg_hba.conf 2>/dev/null"
    echo "  sudo find /var/lib -name pg_hba.conf 2>/dev/null"
    exit 1
fi

echo "Found pg_hba.conf at: $PG_HBA_CONF"
echo ""

echo "Current authentication settings (non-commented lines):"
echo "---"
sudo grep -v "^#" "$PG_HBA_CONF" | grep -v "^$" | grep -v "^[[:space:]]*$"
echo "---"
echo ""

echo "Checking for 'peer' authentication (which causes issues):"
PEER_COUNT=$(sudo grep -v "^#" "$PG_HBA_CONF" | grep -v "^$" | grep -c "peer" || echo "0")
if [ "$PEER_COUNT" -gt 0 ]; then
    echo "  ⚠ Found $PEER_COUNT line(s) with 'peer' authentication:"
    sudo grep -v "^#" "$PG_HBA_CONF" | grep -v "^$" | grep "peer"
    echo ""
    echo "  These should be changed to 'md5' or 'scram-sha-256'"
else
    echo "  ✓ No 'peer' authentication found"
fi

echo ""
echo "Checking for 'scram-sha-256' (good, modern method):"
SCRAM_COUNT=$(sudo grep -v "^#" "$PG_HBA_CONF" | grep -v "^$" | grep -c "scram-sha-256" || echo "0")
if [ "$SCRAM_COUNT" -gt 0 ]; then
    echo "  ✓ Found $SCRAM_COUNT line(s) with 'scram-sha-256' (this is good!)"
    sudo grep -v "^#" "$PG_HBA_CONF" | grep -v "^$" | grep "scram-sha-256"
fi

echo ""
echo "Note: The ORDER of lines in pg_hba.conf matters!"
echo "PostgreSQL uses the FIRST matching line, so more specific rules should come first."
echo ""
echo "For TCP/IP connections (using -h localhost), look for lines starting with 'host'"
echo "For Unix socket connections, look for lines starting with 'local'"

