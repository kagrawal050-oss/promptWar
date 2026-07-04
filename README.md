# Cooking To-Do List AI 🍳🤖

A modern, production-ready Next.js 15 (App Router) micro-application that generates a highly personalized daily cooking schedule, recipe selections, budget feasibility analysis, and smart grocery checklists.

## 🚀 Live Demo & Deployment
This application is fully type-safe, validated using Zod schemas, and optimized for instant, zero-configuration deployments on **Vercel**.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict type checking)
- **Styling**: Tailwind CSS v4 & Vanilla CSS custom variables
- **Form Management**: React Hook Form
- **Validation**: Zod (Type-safe schemas)
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Formatting & Linting**: ESLint, Prettier

---

## 🏗️ Architecture & Folder Layout
The project uses a feature-based, maintainable directory structure:
```
d:/promptWarJune26/
├── app/                          # Next.js App Router (Layouts & Pages)
│   ├── layout.tsx                # Root layout (Google Fonts Inter/Outfit)
│   ├── page.tsx                  # Animated Landing Page
│   ├── dashboard/                # Main Application Container
│   └── globals.css               # Apple-inspired CSS tokens & resets
├── components/                   # Shared UI Components
│   └── ui/                       # Design System Elements
├── features/                     # Feature-based folder layout
│   └── planner/                  # Cooking Planner modules
│       ├── components/           # Forms, Recipies, Grocery, Schedule, and Tips
│       ├── hooks/                # useMealPlan logic with fake AI loaders
│       └── services/             # Recipe DB and Rules-based AI Planner engine
├── hooks/                        # Custom reusable React hooks
│   └── use-local-storage.ts      # SSR-safe localStorage syncing hook
├── lib/                          # Constants & helpers
│   ├── utils.ts                  # cn class merger
│   └── constants.ts              # Dropdown selections & ingredient pools
├── types/                        # TypeScript typings
│   └── index.ts                  # Declarations for recipes and configurations
└── utils/                        # Utility functions
    └── pdf-export.ts             # Dynamic Print & PDF Exporter script
```

---

## 🧠 Rules-Based AI Planner Service
To remain modular and ready for external LLM integrations, the core logic is isolated in a dedicated service layer: `features/planner/services/ai-service.ts`.
1. **Constraint Filters**: Removes recipes containing ingredients mapped to user-specified food allergies.
2. **Score-based Matchmaker**: Ranks recipe candidates by scoring cuisine preference, daily timeline limits, and available ingredients.
3. **Budget Calibration**:
   - Calculates the cost of raw ingredients scaled to family size.
   - Compares total cost against the user's spending limit.
   - If **Over Budget**, it automatically swaps premium ingredients for cheaper alternatives (e.g., *Broccoli &rarr; Cauliflower*, *Greek Yogurt &rarr; Curd*) or selects budget-friendly recipes (e.g. Lentils or soups) to trim costs.
4. **Smart Grocery Checklist**: Compiles required recipe items, filters out kitchen ingredients checked as "already at home", and groups the rest by category (Dairy, Protein, Vegetables, Grains, etc.).
5. **Timeline Scheduler**: Dynamically structures breakfast, lunch, and dinner cooking times based on the user's schedule limits (Busy, Normal, Free).

---

## 💻 Local Setup & Running

Follow these simple steps to run the application locally:

### 1. Install Dependencies
Run the install command:
```bash
npm install
```

### 2. Configure Environment Variables
Create a local `.env` file from the example:
```bash
cp .env.example .env
```

### 3. Run Development Server
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Vercel Deployment
Deploying to Vercel is seamless:
1. Push this repository to GitHub/GitLab.
2. Connect your repository to **Vercel**.
3. Vercel automatically detects Next.js configurations and builds the production bundle immediately.

---

## 🔮 Future Enhancements
- **LLM Integration**: Swap the local rules-based engine with an active OpenAI GPT-4o or Gemini 1.5 Flash API connector to allow free-form custom recipe text generation.
- **OCR Pantry Scanner**: Allow users to snap a photo of their fridge shelf to auto-fill the available ingredients list.
- **Shopping Cart Sync**: Connect the grocery list with APIs like Instacart or Amazon Fresh to purchase ingredients with a single click.

## 📄 License
This project is open-source and licensed under the MIT License.
