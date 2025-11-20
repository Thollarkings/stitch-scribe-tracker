# Tailors Suite - Release Checklist

**Version:** 1.0.0  
**Target:** Google Play Store  
**Date Started:** January 2025

Use this checklist to track your progress toward Play Store submission.

---

## 📋 Phase 5: Release Preparation

### Version Management
- [x] Updated package.json to version 1.0.0
- [x] Set versionCode to 1 in build.gradle
- [x] Set versionName to "1.0" in build.gradle
- [x] Confirmed target SDK is API 35

### App Signing
- [x] Added signing configuration to build.gradle
- [x] Created keystore.properties.example template
- [x] Added keystore files to .gitignore
- [ ] **Generated release keystore** → Run `npm run generate-keystore`
- [ ] **Created keystore.properties file** → Run `npm run setup-keystore`
- [ ] **Backed up keystore file** to secure location
- [ ] **Stored passwords** in password manager

### Documentation
- [x] Created RELEASE_GUIDE.md
- [x] Created PRIVACY_POLICY.md template
- [x] Created PLAY_STORE_ASSETS.md guide
- [x] Created PHASE5_SUMMARY.md
- [x] Created RELEASE_CHECKLIST.md (this file)
- [x] Updated STATUS.md with Phase 5 progress

### Helper Scripts
- [x] Created generate-keystore.sh script
- [x] Created create-keystore-properties.sh script
- [x] Added npm scripts for release workflow

### Play Store Assets - Preparation
- [x] Created play-store-assets directory structure
- [x] Confirmed app icon exists (512x512)
- [ ] **Created feature graphic** (1024x500)
- [ ] **Captured phone screenshots** (minimum 2, recommended 4-8)
- [ ] **Organized all assets** in play-store-assets folder

### Privacy Policy
- [ ] **Updated PRIVACY_POLICY.md** with contact email (2 places)
- [ ] **Reviewed privacy policy** content
- [ ] **Hosted privacy policy** on public URL
- [ ] **Tested privacy policy URL** (accessible from anywhere)

---

## 🏗️ Build & Test

### Pre-Build
- [ ] All code changes committed
- [ ] Web assets build successfully (`npm run build:android`)
- [ ] No console errors or warnings
- [ ] Keystore configured correctly

