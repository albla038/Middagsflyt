<img width="262" height="60" alt="image" src="https://github.com/user-attachments/assets/5a9c0356-0bfe-444a-a103-a9493df3bd3b" />

My project for this summer is to develop an advanced but user-friendly meal planner. The aim of this web appplication is to allow the user to

- Import recipes from Swedish recipe website URLs, as well as manually create recipes
- Display recipes in a clean and optimized UI (to be used while cooking)
- Explore all currently available recipes in a public "recipe community library"
- Bookmark recipes from the public community library
- Schedule recipes for the coming week(s) in a meal calendar
- Get smart recipe recommendations based on user-defined parameters (such as number of servings per scheduled week, dietary preferences etc.)
- Generate shopping lists from scheduled recipes
- Use a highly interactive and user-friendly shoppling list optimized for smartphones
- Sort shopping lists based on ingredient/article categories
- ... and more!

This project utilizes generative AI with structured outputs to enrich web scraped recipe data, and to generate shopping ingredient data (such as prefered shopping units, canonical names and ingredient name aliases). I plan to use AI to give the user tailored recipe recommendations, and to convert ingredient units and quantities in the shopping lists.

### Current stack

- [Next.js 15 App Router](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Prisma Postgres](https://www.prisma.io/postgresql) (planned for production)
- [Zod 4](https://zod.dev/)
- [Gemini AI API](https://ai.google.dev/)
- [Better-Auth](https://github.com/from-a-to-b/better-auth)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Cheerio](https://cheerio.js.org/)
- [TanStack Query](https://tanstack.com/query/latest) (planned)

## Figma design prototype (Recipe page)

### Desktop

<img width="1440" height="1024" alt="RecipeDesktopDesign" src="https://github.com/user-attachments/assets/03f33b36-28b8-4a47-b621-ad199d4b32e5" />

### Phone

<img width="390" height="1743" alt="RecipeMobileDesign" src="https://github.com/user-attachments/assets/d8b7ca34-980d-4154-8f6c-e6ba08d800b1" />

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
