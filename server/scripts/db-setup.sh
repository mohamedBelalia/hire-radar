#!/bin/sh

export PGUSER="postgres"

psql -c "CREATE DATABASE hireradar"

psql hireradar -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"