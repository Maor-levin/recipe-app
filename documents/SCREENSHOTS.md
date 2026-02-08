# Screenshots Guide

This document outlines recommended screenshots to add to your project README to make it more visually appealing and professional.

---

## Recommended Screenshots

### 1. **Home Page / Recipe Feed**
**What to show:**
- Main landing page with recipe grid
- Search bar
- Navigation header
- A few recipe cards with thumbnails

**Why:** First impression - shows the clean UI and main functionality

**File name:** `home-page.png`

---

### 2. **Recipe Editor / Create Recipe**
**What to show:**
- Block-based editor interface
- Different block types (text, list, image, subtitle)
- Add block buttons
- Save/cancel actions

**Why:** Demonstrates the flexible content system and UX

**File name:** `recipe-editor.png`

---

### 3. **AI Variant Generation**
**What to show:**
- Original recipe displayed
- "Generate Variant" button with options (vegan, gluten-free, etc.)
- Side-by-side comparison or modal with generated variant
- Changes highlighted

**Why:** Showcases the main technical feature (AI + caching)

**File name:** `ai-variant-generation.png`

---

### 4. **Recipe Detail Page**
**What to show:**
- Full recipe view with blocks rendered
- Comments section below
- Favorite/note buttons
- Recipe metadata (author, date)

**Why:** Shows community features and complete recipe experience

**File name:** `recipe-detail.png`

---

### 5. **Comments & Community Features** (Optional)
**What to show:**
- Comment thread
- Add comment form
- User interactions

**Why:** Demonstrates social/community aspect

**File name:** `comments.png`

---

## Where to Store

Create a folder: `/screenshots/` or `/docs/images/`

```
recipe-app/
├── screenshots/
│   ├── home-page.png
│   ├── recipe-editor.png
│   ├── ai-variant-generation.png
│   ├── recipe-detail.png
│   └── comments.png (optional)
```

---

## How to Add to README

Once you have screenshots, update the main `README.md`:

```markdown
## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home-page.png)

### Recipe Editor
![Recipe Editor](./screenshots/recipe-editor.png)

### AI Variant Generation
![AI Variants](./screenshots/ai-variant-generation.png)

### Recipe Detail
![Recipe Detail](./screenshots/recipe-detail.png)
```

Or create a more compact gallery:

```markdown
## 📸 Screenshots

<p align="center">
  <img src="./screenshots/home-page.png" width="45%" />
  <img src="./screenshots/recipe-editor.png" width="45%" />
</p>

<p align="center">
  <img src="./screenshots/ai-variant-generation.png" width="45%" />
  <img src="./screenshots/recipe-detail.png" width="45%" />
</p>
```

---

## Bonus: Demo Video (Optional)

Consider creating a short demo video (2-3 minutes):

**Tools:**
- [Loom](https://www.loom.com/) - Free screen recording
- [OBS Studio](https://obsproject.com/) - Free open-source
- macOS: Built-in screen recording (Cmd+Shift+5)

**What to demo:**
1. Browse recipes (10s)
2. Create a new recipe with blocks (30s)
3. Generate AI variant (30s)
4. Add comment, favorite, note (20s)
5. Search functionality (10s)

**Where to host:**
- YouTube (unlisted)
- GitHub (as release asset)
- Loom (direct link)

**Add to README:**
```markdown
## 🎬 Demo Video

[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
```

---

## Tips

- Use clean, populated data (not "test test test")
- Take screenshots at consistent window size (1920x1080 or 1440x900)
- Use browser dev tools to show both desktop and mobile views
- Crop out browser chrome if preferred
- Optimize images for web (PNG or WebP, reasonable file size)

---

**After adding screenshots, your README will look much more professional and engaging to recruiters!**
