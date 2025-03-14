import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching messages from database');
    
    // Get all messages from the database
    const messages = await getMessages();
    
    console.log(`Retrieved ${messages.length} messages`);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 