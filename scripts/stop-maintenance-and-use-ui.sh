#!/usr/bin/env bash

docker compose -f ../maintenance.yml rm -fsv maintenance

docker compose -f ../coreApplication.yml -f ../openSources.yml up -d portal-ui
