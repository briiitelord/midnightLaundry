# Laundry Sketch Background

## Image Setup

The main background of the midnightLaundry site uses a hand-drawn sketch of a washing machine.

### File Location
- **Path**: `/public/laundry-sketch.jpg`
- **Used in**: `src/pages/HomePage.tsx`

### Image Configuration
```css
background-image: url(/laundry-sketch.jpg)
background-size: cover
background-position: center
background-attachment: fixed
opacity: 0.08 (subtle watermark effect)
```

### Overlay
A white/gray gradient overlay is applied on top (95% opacity) to ensure content readability while maintaining the artistic sketch as a watermark.

### Manual Setup Required
**Important**: You need to manually add `laundry-sketch.jpg` to the `public/` folder. 

The image should be:
- Format: JPG or PNG
- Recommended size: 1920x1080 or larger
- The sketch shows the iconic midnightLaundry washing machine drawing

### Alternative Formats
You can also use:
- `laundry-sketch.png` (update HomePage.tsx accordingly)
- `laundry-sketch.webp` for better compression

### Deployment Notes
Unlike `forest-texture.jpg` which is in .gitignore due to size, you may want to:
1. Optimize the laundry sketch image (compress it)
2. Either commit it to git or
3. Add it manually to your hosting platform's public assets
