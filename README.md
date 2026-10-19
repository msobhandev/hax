# Pip's Midnight Observatory ✨

A magical, interactive storybook observatory website created for the **haX.baby Baby's First Website Hackathon 2026**.

Pip is a sleepy skull baby and Junior Dream Engineer at the Midnight Nursery. Pip crafts lullabies, warm nightlights, starlight navigation maps, and bedtime adventures to help little creatures drift into peaceful sleep.

---

## 🌟 Features & Highlights

### 1. Dual Storybook Environments (Day & Night)
- **Day Mode**: Warm cream surfaces (`#fffdf9`), berry accents (`#a34063`), golden sunlight warmth, and soothing peach panels (`#fdeedf`) with Pip peacefully asleep.
- **Night Mode**: Deep midnight navy (`#17172c`), dreamy purple surfaces (`#24213d`), neon-pink accents (`#e65d96`), and glowing warm starlight.
- **3D Interactive Starfield & Drifting Clouds (Night Mode)**: A real Three.js WebGL celestial starfield with 1,200 multi-depth stars and subtle, semi-transparent drifting cloud layers that glide slowly across the viewport with multi-plane depth and cursor parallax (`THREE.MathUtils.damp`). Fully responsive and respects `prefers-reduced-motion`.
- Theme preference is remembered across sessions via `localStorage`.

### 2. Audio & Lullaby Synthesizer
- Built with the native **Web Audio API**—no external audio files required!
- Five distinct peaceful lullaby patterns:
  - *Sunrise Lullaby*
  - *Starry Window*
  - *Moonlight Forest*
  - *Cloud Parade*
  - *Goodnight World*
- Full player controls: Play/Pause, Next/Previous, Seek bar, Shuffle, Repeat (All / One / Off), and Favorite heart toggles.
- Sound is **OFF initially** by default to respect visitors. A top-bar toggle smoothly enables/disables all gentle chime sound effects.

### 3. Interactive Nightlight Collection
- Four distinct illuminated lanterns: **Star Lantern**, **Heart Lantern**, **Moon Lantern**, and **Cloud Lantern**.
- Toggle individual lanterns on/off with glowing starlight auras.
- Master "Turn All On" and "Turn All Off" switches with a live glowing counter and starlight intensity slider.

### 4. Dream Delivery Routes
- **Realistic Storybook Relief Map**: Features a hand-crafted painterly landscape of the valley with high floating cloud dwellings (*Cloud Village*), glowing evergreen pine canopies (*Starry Forest*), the shimmering crescent reflection of *Moonlit Lake*, and the cliff-top brass dome of the *Midnight Observatory*.
- **Floating Animated Clouds & Terrain Shadows**: Semi-transparent fluffy cloud clusters glide horizontally across the landscape, casting realistic blurred drop-shadows onto the terrain beneath.
- **Illustrated 3D Landmark Badges**: Clickable 3D badges with glowing pulse rings, bedtime dream recipes, dispatchable starlight couriers, and live visited counter progress.

### 5. Illustrated Storybook Timeline
- Four richly illustrated storybook scenes detailing Pip's origin:
  1. *A Quiet Beginning*
  2. *Discovering Dreams*
  3. *The First Nightlight*
  4. *A Dream Engineer*
- Horizontal interactive timeline on desktop and vertical storybook timeline on mobile.

### 6. Observatory Guestbook
- Functional visitor log with name validation, stamp picker (🌟, 🌙, 💤, 🌸, 🍯, ☁️), live 200-character counter, and submission toast.
- Clearly identified as a **browser-local guestbook** backed by `localStorage` with sample notes from friendly valley creatures.

### 7. Retro Visitor Odometer
- Mechanical roller-style odometer counter tracking visits with an interactive *"Toss a Lucky Bedtime Star"* button.

### 8. Secret Starlight Easter Egg
- Tap the top-bar star button 5 times to trigger a starlight confetti explosion and unlock Pip's secret *Golden Cloud Slumber* dream blueprint!

### 9. Bedtime Focus Mode & Accessibility
- Focus mode toggle in Pip's status card dims peripheral sections to create a calm, distraction-free environment for bedtime.
- Desktop sparkle cursor trail that automatically disables when `prefers-reduced-motion` is detected.
- Fully responsive across desktop (1440px), laptop, tablet (768px), and mobile (360px–430px).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Typography**: `@fontsource/playfair-display`, `@fontsource/fredoka`, `@fontsource/dm-sans`
- **3D Graphics Engine**: Three.js (WebGL starfield particle system with exponential damping)
- **Audio Engine**: Web Audio API Procedural Synthesizer
- **Icons**: Lucide React
- **Confetti**: `canvas-confetti`

---

## 🚀 Installation & Local Development

1. **Clone or enter the project directory:**
   ```bash
   cd react-example
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to view Pip's Midnight Observatory.

4. **Verify TypeScript & linting:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 📜 Credits & License

- Created for **haX.baby Baby's First Website Hackathon 2026**.
- Character & Lore: Pip, Junior Dream Engineer at the Midnight Nursery.
- "Made with love, starlight, and lots of dreams."
- © 2026 Pip · All dreams reserved.
