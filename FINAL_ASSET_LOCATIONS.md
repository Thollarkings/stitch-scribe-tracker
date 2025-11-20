# Final Guide: Where to Replace Icons & Splash Screens

**Quick reference for manual editing**

---

## 📱 ALL FILE LOCATIONS

### App Icons (15 files)
```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)
android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png (48x48)
android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png (48x48)

android/app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)
android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png (72x72)
android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png (72x72)

android/app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)
android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png (96x96)
android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png (96x96)

android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png (144x144)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png (144x144)

android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png (192x192)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png (192x192)
```

### Splash Screens (11 files)
```
android/app/src/main/res/drawable/splash.png (720x1280)

android/app/src/main/res/drawable-port-mdpi/splash.png (320x480)
android/app/src/main/res/drawable-port-hdpi/splash.png (480x800)
android/app/src/main/res/drawable-port-xhdpi/splash.png (720x1280)
android/app/src/main/res/drawable-port-xxhdpi/splash.png (960x1600)
android/app/src/main/res/drawable-port-xxxhdpi/splash.png (1280x1920)

android/app/src/main/res/drawable-land-mdpi/splash.png (480x320)
android/app/src/main/res/drawable-land-hdpi/splash.png (800x480)
android/app/src/main/res/drawable-land-xhdpi/splash.png (1280x720)
android/app/src/main/res/drawable-land-xxhdpi/splash.png (1600x960)
android/app/src/main/res/drawable-land-xxxhdpi/splash.png (1920x1280)
```

---

## ⚡ QUICK REPLACEMENT

### If you have your images ready:

**Replace icons:** Just copy your icon to these 5 main files:
```bash
cp your-icon.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp your-icon.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp your-icon.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp your-icon.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
cp your-icon.png android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
```

**Replace splash:** Just copy your splash to these 3 main files:
```bash
cp your-splash.png android/app/src/main/res/drawable/splash.png
cp your-splash.png android/app/src/main/res/drawable-port-hdpi/splash.png
cp your-splash.png android/app/src/main/res/drawable-port-xhdpi/splash.png
```

---

## 🔄 AFTER REPLACING

### Rebuild:
```bash
unset VITE_CONVEX_URL
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
npm run cap:sync
cd android && ./gradlew clean assembleRelease
```

### Install and test:
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Clear old app first (important!):
```bash
adb uninstall com.tailorssuite.app
# Then install new one
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 💡 WHY SPLASH MIGHT STILL BE BLANK

1. **Old app cached** - Uninstall completely first
2. **Need to clear app data** - `adb shell pm clear com.tailorssuite.app`
3. **Wrong image format** - Use PNG, not JPEG
4. **Files corrupted** - Verify files open in image viewer

---

## ✅ WHAT'S BEEN DONE

1. ✅ Splash screen configuration added to `capacitor.config.ts`
2. ✅ Splash duration set to 2 seconds
3. ✅ White background configured
4. ✅ Full screen splash enabled
5. ✅ New APK built with configuration

---

## 📋 CURRENT STATUS

**New APK:** `android/app/build/outputs/apk/release/app-release.apk` (6.2 MB)
**New AAB:** `android/app/build/outputs/bundle/release/app-release.aab` (6.0 MB)

**Includes:**
- ✅ Splash screen configuration
- ✅ Your logo as icons (generated from public/logo.png)
- ✅ Your logo on splash (white background)
- ✅ All previous bug fixes
- ✅ Database sync fix

---

**Developer:** Thollarkings © 2025
**Ready for:** Testing and submission
