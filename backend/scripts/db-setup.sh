#!/bin/sh

export PGUSER="postgres"

psql -c "CREATE DATABASE hirerada"

psql hireradar -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"