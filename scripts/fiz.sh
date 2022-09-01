#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
while true; do
  printf "${GREEN}\nEnter a command: \
    \n${GREEN}s ${NC}- ${BLUE}stop all \
    \n${GREEN}r ${NC}- ${BLUE}remove all \
    \n${GREEN}b ${NC}- ${BLUE}build \
    \n${GREEN}e ${NC}- ${BLUE}exit\n${RED}"

  read value
  case $value in
    [Ss]* ) . stop-all.sh ;;
    [Rr]* ) . remove-our-images.sh ;;
    [Bb]* ) . build-run.sh ;;
    [Ee]* ) exit;;
    * ) printError "unknown options";;
  esac
done
