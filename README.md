# Workout Buddi

Workout Buddi is an interactive fitness assistant powered by Llama 3.2, designed to help you track your workouts and diet. The application runs locally and uses a SQLite database to store conversation history.

## Features

- Interactive chat interface with Llama 3.2 AI model
- Real-time streaming responses
- Workout tracking
- Food intake logging
- Local data storage with SQLite

## Tech Stack

- **Frontend**: Next.js (React 18), Shadcn/UI
- **Database**: SQLite
- **LLM Service**: Ollama (Llama 3.2)

## Prerequisites

Before running the application, make sure you have the following installed:

1. Node.js (v18 or higher)
2. npm or yarn
3. [Ollama](https://ollama.ai/) with Llama 3.2 model

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd workout-buddi
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Make sure Ollama is running with Llama 3.2 model:

```bash
ollama run llama3.2
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Next.js app directory
  - `page.tsx`: Home page
  - `chat/`: Chat interface
  - `api/`: API routes
- `components/`: UI components
- `lib/`: Utility functions
  - `db.ts`: Database utilities
  - `ollama.ts`: Ollama client

## Database Schema

The application uses a SQLite database with the following tables:

### Messages

- `id`: Primary key
- `role`: User or assistant
- `content`: Message content
- `timestamp`: Message timestamp

### Workouts

- `id`: Primary key
- `user_id`: User identifier
- `exercise`: Exercise name
- `sets`: Number of sets
- `reps`: Number of repetitions
- `weight`: Weight used
- `duration`: Exercise duration
- `timestamp`: Workout timestamp

### Food Logs

- `id`: Primary key
- `user_id`: User identifier
- `food_name`: Food name
- `calories`: Calorie count
- `protein`: Protein content (g)
- `carbs`: Carbohydrate content (g)
- `fat`: Fat content (g)
- `timestamp`: Food log timestamp

## Usage

1. Visit the home page at [http://localhost:3000](http://localhost:3000)
2. Click on "Start Chatting Now" to open the chat interface
3. Chat with Workout Buddi to track your workouts and diet
4. Example prompts:
   - "I just did 3 sets of 10 push-ups"
   - "I had a chicken salad for lunch with about 30g of protein"
   - "What's a good workout for my legs?"
   - "Can you suggest a high-protein breakfast?"

## License

This project is licensed under the MIT License. 