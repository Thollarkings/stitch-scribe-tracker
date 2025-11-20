# App Icon & Splash Screen Locations

**Quick reference for where to replace icon and splash files**

---

## 📱 APP ICONS (App Launcher Icons)

### Location: `android/app/src/main/res/mipmap-*/`

**Standard Launcher Icons** (ic_launcher.png):
```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png          (48x48)
android/app/src/main/res/mipmap-hdpi/ic_launcher.png          (72x72)
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png         (96x96)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png        (144x144)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png       (192x192)
```

**Round Launcher Icons** (ic_launcher_round.png):
```
android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png    (48x48)
android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png    (72x72)
android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png   (96x96)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png  (144x144)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png (192x192)
```

**Foreground Icons** (ic_launcher_foreground.png):
```
android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png    (48x48)
android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png    (72x72)
android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png   (96x96)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png  (144x144)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png (192x192)
```

**Total:** 15 icon files

---

## 🖼️ SPLASH SCREENS

### Location: `android/app/src/main/res/drawable*/`

**Portrait Splash Screens** (drawable-port-*):
```
android/app/src/main/res/drawable-port-mdpi/splash.png     (320x480)
android/app/src/main/res/drawable-port-hdpi/splash.png     (480x800)
android/app/src/main/res/drawable-port-xhdpi/splash.png    (720x1280)
android/app/src/main/res/drawable-port-xxhdpi/splash.png   (960x1600)
android/app/src/main/res/drawable-port-xxxhdpi/splash.png  (1280x1920)
```

**Landscape Splash Screens** (drawable-land-*):
```
android/app/src/main/res/drawable-land-mdpi/splash.png     (480x320)
android/app/src/main/res/drawable-land-hdpi/splash.png     (800x480)
android/app/src/main/res/drawable-land-xhdpi/splash.png    (1280x720)
android/app/src/main/res/drawable-land-xxhdpi/splash.png   (1600x960)
android/app/src/main/res/drawable-land-xxxhdpi/splash.png  (1920x1280)
```

**Default Splash** (drawable):
```
android/app/src/main/res/drawable/splash.png               (720x1280)
```

**Total:** 11 splash screen files

---

## 🎨 HOW TO REPLACE MANUALLY

### Quick Method: Replace Main Files

If you have:
- Your icon ready (e.g., `my-icon.png`)
- Your splash ready (e.g., `my-splash.png`)

**For Icons:**
Just replace these 5 main sizes (rest will scale):
```bash
# Standard icons
cp my-icon.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp my-icon.png android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
cp my-icon.png android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
cp my-icon.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp my-icon.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
```

**For Splash Screens:**
Just replace these 3 main files:
```bash
# Portrait
cp my-splash.png android/app/src/main/res/drawable-port-hdpi/splash.png
cp my-splash.png android/app/src/main/res/drawable-port-xhdpi/splash.png
cp my-splash.png android/app/src/main/res/drawable/splash.png
```

---

## 🛠️ PROPER METHOD: Using ImageMagick

### If you want all sizes correctly scaled:

**1. Place your source images:**
```bash
# Put your logo here (should be square, 1024x1024 recommended)
public/logo.png

# Or use any path, we'll reference it
/path/to/your-logo.png
```

**2. Generate all icon sizes:**
```bash
LOGO="/path/to/your-logo.png"

# All icon sizes
convert "$LOGO" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert "$LOGO" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert "$LOGO" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert "$LOGO" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert "$LOGO" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Repeat for _round and _foreground variants
```

