# Tailors Suite - Android Release Guide

**App Version:** 1.0.0  
**Version Code:** 1  
**Last Updated:** January 2025

---

## 📋 Pre-Release Checklist

### ✅ Version Management
- [x] Package.json version updated to `1.0.0`
- [x] Android `versionName` set to `"1.0"` in `android/app/build.gradle`
- [x] Android `versionCode` set to `1` in `android/app/build.gradle`
- [x] Target SDK set to API 35 (Android 15)

**Version Naming Convention:**
- `versionCode`: Integer that increments with each release (1, 2, 3, ...)
- `versionName`: User-facing version string (1.0, 1.1, 2.0, ...)

**For Future Updates:**
- Minor updates: Increment `versionCode` by 1, update `versionName` (e.g., 1.0 → 1.1)
- Major updates: Increment both, jump major version (e.g., 1.x → 2.0)

---

## 🔐 App Signing Setup

### Step 1: Generate Keystore

Create a release keystore (do this ONCE and keep it safe):

```bash
keytool -genkey -v -keystore tailors-suite-release.keystore \
  -alias tailors-suite -keyalg RSA -keysize 2048 -validity 10000
```

**Important:**
- Store the keystore file in a secure location (NOT in the git repository)
- Remember your keystore password and key password
- Backup the keystore - losing it means you can't update the app on Play Store

**Recommended location:** `~/.android/keystores/tailors-suite-release.keystore`

### Step 2: Create Signing Configuration

Create a file `android/keystore.properties` (gitignored) with:

```properties
storeFile=/path/to/tailors-suite-release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=tailors-suite
keyPassword=YOUR_KEY_PASSWORD
```

### Step 3: Update build.gradle

The signing configuration has been added to `android/app/build.gradle`.
It will automatically load from `keystore.properties` when building release.

---

## 🏗️ Building Release Bundle

### Prerequisites
- JDK 17 installed
- Android Studio with SDK 35
- Keystore created and configured

### Build Commands

#### Option 1: Using Android Studio (Recommended for first release)
1. Open Android Studio: `npm run open:android`
2. Menu: **Build → Generate Signed App Bundle / APK**
3. Select **Android App Bundle**
4. Choose your keystore and enter passwords
5. Select **release** build variant
6. Build will be created in `android/app/release/`

#### Option 2: Using Command Line
```bash
# First, ensure web assets are built
npm run build:android

# Sync to Android
npm run cap:sync

# Build release bundle
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

**For APK (testing only, not for Play Store):**
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 Play Store Assets

### Required Assets

#### 1. App Icon (High-Res)
- **Size:** 512x512 px
- **Format:** PNG (32-bit)
- **Location:** Already available at `public/icons/icon-512x512.png`
- **Requirements:** No transparency, no rounded corners

#### 2. Feature Graphic
- **Size:** 1024x500 px
- **Format:** PNG or JPEG
- **Status:** ⚠️ NEEDS TO BE CREATED
- **Content:** Showcase app name and key feature visually

#### 3. Screenshots
- **Minimum:** 2 screenshots
- **Recommended:** 4-8 screenshots
- **Formats:** 
  - Phone: 16:9 or 9:16 aspect ratio
  - Tablet: 16:9 or 9:16 aspect ratio (optional)
- **Recommended sizes:** 
  - 1080x1920 (portrait) or 1920x1080 (landscape)
- **Status:** ✅ Available in `src/screenshots/` (need to verify dimensions)

#### 4. App Description
**Short Description (80 chars max):**
```
Manage measurements, track clients, and generate invoices for tailoring.
```

**Full Description (4000 chars max):**
```
TailorSuite - Your Complete Tailoring Management Solution

TailorSuite is designed specifically for tailors and fashion designers who want to streamline their business operations. Whether you're running a small shop or managing multiple clients, TailorSuite helps you stay organized and professional.

KEY FEATURES:

📏 Smart Measurement Management
- Store detailed client measurements
- Quick access to measurement history
- Easy-to-use measurement forms
- Support for all garment types

👔 Job Tracking
- Track orders from start to finish
- Set due dates and priorities
- Monitor payment status
- View job history

💰 Payment & Invoice Management
- Generate professional invoices instantly
- Track payments and balances
- Calculate totals automatically
- Custom logo support

📱 Works Offline
- Access your data anytime, anywhere
- Automatic sync when online
- No internet required for core features

🔒 Secure & Private
- Your data is encrypted and secure
- Cloud backup included
- Multi-device sync

✨ Professional & Easy to Use
- Clean, intuitive interface
- Fast and responsive
- Regular updates and improvements

