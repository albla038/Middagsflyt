<img width="262" height="60" alt="image" src="https://github.com/user-attachments/assets/5a9c0356-0bfe-444a-a103-a9493df3bd3b" />

Middagsflyt is an ongoing passion project where I develop an advanced but user-friendly meal planner platform. The aim of this web application is to allow the user to

- Import recipes from Swedish recipe website URLs, as well as manually create recipes
- Display recipes in a clean and optimized UI (to be used while cooking)
- Explore all currently available recipes in a public "recipe community library"
- Bookmark recipes from the public community library
- Schedule recipes for the coming week(s) in a meal calendar
- Get smart recipe recommendations based on user-defined parameters (such as number of servings per scheduled week, dietary preferences etc.)
- Generate shopping lists from scheduled recipes
- Use a highly interactive and user-friendly shopping list optimized for smartphones
- Sort shopping lists based on ingredient/article categories
- ... and more!

This project utilizes generative AI with structured outputs to enrich web scraped recipe data, and to generate shopping ingredient data (such as prefered shopping units, canonical names and ingredient name aliases).

### Core stack

- [Next.js 16 App Router](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [Gemini AI API](https://ai.google.dev/)

## Figma design prototype (Recipe page)

### Desktop

<img width="1440" height="1024" alt="RecipeDesktopDesign" src="https://github.com/user-attachments/assets/03f33b36-28b8-4a47-b621-ad199d4b32e5" />

### Phone

<img width="390" height="1743" alt="RecipeMobileDesign" src="https://github.com/user-attachments/assets/d8b7ca34-980d-4154-8f6c-e6ba08d800b1" />

---

## Run Locally

1. **Clone the repository and install dependencies:**

   ```bash
   git clone https://github.com/albla038/middagsflyt.git
   cd middagsflyt
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory based on [`.env.example`](./.env.example):
   - **Database:** The `DATABASE_URL` is already pre-configured for local SQLite in the example file.
   - **Better Auth Secret:** Generate a random string for `BETTER_AUTH_SECRET` (e.g. run `openssl rand -base64 32` in your terminal).
   - **Google OAuth:** To enable Google sign-in:
     1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
     2. Configure the OAuth consent screen.
     3. Create OAuth 2.0 Client ID credentials.
     4. Add `http://localhost:3000/api/auth/callback/google` as an **Authorized redirect URI**.
     5. Copy your Client ID and Client Secret to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
   - **Gemini API:** Get your API key from [Google AI Studio](https://aistudio.google.com/).

3. **Initialize the database:**
   Sync your Prisma schema with the database:

   ```bash
   npx prisma db push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
