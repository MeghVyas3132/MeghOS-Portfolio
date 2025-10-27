# Netlify Deployment Guide

## Pre-Deployment Checklist

### ✅ 1. Update Resume Link
- [ ] Upload your resume to Google Drive
- [ ] Set sharing to "Anyone with the link can view"
- [ ] Copy the share link (format: `https://drive.google.com/file/d/FILE_ID/view`)
- [ ] Go to Edit Mode (🔒 icon)
- [ ] Paste the link in "Resume URL" field
- [ ] Click "Save All Changes"

### ✅ 2. Add Profile Photo (Optional)
- [ ] In Edit Mode, upload a profile photo URL
- [ ] Or add the image to `/src/assets/` and reference it

### ✅ 3. Update Projects
- [ ] Add all your projects via Edit Mode → Projects section
- [ ] Include: name, description, tech stack, demo link, repo link

### ✅ 4. Verify Contact Info
- [ ] Email: megh.vyas@yahoo.com ✓
- [ ] Phone: +91 88665 48854 ✓
- [ ] LinkedIn: https://linkedin.com/in/MeghVyas ✓
- [ ] GitHub: https://github.com/MeghVyas3132 ✓

## Build Configuration for Netlify

### Build Settings:
```
Build command: npm run build
Publish directory: dist
Node version: 18.x or higher
```

### No Environment Variables Needed
This project doesn't use any API keys or environment variables - you're good to go!

## Known Limitations

### localStorage Won't Persist
- Changes made via Edit Mode are stored in browser localStorage
- These changes **won't persist** after you redeploy from GitHub
- **Solution**: Always update default values in the code before deploying

### How to Make Permanent Changes:
1. Update the code directly in `/src/components/apps/About.tsx` (already done!)
2. Update projects in `/src/components/EditMode.tsx` default state
3. Commit and push to GitHub
4. Netlify will auto-deploy with your changes

## Google Drive Links Work Fine! ✅
- Resume links from Google Drive work perfectly
- Just ensure the file is set to "Anyone with the link can view"
- The link will open in a new tab when clicked

## Troubleshooting

### Photos Not Showing?
- Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Photos are bundled in the build, they will work on Netlify

### Resume Link Not Working?
- Verify the Google Drive file is publicly accessible
- Test the link in an incognito window first
- Use format: `https://drive.google.com/file/d/FILE_ID/view`

### Content Not Updating?
- If you made changes via Edit Mode and then redeployed, they're lost
- Update the code directly and commit to GitHub instead

## Post-Deployment

### First Steps After Deployment:
1. Visit your Netlify URL
2. Test the landing page scroll
3. Open all apps to verify functionality
4. Test the resume download button
5. Verify all photos load correctly

### Share Your Portfolio:
- Add your Netlify URL to your resume
- Share on LinkedIn: https://linkedin.com/in/MeghVyas
- Add to GitHub profile README

## Need Backend Persistence?
If you want Edit Mode changes to persist across deployments, consider:
- **Supabase** (free tier, easy setup)
- **Firebase** (free tier, real-time)
- **MongoDB Atlas** (free tier, document database)

I can help you set any of these up if needed!