Perfect for:
- Individual tailors
- Fashion designers
- Alteration shops
- Clothing boutiques
- Textile businesses

Download TailorSuite today and transform the way you manage your tailoring business!
```

#### 5. Privacy Policy URL
**Status:** ⚠️ REQUIRED for Play Store
**Recommendation:** Host on your website or create a simple GitHub Pages site
**Content should cover:**
- What data you collect (measurements, client info, etc.)
- How you use the data
- How data is stored (Convex backend)
- User rights (data deletion, export)
- Contact information

---

## 🧪 Testing Checklist

Before submitting to Play Store, test thoroughly:

### Core Features
- [ ] User registration and login
- [ ] Create/edit/delete measurements
- [ ] Create/edit/delete jobs
- [ ] Payment tracking and calculations
- [ ] Invoice generation and PDF export
- [ ] Data sync across devices

### Offline Functionality
- [ ] App works without internet
- [ ] Data syncs when connection restored
- [ ] Offline page shows when appropriate

### UI/UX
- [ ] All screens render correctly
- [ ] No layout issues on different screen sizes
- [ ] Buttons and forms work as expected
- [ ] Navigation flows smoothly

### Performance
- [ ] App launches quickly
- [ ] No crashes or freezes
- [ ] Smooth scrolling and animations
- [ ] Reasonable battery usage

### Security
- [ ] Authentication works correctly
- [ ] User data is protected
- [ ] No sensitive data in logs

---

## 📤 Play Store Submission

### Step 1: Create Play Console Account
1. Go to https://play.google.com/console
2. Pay one-time registration fee ($25)
3. Complete account setup

### Step 2: Create App Listing
1. Click "Create app"
2. Fill in app details:
   - App name: **Tailors Suite**
   - Default language: English (US)
   - App or game: App
   - Free or paid: Free
3. Complete all required sections

### Step 3: Upload Assets
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (at least 2)
- Privacy policy URL
- App description (short and full)

### Step 4: Set Content Rating
Use the questionnaire to get your rating (likely Everyone)

### Step 5: Target Audience
- Select age groups (13+)
- Indicate if app is designed for children (No)

### Step 6: Upload App Bundle
1. Go to "Release → Production"
2. Click "Create new release"
3. Upload `app-release.aab`
4. Add release notes
5. Set rollout percentage (start with 20% for safety)

### Step 7: Pricing & Distribution
- Set countries/regions (or worldwide)
- Confirm free app
- Accept developer agreements

### Step 8: Review & Publish
- Complete all required sections
- Submit for review
- Wait for approval (typically 1-7 days)

---

## 🔄 Future Updates

### For Version 1.1 Update:

1. Update version in `package.json`:
   ```json
   "version": "1.1.0"
   ```

2. Update version in `android/app/build.gradle`:
   ```groovy
   versionCode 2
   versionName "1.1"
   ```

3. Make your code changes

4. Build and test:
   ```bash
   npm run build:android
   npm run cap:sync
   cd android
   ./gradlew bundleRelease
   ```

5. Upload to Play Console:
   - Create new release in Production track
   - Upload new AAB
   - Add release notes describing changes
   - Submit for review

---

## 📊 Post-Launch Monitoring

### Play Console Analytics
- Monitor crash reports
- Check user ratings and reviews
- Track installation metrics
- View performance data

### Firebase Integration (Optional)
For more detailed analytics:
1. Create Firebase project
2. Download `google-services.json`
3. Place in `android/app/`
4. Add Firebase Analytics SDK
5. Monitor events and user behavior

---

## 🔗 Important Links

- **Play Console:** https://play.google.com/console
- **Android Developer Guide:** https://developer.android.com/distribute
- **Capacitor Docs:** https://capacitorjs.com/docs/android
- **App Signing Best Practices:** https://developer.android.com/studio/publish/app-signing

---

## 📝 Quick Reference

### File Locations
- **Build config:** `android/app/build.gradle`
- **Keystore props:** `android/keystore.properties` (gitignored)
- **Release bundle:** `android/app/build/outputs/bundle/release/app-release.aab`
- **Icons:** `public/icons/`
- **Screenshots:** `src/screenshots/`

### Important Commands
```bash
# Build web assets
npm run build:android

# Sync to Android
npm run cap:sync

# Build release bundle
cd android && ./gradlew bundleRelease

# Build release APK (testing only)
cd android && ./gradlew assembleRelease
```

---

**Status:** Ready for signing configuration and release build.

**Next Steps:**
1. Generate keystore
2. Create keystore.properties
3. Create feature graphic
4. Prepare privacy policy
5. Build release bundle
6. Submit to Play Store

**Contact:** Thollarkings © 2025
