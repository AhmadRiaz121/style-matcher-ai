## Inspiration
I built this because I kept seeing screenshots, moodboards, and candid photos that captured a mood — a silhouette, a color palette, or a particular fabric texture — and I wanted a fast, no‑friction way to say “that exact vibe” out loud. This project isn’t about shopping; it’s about naming and exploring style: why a look reads as vintage, relaxed, minimalist, or edgy.

Outfits are small visual compositions. My goal was to make the relationships between shape, color, texture, and proportion discoverable: drop an image and surface other looks that share the same visual structure and feel.

## What it does
- Upload or drop an image to get visually similar looks ranked by embedding similarity.
- Show quick previews, dominant color hints, and rough silhouette cues so you can inspect why a match was suggested.
- Provide a small, extendable frontend that can connect to server-side embeddings or a vector index for larger datasets.

## How We built it
- **Frontend:** created a Vite + React + TypeScript app to handle image uploads, previews, and results. UI components are composed for a tidy, responsive experience. Files live under `src` and the dev server runs with `npm run dev`.
- **Embeddings / Matching:** images are sent to an embedding pipeline (local or external model). Each image becomes a vector in $\mathbb{R}^d$; similarity is computed with cosine or Euclidean distance to find top matches.
- **Tooling & tests:** used `vitest` for a tiny test suite and automated linting with ESLint; dependencies installed via `npm ci`.
- **UX touches:** added instant preview, progress states while embeddings compute, and a compact result grid that links to source data or shop items.

## Challenges faced
- Capturing subjective style: the same outfit can read very differently by crop, lighting, or context, so curating examples and tuning similarity thresholds required several passes.
- Speed vs. quality: browser-friendly approaches keep latency low but can limit embedding richness; server-side models improve quality at the cost of latency and infra.
- Explainability: making matches feel interpretable required adding simple visual cues (dominant color, silhouette tag) rather than relying on opaque rankings.

## Accomplishments that we're proud of
- A responsive, minimal UI that runs locally with HMR (npm run dev) so iteration is effortless.
- A small test suite (npm run test) and linting to keep the codebase tidy.
- A modular component structure ready for plugging in different embedding models, adding color/silhouette filters, or scaling with a vector DB.

## What We learned
- How to build a modern frontend scaffolded with Vite and TypeScript, and integrate small ML/embedding workflows into a web app.
- Practical details of developer ergonomics: configuring `vite`, Tailwind integration, and fast feedback loops with HMR.
- Basics of image similarity: converting images to vector embeddings, and using distance metrics for ranking. For two vectors $u,v\in\mathbb{R}^d$ I used cosine similarity:

$$
s(u,v)=\frac{u\cdot v}{\|u\|\|v\|}
$$

which emphasises directional similarity (the “mood”) more than absolute scale.
- UX lessons: immediate visual feedback (previews, subtle loading states, clear result layout) makes the tool feel useful even as a prototype.

## What's next for Style AI
- Add optional server-side embeddings and batch indexing for higher-fidelity matches.
- Introduce explainability badges (color, silhouette, texture) so users understand matches at a glance.
- Add user collections and simple comparison tools so people can save and compare styles over time.
- Experiment with a small vector DB (Faiss or similar) for fast nearest-neighbour search across larger catalogs.

## Final note
This project is a small, focused playground for exploring visual style. It emphasises discovery and clarity over commerce