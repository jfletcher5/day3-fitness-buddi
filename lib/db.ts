import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { join } from 'path';

// Database singleton to ensure we only open one connection
let db: Database | null = null;

/**
 * Initialize the database connection
 * @returns A promise that resolves to the database connection
 */
export async function getDb(): Promise<Database> {
  if (db) return db;
  
  // Open the database connection
  db = await open({
    filename: join(process.cwd(), 'workout-buddi.db'),
    driver: sqlite3.Database,
  });
  
  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exercise TEXT NOT NULL,
      sets INTEGER,
      reps INTEGER,
      weight REAL,
      duration TEXT,
      timestamp TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS food_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories INTEGER,
      protein REAL,
      carbs REAL,
      fat REAL,
      timestamp TEXT NOT NULL
    );
  `);
  
  return db;
}

/**
 * Save a message to the database
 */
export async function saveMessage(message: {
  id: string;
  role: string;
  content: string;
  timestamp: Date;
}) {
  const db = await getDb();
  
  await db.run(
    `INSERT INTO messages (id, role, content, timestamp) VALUES (?, ?, ?, ?)`,
    [
      message.id,
      message.role,
      message.content,
      message.timestamp.toISOString(),
    ]
  );
}

/**
 * Get all messages from the database
 */
export async function getMessages() {
  const db = await getDb();
  
  const messages = await db.all(`SELECT * FROM messages ORDER BY timestamp ASC`);
  
  return messages.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }));
}

/**
 * Log a workout in the database
 */
export async function logWorkout(workout: {
  id: string;
  user_id: string;
  exercise: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: string;
  timestamp: Date;
}) {
  const db = await getDb();
  
  await db.run(
    `INSERT INTO workouts (id, user_id, exercise, sets, reps, weight, duration, timestamp) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      workout.id,
      workout.user_id,
      workout.exercise,
      workout.sets || null,
      workout.reps || null,
      workout.weight || null,
      workout.duration || null,
      workout.timestamp.toISOString(),
    ]
  );
}

/**
 * Log food intake in the database
 */
export async function logFood(food: {
  id: string;
  user_id: string;
  food_name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: Date;
}) {
  const db = await getDb();
  
  await db.run(
    `INSERT INTO food_logs (id, user_id, food_name, calories, protein, carbs, fat, timestamp) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      food.id,
      food.user_id,
      food.food_name,
      food.calories || null,
      food.protein || null,
      food.carbs || null,
      food.fat || null,
      food.timestamp.toISOString(),
    ]
  );
} 