#!/bin/bash

# Script to create android/keystore.properties file
# This helps you set up the keystore configuration correctly

echo "=========================================="
echo "Create keystore.properties"
echo "=========================================="
echo ""

KEYSTORE_PROPS_PATH="android/keystore.properties"

# Check if file already exists
if [ -f "$KEYSTORE_PROPS_PATH" ]; then
    echo "⚠️  WARNING: keystore.properties already exists!"
    echo ""
    cat "$KEYSTORE_PROPS_PATH"
    echo ""
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Keeping existing file."
        exit 0
    fi
fi

# Get user input
echo "Please provide the following information:"
echo ""

# Default keystore path
DEFAULT_KEYSTORE_PATH="$HOME/.android/keystores/tailors-suite-release.keystore"

read -p "Keystore file path [$DEFAULT_KEYSTORE_PATH]: " KEYSTORE_PATH
KEYSTORE_PATH=${KEYSTORE_PATH:-$DEFAULT_KEYSTORE_PATH}

read -sp "Keystore password: " KEYSTORE_PASSWORD
echo ""

read -p "Key alias [tailors-suite]: " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-tailors-suite}

read -sp "Key password (press Enter if same as keystore password): " KEY_PASSWORD
echo ""
if [ -z "$KEY_PASSWORD" ]; then
    KEY_PASSWORD=$KEYSTORE_PASSWORD
fi

# Verify keystore exists
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo ""
    echo "⚠️  WARNING: Keystore file not found at: $KEYSTORE_PATH"
    echo "You may need to generate it first using: npm run generate-keystore"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Create the file
echo "Creating keystore.properties..."
cat > "$KEYSTORE_PROPS_PATH" << EOF
# Keystore configuration for release signing
# Generated: $(date)
# DO NOT COMMIT THIS FILE TO VERSION CONTROL!

storeFile=$KEYSTORE_PATH
storePassword=$KEYSTORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEY_PASSWORD
EOF

echo ""
echo "✅ Created $KEYSTORE_PROPS_PATH"
echo ""
echo "IMPORTANT:"
echo "- This file contains sensitive information"
echo "- It is already in .gitignore - DO NOT commit it!"
echo "- Keep a secure backup of this information"
echo ""
echo "You can now build a release bundle with:"
echo "  npm run build:release"
echo ""
