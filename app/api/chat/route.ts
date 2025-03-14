import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, parseWorkoutInfo, parseFoodInfo } from '@/lib/ollama';
import { saveMessage, logWorkout, logFood } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    console.log('Received chat request:', { message });
    
    // Generate a response from the model
    const response = await generateResponse(message);
    
    // Save the user message to the database
    const userMessageId = Date.now().toString();
    await saveMessage({
      id: userMessageId,
      role: 'user',
      content: message,
      timestamp: new Date(),
    });
    
    // Save the assistant message to the database
    const assistantMessageId = Date.now().toString() + '-assistant';
    await saveMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });
    
    // Check if the message contains workout information
    const workoutInfo = parseWorkoutInfo(message);
    if (workoutInfo) {
      console.log('Detected workout information:', workoutInfo);
      
      // Log the workout
      await logWorkout({
        id: Date.now().toString() + '-workout',
        user_id: 'default-user', // In a real app, this would be the user's ID
        exercise: workoutInfo.exercise,
        sets: workoutInfo.sets,
        reps: workoutInfo.reps,
        weight: workoutInfo.weight,
        timestamp: new Date(),
      });
    }
    
    // Check if the message contains food information
    const foodInfo = parseFoodInfo(message);
    if (foodInfo) {
      console.log('Detected food information:', foodInfo);
      
      // Log the food
      await logFood({
        id: Date.now().toString() + '-food',
        user_id: 'default-user', // In a real app, this would be the user's ID
        food_name: foodInfo.food_name,
        calories: foodInfo.calories,
        protein: foodInfo.protein,
        carbs: foodInfo.carbs,
        fat: foodInfo.fat,
        timestamp: new Date(),
      });
    }
    
    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Error in chat API route:', error);
    
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// For streaming responses (to be implemented in a future update)
export const runtime = 'nodejs'; 