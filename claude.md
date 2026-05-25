# 🤖 Claude System Instructions for SAJIAN Project

## Project Overview
SAJIAN is an AI-powered Recipe Generator application. 
Architecture: Monorepo separating Frontend and Backend.

## Project Structure
- `/frontend`: Next.js (App Router), TypeScript, Tailwind CSS, running on Bun.
- `/backend`: Laravel 11, PHP, managing APIs and Database.

## Frontend Development Rules (Your Primary Focus)
1. **Tech Stack**: Use Next.js (App Router) and React functional components.
2. **Styling**: Use Tailwind CSS. The design language is **Neo-Brutalism** (high contrast, bold borders, flat shadows, vibrant colors).
3. **Package Manager**: STRICTLY use `bun` for all package installations and running scripts (e.g., `bun install`, `bun run dev`). Do NOT use `npm` or `yarn`.
4. **API Communication**: The frontend will communicate with the local Laravel backend. Always handle loading states and error boundaries gracefully.
5. **Code Quality**: Ensure strict TypeScript typing. Keep components modular and reusable in the `src/components` directory.

## Response Guidelines
- Provide direct, copy-pasteable code blocks.
- Do not explain basic React concepts unless asked.
- Always check for Tailwind class correctness for the Neo-Brutalism aesthetic.