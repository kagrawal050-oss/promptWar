# Culture Compass 🧭

**Culture Compass** is a modern, lightweight, and responsive GenAI Travel Guide web application built with Next.js 15, React, TypeScript, and Tailwind CSS. It helps users plan their perfect trips by generating mock AI itineraries, storytelling, and an interactive checklist, all based on their budget, destination, travel style, and interests.

## Features ✨
- **Smart Form:** Customize your trip by selecting destination, budget, travel style, and interests.
- **AI-Powered Itinerary (Mock):** Get a day-by-day plan including top attractions, hidden gems, and local foods.
- **Storytelling:** Enjoy an engaging AI-generated short story about the selected destination.
- **Interactive Checklist:** Pre-populated travel essentials categorized by Documents, Clothes, Medicines, and Essentials. Uses `localStorage` to save your progress.
- **Export Options:** Print or download the travel plan as a PDF natively via the browser.
- **Responsive UI:** Clean, minimalist, and vibrant design optimized for all devices, including a modern Glassmorphism theme.
- **Production Ready:** Fully Dockerized and ready to deploy to Google Cloud Run with an automated GitHub Actions pipeline.

## Architecture 🏛️
- **Frontend Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** TypeScript
- **State Management:** React Hooks & `localStorage`
- **Deployment:** Docker & Google Cloud Run

## Assumptions & Mocks 🎭
Since this project requires no actual database or paid AI API keys by default, the GenAI elements (the travel plan, stories, and recommendations) are generated via a mock AI service layer in `lib/services/ai-service.ts`. This allows you to test the full UI without spending API credits.

## Setup & Local Development 💻

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd culture-compass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

## Docker Commands 🐳

To build and run the application via Docker:

1. **Build the image:**
   ```bash
   docker build -t culture-compass .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 culture-compass
   ```

## Google Cloud Run Deployment 🚀

This project includes a `.github/workflows/deploy.yml` file to automate deployment to Google Cloud Run.

### Steps to set up CI/CD:
1. Create a Google Cloud Project and enable the **Cloud Run** and **Artifact Registry** APIs.
2. Create a service account with the following roles:
   - Cloud Run Admin
   - Service Account User
   - Artifact Registry Writer
3. Generate a JSON Key for the service account.
4. Go to your GitHub repository **Settings > Secrets and variables > Actions**.
5. Add the following secrets:
   - `GCP_PROJECT_ID`: Your Google Cloud Project ID.
   - `GCP_SA_KEY`: The JSON key you generated in step 3.
   - `GCP_REGION`: The region to deploy to (e.g., `us-central1`).
   - `GCP_SERVICE_NAME`: The name of your Cloud Run service (e.g., `culture-compass`).
6. Push changes to the `main` branch to trigger the deployment.

## Repository Structure 📂

```
culture-compass/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── app/                    # Next.js 15 App Router pages and layout
│   ├── globals.css         # Tailwind global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home/Landing page
│   ├── planner/            # Planner form page
│   └── plan/               # Results display page
├── components/             # Reusable UI components
│   ├── planner/            # Form components
│   ├── plan/               # Checklist and result components
│   └── ui/                 # Core UI building blocks (Buttons, Cards, etc.)
├── lib/
│   ├── services/           # Mock AI Service layer
│   └── utils.ts            # Utility functions (Tailwind class merging)
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── .dockerignore           # Docker ignore rules
├── Dockerfile              # Multi-stage Docker build config
├── next.config.ts          # Next.js configuration (standalone output enabled)
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```
