#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
while true; do
  printf "${GREEN}\nEnter a command: \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}s  ${NC}- ${BLUE}stop all \
    \n${GREEN}r  ${NC}- ${BLUE}remove all \
    \n${GREEN}b  ${NC}- ${BLUE}build \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}t  ${NC}- ${BLUE}run All acceptance tests \
    \n${GREEN}to ${NC}- ${BLUE}run @OnlyThis acceptance tests \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}e  ${NC}- ${BLUE}exit\n${RED}"

  read value
  case $value in
    [s]* ) . stop-all.sh ;;
    [r]* ) . remove-our-images.sh ;;
    [b]* ) . build-run.sh ;;
    t) . run-acceptance-tests.sh ;;
    to) . run-acceptance-tests.sh -o ;;
    [e]* ) exit;;
    * ) printError "unknown options";;
  esac
done
