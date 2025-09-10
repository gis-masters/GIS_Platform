#!/usr/bin/env bash

# Imports
. utils/textUtil

# Function to execute a single command
execute_command() {
  local cmd=$1
  # Clear positional parameters to avoid passing them to sourced scripts
  set --
  case $cmd in
    s ) . stop-all.sh ;;
    r ) . remove-our-images.sh ;;
    rd) . remove-data.sh ;;
    b ) . build-run.sh ;;
    g ) . build-and-copy-generated-types.sh ;;
    t ) . run-acceptance-tests.sh ;;
    to) . run-acceptance-tests.sh -o ;;
    e ) exit;;
    * ) printError "unknown option: $cmd"; return 1;;
  esac
}

# Actions
while true; do
  printf "${GREEN}\nEnter a command (or multiple commands separated by spaces): \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}s  ${NC}- ${BLUE}stop   all \
    \n${GREEN}r  ${NC}- ${BLUE}remove all \
    \n${GREEN}rd ${NC}- ${BLUE}remove all created data \
    \n${GREEN}b  ${NC}- ${BLUE}build \
    \n${GREEN}g  ${NC}- ${BLUE}generate frontend types \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}t  ${NC}- ${BLUE}run All       acceptance tests(without smev) \
    \n${GREEN}to ${NC}- ${BLUE}run @OnlyThis acceptance tests \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}Examples: 'r rd b' or 's r b g' \
    \n${GREEN}-----------------------------------${NC} \
    \n${GREEN}e  ${NC}- ${BLUE}exit\n${RED}"

  read -r value
  
  # Split input by spaces and execute each command
  IFS=' ' read -ra commands <<< "$value"
  
  for cmd in "${commands[@]}"; do
    if [[ -n "$cmd" ]]; then
      printf "${YELLOW}Executing: $cmd${NC}\n"
      execute_command "$cmd"
      if [[ $? -ne 0 ]]; then
        break
      fi
    fi
  done
done
