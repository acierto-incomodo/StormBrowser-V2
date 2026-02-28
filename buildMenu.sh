#!/bin/bash

if [ ! -d "scriptsRun" ]; then
    echo "Directory 'scriptsRun' not found."
    exit 1
fi

scripts=(scriptsRun/*.sh)
if [ ${#scripts[@]} -eq 0 ]; then
    echo "No .sh scripts found in scriptsRun."
    exit 1
fi

while true; do
    clear
    echo "=== StormBrowser Linux Build Menu ==="
    for i in "${!scripts[@]}"; do
        filename=$(basename "${scripts[$i]}")
        echo "$((i+1)). $filename"
    done
    echo "q. Quit"

    read -p "Enter selection: " selection
    if [[ "$selection" == "q" || "$selection" == "Q" ]]; then break; fi

    if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#scripts[@]}" ]; then
        script_to_run="${scripts[$((selection-1))]}"

        read -p "Release type? (L)atest or (P)rerelease [L]: " releaseType
        if [[ "$releaseType" == "p" || "$releaseType" == "P" ]]; then
            echo "Setting release type to Prerelease"
            export RELEASE_TYPE="prerelease"
        else
            echo "Setting release type to Latest"
            unset RELEASE_TYPE
        fi

        echo "Running $script_to_run..."
        bash "$script_to_run"
        echo "Done. Press Enter to continue..."
        read
        unset RELEASE_TYPE
    fi
done