## [jfinophoto.com](https://jfinophoto.com/)

This is my personal photography portfolio to showcase my concert, music festival, and event photography.

### Tech Stack
- Typescript
- Next.js
- TailwindCSS
- Google Drive APIs
- Supabase (PostgreSQL)
- Vercel (hosting)

### Photo Caching

The photos on the site are populated from a Google Drive where I upload all my edited photos. A hidden edit page allows me to add/remove photos from each of the pages. Photo links are thumbnail links obtained via the Google Drive API. They are refreshed once per hour and stored in a table in Supabase to prevent making too many calls to the API.

When working on this project, I wanted to prioritize speed and responsiveness, especially on mobile. Photo-heavy sites can sometimes have a lot of layout issues or be slow to load, so I wanted to make sure to keep it simple while still incorporating some simple animations with CSS and intersection observers.

### Next Steps
- Nicer editing interface
- SEO optimization

![Screenshot 2025-01-29 at 8 43 54 PM](https://github.com/user-attachments/assets/09b43262-46e9-4e81-81a6-462079402a32)
