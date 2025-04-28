#!/bin/bash
cd "/build" || { echo "Directory not found!"; exit 1; }


# Serve the build folder using 'serve' package
echo "Starting the local server..."
serve -s build

echo "Server is running at http://localhost:5000"
