# Portfolio — Local notes

This is a small update that adds:

- A modern hero with a profile photo placeholder.
- A project gallery with image thumbnails and a demo video.
- A lightbox modal for viewing images and playing the video.
- Updated modern styles and responsive layout.

How to replace placeholders

- Profile photo: replace the `src` in the hero photo (`index.html`) with your image, e.g. `assets/me.jpg`.
- Project images: replace the URLs in the `.gallery-item` `data-src` attributes with your own images.
- Project video: replace the video `data-src` with your hosted MP4 or a relative path such as `assets/demo.mp4`.

Assets folders created

- `assets/images/` contains three example SVG thumbnails: `project1.svg`, `project2.svg`, `project3.svg`.
- `assets/videos/` contains `README.txt` with notes on adding local video files and a sample remote video URL.

- A demo placeholder video `assets/videos/demo.mp4` has been created as a local placeholder file — replace it with your real MP4 (e.g., `demo.mp4`) and keep the name or update `index.html` accordingly.
 
Animations & background

- The design now includes animated blurred blobs (`.bg-blobs`) and a subtle gradient overlay to give the site more depth. You can tweak colors in `style.css` under the `.b1`, `.b2`, and `.b3` rules.
- Sections and project cards reveal on scroll using a small IntersectionObserver in `script.js`.

Designs & animations added

- Glass / Neumorphism base: cards use a frosted glass look with soft shadows. Tweak colors in `style.css` under `:root`.
- Glass / Neumorphism base: cards use a frosted glass look with soft shadows. The site now uses the color tokens you provided (see `:root` and `[data-theme="light"]` in `style.css`). Tweak those variables to change accents, background, and glass appearance.
- Subtle parallax hero: the big background name and hero photo move slightly on mouse move (`script.js`).
- Interactive grid: project tiles tilt on hover, scale on hover, and have staggered reveal timings.

Video note

- The gallery video item currently points to a remote sample URL so it plays without a local file. To use a local video, replace the `data-src` value on the video gallery button in `index.html` with `assets/videos/demo.mp4` (or your filename) and add/replace the file in `assets/videos/`.
 
- Example project video: the "Smart Schedule Optimizer" project includes an embedded sample video (remote MP4). Hover the project media to autoplay (muted) and move the cursor out to pause. Replace the `<video>` `src` in `index.html` to use a local file (`assets/videos/demo.mp4`) if you prefer.

To use the local images, replace the SVGs or add new images and update the `data-src` attributes in the gallery items inside `index.html`.

Test locally

1. Open `index.html` in your browser (double-click) or run a simple server from this folder:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

Notes

- If you add local media files, put them in an `assets/` folder and update the paths accordingly.
- The lightbox automatically handles images and MP4 videos. Press `Esc` or click outside to close.

If you'd like, I can:
- Add local `assets/` placeholders (small thumbnails + a short mp4).
- Integrate a nicer gallery (masonry, captions), or create a CMS workflow to manage projects.
