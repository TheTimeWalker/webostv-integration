#!/usr/bin/env bash

worker=0

# SIGTERM-handler
term_handler() {
  if [ $worker -ne 0 ]; then
    kill -SIGTERM "$worker"
    wait "$worker"
  fi
  exit 143; # 128 + 15 -- SIGTERM
}

trap term_handler SIGTERM

# the redirection trick makes sure that $! is the pid
# of the "node build/index.js" process
node dist/index.js &
worker="$!"

wait $worker