**3. Generate all splash sizes:**
```bash
LOGO="/path/to/your-logo.png"

# Portrait splashes (white background, centered logo)
convert "$LOGO" -resize 200x200 -background white -gravity center -extent 320x480 android/app/src/main/res/drawable-port-mdpi/splash.png
convert "$LOGO" -resize 300x300 -background white -gravity center -extent 480x800 android/app/src/main/res/drawable-port-hdpi/splash.png
convert "$LOGO" -resize 400x400 -background white -gravity center -extent 720x1280 android/app/src/main/res/drawable-port-xhdpi/splash.png
convert "$LOGO" -resize 600x600 -background white -gravity center -extent 960x1600 android/app/src/main/res/drawable-port-xxhdpi/splash.png
convert "$LOGO" -resize 800x800 -background white -gravity center -extent 1280x1920 android/app/src/main/res/drawable-port-xxxhdpi/splash.png

# Landscape splashes
convert "$LOGO" -resize 200x200 -background white -gravity center -extent 480x320 android/app/src/main/res/drawable-land-mdpi/splash.png
convert "$LOGO" -resize 300x300 -background white -gravity center -extent 800x480 android/app/src/main/res/drawable-land-hdpi/splash.png
convert "$LOGO" -resize 400x400 -background white -gravity center -extent 1280x720 android/app/src/main/res/drawable-land-xhdpi/splash.png
convert "$LOGO" -resize 600x600 -background white -gravity center -extent 1600x960 android/app/src/main/res/drawable-land-xxhdpi/splash.png
convert "$LOGO" -resize 800x800 -background white -gravity center -extent 1920x1280 android/app/src/main/res/drawable-land-xxxhdpi/splash.png

# Default
convert "$LOGO" -resize 400x400 -background white -gravity center -extent 720x1280 android/app/src/main/res/drawable/splash.png
```

---

## 📋 FILE SIZE REQUIREMENTS

### App Icons
| Density | Standard | Round | Foreground |
|---------|----------|-------|------------|
| mdpi    | 48x48    | 48x48 | 48x48      |
| hdpi    | 72x72    | 72x72 | 72x72      |
| xhdpi   | 96x96    | 96x96 | 96x96      |
| xxhdpi  | 144x144  | 144x144 | 144x144  |
| xxxhdpi | 192x192  | 192x192 | 192x192  |

### Splash Screens
| Density | Portrait   | Landscape  |
|---------|------------|------------|
| mdpi    | 320x480    | 480x320    |
| hdpi    | 480x800    | 800x480    |
| xhdpi   | 720x1280   | 1280x720   |
| xxhdpi  | 960x1600   | 1600x960   |
| xxxhdpi | 1280x1920  | 1920x1280  |

---

## 🎨 DESIGN RECOMMENDATIONS

### For App Icons:
- **Format:** PNG with transparency (or solid background)
- **Size:** Start with 1024x1024 source
- **Content:** Should be recognizable at small sizes
- **Padding:** Leave 10-15% padding around edges
- **Style:** Flat, simple, clear

### For Splash Screens:
- **Background:** Solid color (white, brand color, etc.)
- **Logo:** Centered, scaled appropriately
- **Size:** Logo should be 30-50% of screen height
- **Format:** PNG (can be JPEG if no transparency needed)
- **Duration:** Shown briefly while app loads

---

## 🚀 AFTER REPLACING FILES

### Rebuild the app:
```bash
unset VITE_CONVEX_URL
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
npm run build:release
```

### Or just rebuild Android:
```bash
unset VITE_CONVEX_URL
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
npm run cap:sync
cd android && ./gradlew assembleRelease
```

---

## 💡 TROUBLESHOOTING

### Splash screen still blank?

**Check these files exist and are not empty:**
```bash
ls -lh android/app/src/main/res/drawable/splash.png
ls -lh android/app/src/main/res/drawable-port-hdpi/splash.png
```

**View the splash image:**
```bash
open android/app/src/main/res/drawable/splash.png
# or
xdg-open android/app/src/main/res/drawable/splash.png
```

**Rebuild after replacing:**
```bash
npm run cap:sync
cd android && ./gradlew clean assembleRelease
```

### Icons not showing?

**Clear app data:**
1. Uninstall old app completely
2. Install new APK
3. Icons should update

**Or force rebuild:**
```bash
cd android && ./gradlew clean && ./gradlew assembleRelease
```

---

## 📞 QUICK HELP

**I want to:**

**→ Just replace the splash screen**
Replace these 3 files with your image:
- `drawable/splash.png`
- `drawable-port-hdpi/splash.png`
- `drawable-port-xhdpi/splash.png`

**→ Just replace the app icon**
Replace these 5 files with your icon:
- `mipmap-hdpi/ic_launcher.png`
- `mipmap-xhdpi/ic_launcher.png`
- `mipmap-xxhdpi/ic_launcher.png`
- Plus the _round and _foreground variants

**→ Replace everything properly**
Use the ImageMagick commands above to generate all sizes

---

**Developer:** Thollarkings © 2025  
**Reference:** Asset locations and replacement guide
