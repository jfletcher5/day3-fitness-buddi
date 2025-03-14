# Workout Agent App Setup Guide

## Notes

- Use root layout for overall application structure.
- Utilize Shadcn/UI components for consistent and responsive UI.
- Write clear and detailed code comments.
- Ask questions if additional clarity is needed.

## Cursor IDE Instructions

Implement the project clearly in the defined phases listed below. Ensure each phase is fully functional before proceeding.

## Project Overview

Create a locally running Next.js web application (React 18) featuring an interactive workout assistant called "Workout Buddi." The app will utilize a local SQLite database to store conversation history and include a chat interface powered by a locally running Llama 3.2 model via Ollama. The agent will provide tools to log workout exercises and food intake.

## Project Phases

### Phase 1: UI Setup

- Use Shadcn/UI components for styling.
- Develop a responsive chat interface (`/app/chat/page.tsx`) with clear differentiation between user and agent messages.

### Phase 2: Local LLM Integration

- Connect the chat interface to a locally running Llama 3.2 model using Ollama.
- Implement streaming chat responses.
- Include detailed logging in the console for requests, responses, and interactions.

### Phase 3: SQLite Database Integration

- Set up a local SQLite database within the project (simple integration).
- Store and retrieve conversation messages from the SQLite database.

## Project Architecture

- **Frontend:** Next.js (React 18), Shadcn/UI
- **Database:** SQLite (local)
- **LLM Service:** Ollama (Llama 3.2)

## Libraries & Dependencies

- Next.js
- React 18
- Shadcn/UI
- SQLite
- Ollama (Llama 3.2)

## SQLite Schema

- **Conversations:**
  - id (Primary Key)
  - timestamp (Datetime)
  - user_message (Text)
  - agent_response (Text)

## Goals

- Interactive, responsive UI
- Local data persistence
- Efficient local LLM integration
- Clearly structured and maintainable code
- Detailed logging for easy debugging
