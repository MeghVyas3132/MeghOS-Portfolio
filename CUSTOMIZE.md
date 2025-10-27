# 🚀 Portfolio Customization Guide

## Quick Start

Your portfolio has an **Edit Mode** that allows you to customize all content without touching code!

### 🔓 Accessing Edit Mode

1. Look for the **🔒 Lock icon** in the top-right corner of your portfolio
2. Click it to open the authentication dialog
3. Enter password: `devops123`
4. You're now in Edit Mode!

---

## 📸 Adding Your Google Drive Photos

### Step 1: Prepare Your Photos
1. Create a folder in Google Drive with your photos
2. Right-click the folder → **Get link**
3. Change permissions to **"Anyone with the link"** → Can view
4. Copy the full link (e.g., `https://drive.google.com/drive/folders/1ABC...XYZ`)

### Step 2: Extract Folder ID
From this URL: `https://drive.google.com/drive/folders/1ABC123XYZ456`
Your Folder ID is: `1ABC123XYZ456`

### Step 3: Add to Portfolio
1. Enter Edit Mode (🔒 icon)
2. Find **"Google Drive Photos Folder ID"** field
3. Paste your Folder ID: `1ABC123XYZ456`
4. Click **Save Changes**
5. Open the Photos app to see your photos!

---

## 📄 Adding Your Resume

### Step 1: Upload to Google Drive
1. Upload your resume (PDF) to Google Drive
2. Right-click → **Get link**
3. Change to **"Anyone with the link"** → Can view
4. Copy the shareable link

### Step 2: Add to Portfolio
1. Enter Edit Mode (🔒 icon)
2. Paste link in **"Resume URL"** field
3. Click **Save Changes**
4. A "View Resume" button will appear in the About app!

---

## ✏️ Editing Your Information

In Edit Mode, you can customize:

### Name & Role
- **Name**: Your full name or professional title
- **Role**: Your job title (e.g., "DevOps Engineer", "Full Stack Developer")

### About Section
Write a brief introduction about yourself:
- Your experience
- Your specialties
- What you're passionate about

### Skills
Add your technical skills as comma-separated values:
```
Docker, Kubernetes, Linux, AWS, Terraform, Python, React, TypeScript
```

---

## 🗂️ Customizing Projects (File Manager)

Currently, the File Manager shows demo projects. To customize:

### Option 1: Edit the Code
Open `src/components/apps/FileManager.tsx` and modify the `getDefaultFileSystem()` function:

```typescript
const getDefaultFileSystem = (): FileItem[] => [
  {
    name: 'home',
    type: 'folder',
    children: [
      {
        name: 'projects',
        type: 'folder',
        children: [
          { name: 'your-project-1', type: 'folder' },
          { name: 'your-project-2', type: 'folder' },
          { name: 'your-project-3', type: 'folder' },
        ],
      },
      // Add more folders and files as needed
    ],
  },
];
```

### Option 2: Projects to Showcase
Consider adding:
- GitHub repositories (as folders)
- Deployment scripts (as .sh files)
- Configuration files (as .yml, .json files)
- Documentation (as .md files)

---

## 🎨 Changing the Theme

### Change Password
Edit `src/components/EditMode.tsx`:
```typescript
const ADMIN_PASSWORD = 'your-new-password';
```

### Colors
Colors are defined in `src/index.css`. The main theme color is:
```css
--primary: 142 76% 48%; /* Terminal Green */
```

---

## 🚀 Deploying Your Portfolio

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 4. Deploy to GitHub Pages
```bash
# Build
npm run build

# Push dist folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

---

## 📝 Tips & Best Practices

### Photos
- Use high-quality images (min 1200px width)
- Keep file sizes reasonable (compress if needed)
- Organize photos in Google Drive before adding

### Resume
- Keep it updated
- Use PDF format
- Ensure it's properly formatted

### Skills
- List most relevant skills first
- Group similar skills together
- Update regularly as you learn

### Testing Before Deploy
```bash
# Test locally
npm run dev

# Build and preview production
npm run build
npm run preview
```

---

## 🆘 Troubleshooting

### Photos not showing?
1. Check folder ID is correct
2. Ensure folder is publicly accessible
3. Check browser console for errors
4. Try refreshing the page

### Resume not opening?
1. Verify the link is publicly accessible
2. Test the link in a private browser window
3. Ensure it's a direct Google Drive link

### Changes not saving?
1. Check browser console for errors
2. Clear localStorage and try again
3. Make sure you clicked "Save Changes"

---

## 🔐 Security Note

**Remember**: This portfolio stores data in browser localStorage. For production:
- Change the default password immediately
- Consider implementing proper backend authentication
- Don't store sensitive information

---

## 📞 Need Help?

If you need to customize something not covered here:
1. Check the component files in `src/components/apps/`
2. Each app is self-contained and easy to modify
3. All styling uses Tailwind CSS classes

---

**Happy Customizing! 🎉**
