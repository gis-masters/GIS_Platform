#!/bin/bash

count=0
while [ $count -lt 9 ]
do
count=$(docker ps -f health=healthy | wc -l)
echo "Now healthy: $count"
sleep 5
done
