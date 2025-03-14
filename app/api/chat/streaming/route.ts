import { NextRequest } from 'next/server';
import { generateStreamingResponse, parseWorkoutInfo, parseFoodInfo } from '@/lib/ollama';
import { saveMessage, logWorkout, logFood } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Received streaming chat request:', { message });
    
    // Save the user message to the database
    const userMessageId = Date.now().toString();
    await saveMessage({
      id: userMessageId,
      role: 'user',
      content: message,
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
    
    // Create a new ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        
        // Generate a streaming response
        await generateStreamingResponse(
          message,
          undefined, // Use default system prompt
          (token) => {
            // Send each token to the client
            controller.enqueue(new TextEncoder().encode(token));
            fullResponse += token;
          }
        );
        
        // Save the complete response to the database
        const assistantMessageId = Date.now().toString() + '-assistant';
        await saveMessage({
          id: assistantMessageId,
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
        });
        
        // Close the stream
        controller.close();
      },
      cancel() {
        console.log('Stream was cancelled by the client');
      },
    });
    
    // Return the stream as the response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error in streaming chat API route:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process streaming chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const runtime = 'nodejs'; 