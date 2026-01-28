#!/usr/bin/env bash

docker compose -f ../coreApplication.yml -f ../openSources.yml rm -fsv portal-ui

docker compose -f ../maintenance.yml up -d
