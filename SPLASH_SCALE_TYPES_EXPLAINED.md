# Android Splash Screen Scale Types

**Understanding how splash images are displayed**

---

## 📐 Android ScaleType Options

### **CENTER_CROP** (Previous setting)
- **Scales image** to fill entire screen
- **Crops edges** if aspect ratio doesn't match
- **Problem:** Your logo might get cut off on different screen sizes
- **Good for:** Full-screen background images

### **CENTER_INSIDE** (Current setting)
- **Scales image** to fit inside screen
- **Shows entire image** without cropping
- **Adds letterboxing** if needed (shows background color)
- **Good for:** Ensuring logo is always fully visible

### **FIT_CENTER**
- Similar to CENTER_INSIDE
- Scales down only if needed
- Centers the image

### **CENTER**
- **No scaling**
- Centers image as-is
- **Problem:** Small on large screens, cut off on small screens

---

## 🎯 What We Changed

**Before:**
```typescript
androidScaleType: "CENTER_CROP"
```
- Would crop your logo on portrait screens
- Might cut off important parts

**After:**
```typescript
androidScaleType: "CENTER_INSIDE"
```
- Shows entire logo always
- Adds white space if needed
- Logo never gets cut off

---

## 💡 Your Concern About Landscape Images

You mentioned: "even if the image is landscape the splashscreen should still show the middle which will show on the screen"

**Good news!** With `CENTER_INSIDE`:
- If you have a landscape splash image (e.g., 1920x1080)
- On a portrait screen (e.g., 1080x1920)
- It will:
  1. Scale the image down to fit
  2. Center it vertically
  3. Show white space above/below
  4. **The middle (your logo) will always be visible!**

---

## 🎨 Best Practice for Your Splash

Since you want the logo to always show centered, here are the options:

### **Option 1: Use Proper Portrait/Landscape Files** (Current - Best)
- Portrait files in `drawable-port-*`
- Landscape files in `drawable-land-*`
- Android automatically picks the right one
- ✅ **Currently implemented**

### **Option 2: Use One Square Image with CENTER_INSIDE**
- Create one square splash (e.g., 1920x1920)
- Put your logo in the center
- Set `androidScaleType: "CENTER_INSIDE"`
- Android scales it to fit any screen
- Logo always visible

### **Option 3: Use One Landscape Image**
- Create one wide image (e.g., 1920x1080)
- Put logo in the center
- Use `CENTER_INSIDE`
- Will show with letterboxing on portrait screens

---

## 🔧 Current Configuration

**Your setup:**
- Scale type: `CENTER_INSIDE`
- Background: White (`#ffffff`)
- Duration: 2 seconds
- Separate portrait/landscape files: ✅

**This ensures:**
- ✅ Logo never gets cropped
- ✅ Always fully visible
- ✅ Centered on screen
- ✅ Works on all screen sizes

---

## 🧪 Testing Different Scale Types

If `CENTER_INSIDE` doesn't look right, you can try:

**For more screen coverage:**
```typescript
androidScaleType: "FIT_XY"  // Stretches to fill (might distort)
androidScaleType: "FIT_CENTER"  // Fits without distortion
```

**For precise control:**
```typescript
androidScaleType: "CENTER"  // No scaling, might be too small/large
```

**For full bleed:**
```typescript
androidScaleType: "CENTER_CROP"  // Fills screen, crops edges
```

---

## 📱 How It Works Now

**Portrait Phone (1080x1920):**
1. Loads `drawable-port-xhdpi/splash.png` (720x1280)
2. Scales with `CENTER_INSIDE`
3. Shows full logo centered
4. White background around it

**Landscape Phone (1920x1080):**
1. Loads `drawable-land-xhdpi/splash.png` (1280x720)
2. Scales with `CENTER_INSIDE`
3. Shows full logo centered
4. White background around it

**Result:** Logo always visible, never cropped!

---

## 🎯 Recommendation

**Current setting (`CENTER_INSIDE`) is perfect if:**
- ✅ You want logo always fully visible
- ✅ You don't mind white space around logo
- ✅ You want consistent appearance

**Change to `FIT_CENTER` if:**
- You want same behavior but slightly different scaling algorithm

**Change to `CENTER_CROP` if:**
- You want splash to fill entire screen
- You're okay with edges being cropped
- Your logo is small and centered in the image

---

## 🚀 What's Next

The configuration is now:
- ✅ `CENTER_INSIDE` - Logo won't be cropped
- ✅ White background
- ✅ 2 second duration

**Rebuild and test:**
```bash
npm run cap:sync
cd android && ./gradlew assembleRelease
```

---

**Developer:** Thollarkings © 2025  
**Splash Scale:** CENTER_INSIDE  
**Status:** Configured to always show full logo