### Build Release
- [ ] **Built release AAB** → `npm run build:release`
- [ ] Verified AAB file exists at `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] AAB file size is reasonable (check it's not too large)
- [ ] **Built release APK** (optional, for testing) → `npm run android:release-apk`

### Testing on Device
- [ ] Installed release APK on physical device
- [ ] App launches without errors
- [ ] Tested user registration
- [ ] Tested user login/logout
- [ ] Tested create/edit/delete measurements
- [ ] Tested create/edit/delete jobs
- [ ] Tested payment tracking
- [ ] Tested invoice generation
- [ ] Tested PDF export/download
- [ ] Tested offline mode (airplane mode)
- [ ] Tested data sync after reconnecting
- [ ] Checked all screens render correctly
- [ ] Verified no crashes or freezes
- [ ] Tested on different screen sizes (if available)
- [ ] Verified app performance is acceptable
- [ ] Checked battery usage is reasonable

---

## 📱 Play Store Preparation

### Account Setup
- [ ] **Created Google Play Console account**
- [ ] **Paid $25 registration fee**
- [ ] Completed account profile
- [ ] Verified email address

### App Creation
- [ ] Created new app in Play Console
- [ ] Set app name: "Tailors Suite"
- [ ] Set default language: English (US)
- [ ] Selected app type: App (not Game)
- [ ] Selected pricing: Free

### Store Listing - Main Info
- [ ] Uploaded app icon (512x512)
- [ ] Uploaded feature graphic (1024x500)
- [ ] Uploaded phone screenshots (minimum 2)
- [ ] Added short description (80 chars max)
- [ ] Added full description (see PLAY_STORE_ASSETS.md)
- [ ] Selected app category (Business or Productivity)
- [ ] Added contact email
- [ ] Added privacy policy URL

### Store Listing - Additional
- [ ] Completed content rating questionnaire
- [ ] Set target audience (13+)
- [ ] Indicated app is NOT designed for children
- [ ] Added tags/keywords (optional)
- [ ] Selected countries/regions for distribution
- [ ] Confirmed app is free with no in-app purchases

### App Content
- [ ] Completed privacy & security section
- [ ] Declared data handling practices
- [ ] Confirmed ads declaration (Yes/No)
- [ ] Completed government apps section (if applicable)
- [ ] Reviewed all policies and requirements

### Release - Production
- [ ] Created new production release
- [ ] Uploaded app-release.aab file
- [ ] Added release notes for version 1.0
- [ ] Reviewed release details
- [ ] Set rollout percentage (recommend starting at 20%)

---

## 🚀 Submission

### Pre-Submission Review
- [ ] Reviewed all store listing content for accuracy
- [ ] Verified all screenshots display correctly
- [ ] Tested privacy policy URL
- [ ] Confirmed contact email is correct
- [ ] Reviewed app description for typos
- [ ] Checked that all required fields are complete
- [ ] Verified no placeholder text remains

### Submit for Review
- [ ] **Submitted app for review**
- [ ] Received confirmation email
- [ ] Noted submission date: ________________
- [ ] Set calendar reminder to check status

### Review Status Tracking
- [ ] Status: Pending (wait 1-7 days typically)
- [ ] Received any feedback from Google
- [ ] Addressed any issues if rejected
- [ ] Resubmitted if necessary
- [ ] **App approved and published!** 🎉

---

## 📊 Post-Launch

### Monitoring (First Week)
- [ ] Checked Play Console for crash reports
- [ ] Reviewed user ratings (if any)
- [ ] Responded to user reviews
- [ ] Monitored installation metrics
- [ ] Checked for ANR (App Not Responding) reports
- [ ] Verified app appears in search results

### Monitoring (First Month)
- [ ] Gathered user feedback
- [ ] Created list of bug fixes needed
- [ ] Created list of feature requests
- [ ] Planned version 1.1 update
- [ ] Updated documentation based on learnings

### Marketing (Optional)
- [ ] Shared on social media
- [ ] Created landing page or website
- [ ] Reached out to tailoring communities
- [ ] Asked satisfied users for reviews
- [ ] Created promotional materials

---

## 🔄 Future Updates Preparation

### For Version 1.1
- [ ] Updated version in package.json
- [ ] Incremented versionCode in build.gradle
- [ ] Updated versionName in build.gradle
- [ ] Made code changes/improvements
- [ ] Tested thoroughly
- [ ] Built new release AAB
- [ ] Prepared release notes
- [ ] Submitted update to Play Store

---

## 📝 Important Information

### Keystore Details (KEEP SECURE!)
- **Keystore Location:** ________________________________
- **Keystore Password:** (stored in password manager)
- **Key Alias:** tailors-suite
- **Key Password:** (stored in password manager)
- **Backup Location:** ________________________________

### Play Store Details
- **Developer Account Email:** ________________________________
- **App Package:** com.tailorssuite.app
- **Play Console URL:** https://play.google.com/console
- **App URL (after publish):** https://play.google.com/store/apps/details?id=com.tailorssuite.app

### Privacy Policy
- **Hosted URL:** ________________________________
- **Last Updated:** ________________________________

### Support
- **Contact Email:** ________________________________
- **Support Website:** ________________________________

---

## 🎯 Quick Status

**Current Phase:** Phase 5 - Release Preparation  
**Progress:** Configuration Complete ✅  
**Next Action:** Generate keystore and create assets ⚠️  
**Target Submission Date:** ________________  

---

## 📞 Need Help?

- **Release Guide:** See `RELEASE_GUIDE.md`
- **Asset Guide:** See `PLAY_STORE_ASSETS.md`
- **Quick Summary:** See `PHASE5_SUMMARY.md`
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Play Store Help:** https://support.google.com/googleplay/android-developer

---

**Last Updated:** January 2025  
**Developer:** Thollarkings © 2025  

---

## 📈 Progress Summary

**Total Tasks:** 100+  
**Completed:** ~25 (Configuration)  
**Remaining:** ~75 (Action Items)  

**Estimated Time to Complete:** 4-6 hours  
**Estimated Review Time:** 1-7 days  

**You've got this! 🚀**
