#!/bin/bash

OS_PATH="$(dirname "$(realpath "$0")")"
cd "$OS_PATH"

# Create or overwrite the Caddyfile
cat <<EOF > Caddyfile
root * $OS_PATH
file_server
EOF
