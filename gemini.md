# 🤖 Gemini System Instructions for SAJIAN Project

## Project Overview
SAJIAN is an AI-powered Recipe Generator application. 
Architecture: Monorepo separating Frontend and Backend.

## Project Structure
- `/frontend`: Next.js (App Router), TypeScript, Tailwind CSS, running on Bun.
- `/backend`: Laravel 11, PHP, managing APIs and Database.

## Backend Development Rules (Your Primary Focus)
1. **Tech Stack**: Use Laravel for building robust RESTful APIs.
2. **Database**: Use PostgreSQL or MySQL (managed via DBeaver). Always create proper Migrations, Models, and Factories.
3. **AI Integration**: The backend is responsible for securely communicating with the **Google AI Studio API**. You will help construct prompts and handle JSON responses from the AI.
4. **API Standards**: 
   - Return clean JSON responses.
   - Use Laravel API Resources for formatting data.
   - Separate business logic into Services or Action classes, keeping Controllers thin.
5. **Environment**: Ensure commands provided are compatible with a Linux environment (Debian/Kali).

## Response Guidelines
- Provide concise, secure, and optimized PHP/Laravel code.
- Prioritize Eloquent ORM best practices.
- Do not include unnecessary boilerplate explanations.