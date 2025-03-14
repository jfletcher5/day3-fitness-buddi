import axios from 'axios';

// Define the base URL for Ollama API
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL_NAME = 'llama3.2';

// Define types for Ollama API
interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  response: string;
  context: number[];
  done: boolean;
}

/**
 * Generate a response from the Llama 3.2 model
 * @param prompt The user's message
 * @param systemPrompt Optional system prompt to guide the model
 * @returns The model's response
 */
export async function generateResponse(
  prompt: string,
  systemPrompt: string = 'You are Workout Buddi, an AI fitness assistant. You help users track their workouts and diet. You provide motivational advice and fitness tips. You can log workouts and food intake when users mention them.'
): Promise<string> {
  console.log('Sending request to Ollama:', { prompt, systemPrompt });
  
  try {
    const response = await axios.post<OllamaGenerateResponse>(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: MODEL_NAME,
        prompt,
        system: systemPrompt,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      } as OllamaGenerateRequest
    );
    
    console.log('Received response from Ollama:', response.data.response);
    
    return response.data.response;
  } catch (error) {
    console.error('Error generating response from Ollama:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    
    throw new Error('Failed to generate response from Llama 3.2');
  }
}

/**
 * Generate a streaming response from the Llama 3.2 model
 * @param prompt The user's message
 * @param systemPrompt Optional system prompt to guide the model
 * @param onToken Callback function to handle each token as it's generated
 */
export async function generateStreamingResponse(
  prompt: string,
  systemPrompt: string = 'You are Workout Buddi, an AI fitness assistant. You help users track their workouts and diet. You provide motivational advice and fitness tips. You can log workouts and food intake when users mention them.',
  onToken: (token: string) => void
): Promise<void> {
  console.log('Sending streaming request to Ollama:', { prompt, systemPrompt });
  
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: MODEL_NAME,
        prompt,
        system: systemPrompt,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      } as OllamaGenerateRequest,
      {
        responseType: 'stream',
      }
    );
    
    // Process the streaming response
    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line) as OllamaGenerateResponse;
          onToken(data.response);
        } catch (error) {
          console.error('Error parsing JSON from stream:', error);
        }
      }
    });
    
    // Handle the end of the stream
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log('Streaming response completed');
        resolve();
      });
      
      response.data.on('error', (error: Error) => {
        console.error('Error in streaming response:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error generating streaming response from Ollama:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    
    throw new Error('Failed to generate streaming response from Llama 3.2');
  }
}

/**
 * Parse workout information from the model's response
 * @param text The model's response text
 * @returns Workout information if found, null otherwise
 */
export function parseWorkoutInfo(text: string) {
  // Simple regex to extract workout information
  // This could be improved with more sophisticated parsing
  const workoutMatch = text.match(/workout:?\s*([^,\.]+)/i);
  const setsMatch = text.match(/sets:?\s*(\d+)/i);
  const repsMatch = text.match(/reps:?\s*(\d+)/i);
  const weightMatch = text.match(/weight:?\s*(\d+(?:\.\d+)?)\s*(kg|lbs?)?/i);
  
  if (workoutMatch) {
    return {
      exercise: workoutMatch[1].trim(),
      sets: setsMatch ? parseInt(setsMatch[1]) : undefined,
      reps: repsMatch ? parseInt(repsMatch[1]) : undefined,
      weight: weightMatch ? parseFloat(weightMatch[1]) : undefined,
      weightUnit: weightMatch && weightMatch[2] ? weightMatch[2].toLowerCase() : undefined,
    };
  }
  
  return null;
}

/**
 * Parse food information from the model's response
 * @param text The model's response text
 * @returns Food information if found, null otherwise
 */
export function parseFoodInfo(text: string) {
  // Simple regex to extract food information
  const foodMatch = text.match(/food:?\s*([^,\.]+)/i);
  const caloriesMatch = text.match(/calories:?\s*(\d+)/i);
  const proteinMatch = text.match(/protein:?\s*(\d+(?:\.\d+)?)\s*g?/i);
  const carbsMatch = text.match(/carbs:?\s*(\d+(?:\.\d+)?)\s*g?/i);
  const fatMatch = text.match(/fat:?\s*(\d+(?:\.\d+)?)\s*g?/i);
  
  if (foodMatch) {
    return {
      food_name: foodMatch[1].trim(),
      calories: caloriesMatch ? parseInt(caloriesMatch[1]) : undefined,
      protein: proteinMatch ? parseFloat(proteinMatch[1]) : undefined,
      carbs: carbsMatch ? parseFloat(carbsMatch[1]) : undefined,
      fat: fatMatch ? parseFloat(fatMatch[1]) : undefined,
    };
  }
  
  return null;
} 