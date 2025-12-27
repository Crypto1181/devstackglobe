# Template Features Update

## Summary
Added image carousel and review system to templates, allowing admins to upload multiple images and manage reviews, and users to view carousels and submit reviews.

## Database Changes

### 1. Run SQL Schema Update
Run the updated `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor. This adds:
- `images` JSONB field for storing multiple image URLs
- `reviews` JSONB field for storing customer reviews

The schema automatically adds these columns if the table already exists.

## New Features

### Admin Panel Features

#### Multiple Image Upload
- Upload multiple images per template (for carousel)
- Add images via file upload or URL
- Edit/remove individual images
- Images are stored in Supabase Storage

#### Review Management
- Add reviews with:
  - Reviewer name
  - Review text
  - Star rating (1-5)
- View all existing reviews
- Delete reviews
- Reviews are stored in the database

### User-Facing Features

#### Image Carousel
- Swipe through multiple template images
- Navigation arrows (left/right)
- Dot indicators showing current image
- Smooth transitions

#### Reviews Display
- View all customer reviews
- See reviewer names, ratings (stars), and review text
- Reviews sorted by date

#### Submit Reviews
- Users can submit their own reviews
- Form includes:
  - Name field
  - Star rating selector (1-5)
  - Review text area
- Reviews are saved to the database

## Files Modified

1. **SUPABASE_SCHEMA.sql** - Added `images` and `reviews` JSONB columns
2. **src/types/database.ts** - Added `TemplateReview` interface and updated `Template` interface
3. **src/pages/Admin.tsx** - Added multiple image upload and review management UI
4. **src/pages/Templates.tsx** - Added image carousel and review display/submission
5. **admin-panel.html** - Added multiple image upload and review management for standalone admin panel

## How to Use

### For Admins

1. **Adding Multiple Images:**
   - Go to Admin Panel → Templates tab
   - Click "Upload New Image" or "Add Image URL"
   - Upload/enter as many images as needed
   - Images will appear in a carousel on the template detail page

2. **Managing Reviews:**
   - In the template form, scroll to "Reviews" section
   - Fill in reviewer name, rating (1-5), and review text
   - Click "Add Review"
   - Reviews will appear on the template detail page

### For Users

1. **Viewing Template Details:**
   - Click on any template card
   - Modal opens showing:
     - Image carousel (if multiple images)
     - Full description
     - All reviews
     - Add to cart button

2. **Submitting Reviews:**
   - Open template detail modal
   - Scroll to "Write a Review" section
   - Fill in your name, select rating, write review
   - Click "Submit Review"
   - Your review will appear immediately

## Notes

- The first image in the `images` array is used as the main template image
- If no images are uploaded, it falls back to the single `image` field
- Reviews are stored as JSONB arrays in the database
- All authenticated users can submit reviews
- Image uploads require authentication

