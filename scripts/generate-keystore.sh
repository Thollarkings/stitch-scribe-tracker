#!/bin/bash

# Script to generate Android release keystore for Tailors Suite
# Run this script once to create your signing key
# Keep the keystore file and passwords SAFE - you'll need them for all future updates!

echo "=========================================="
echo "Tailors Suite - Keystore Generator"
echo "=========================================="
echo ""
echo "This script will generate a release keystore for signing your Android app."
echo "You will be asked several questions. Here are some suggestions:"
echo ""
echo "  Keystore password: Choose a strong password (min 6 characters)"
echo "  Key password: Can be same as keystore password"
echo "  First and Last name: Your name or company name"
echo "  Organizational unit: Development or your department"
echo "  Organization: Your company name or 'Thollarkings'"
echo "  City/Locality: Your city"
echo "  State/Province: Your state"
echo "  Country code: Two letter country code (e.g., US, UK, NG)"
echo ""
echo "=========================================="
echo ""

# Set default keystore location
DEFAULT_KEYSTORE_DIR="$HOME/.android/keystores"
KEYSTORE_NAME="tailors-suite-release.keystore"
KEYSTORE_PATH="$DEFAULT_KEYSTORE_DIR/$KEYSTORE_NAME"

# Create directory if it doesn't exist
mkdir -p "$DEFAULT_KEYSTORE_DIR"

# Check if keystore already exists
if [ -f "$KEYSTORE_PATH" ]; then
    echo "⚠️  WARNING: Keystore already exists at:"
    echo "   $KEYSTORE_PATH"
    echo ""
    read -p "Do you want to create a new one? This will NOT overwrite the existing one. (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Using existing keystore."
        echo ""
        echo "Your keystore is at: $KEYSTORE_PATH"
        echo "Make sure android/keystore.properties points to this file."
        exit 0
    fi
    # Add timestamp to new keystore name
    KEYSTORE_NAME="tailors-suite-release-$(date +%Y%m%d-%H%M%S).keystore"
    KEYSTORE_PATH="$DEFAULT_KEYSTORE_DIR/$KEYSTORE_NAME"
    echo "Creating new keystore: $KEYSTORE_NAME"
    echo ""
fi

# Generate keystore
echo "Generating keystore..."
echo ""
keytool -genkey -v -keystore "$KEYSTORE_PATH" \
  -alias tailors-suite \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Keystore generated successfully!"
    echo "=========================================="
    echo ""
    echo "Keystore location: $KEYSTORE_PATH"
    echo ""
    echo "IMPORTANT - Next Steps:"
    echo ""
    echo "1. BACKUP this keystore file to a secure location"
    echo "   Losing this file means you cannot update your app on Play Store!"
    echo ""
    echo "2. Create android/keystore.properties file with:"
    echo "   ---"
    echo "   storeFile=$KEYSTORE_PATH"
    echo "   storePassword=YOUR_KEYSTORE_PASSWORD"
    echo "   keyAlias=tailors-suite"
    echo "   keyPassword=YOUR_KEY_PASSWORD"
    echo "   ---"
    echo ""
    echo "3. NEVER commit keystore.properties or the .keystore file to git"
    echo "   (Already configured in .gitignore)"
    echo ""
    echo "4. Store your passwords in a secure password manager"
    echo ""
    echo "=========================================="
else
    echo ""
    echo "❌ Keystore generation failed!"
    echo "Please check the error messages above and try again."
    exit 1
fi
