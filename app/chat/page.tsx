"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Define message type for chat
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  // State for messages and input
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages from database on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Create new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    
    // Create a placeholder for the assistant's response
    const assistantMessageId = Date.now().toString() + "-assistant";
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);
    
    try {
      // Send message to streaming API
      const response = await fetch("/api/chat/streaming", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        
        if (reader) {
          // Read the stream
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              break;
            }
            
            // Decode the chunk and append it to the assistant's message
            const chunk = new TextDecoder().decode(value);
            
            setMessages((prev) => {
              const updatedMessages = [...prev];
              const assistantMessageIndex = updatedMessages.findIndex(
                (msg) => msg.id === assistantMessageId
              );
              
              if (assistantMessageIndex !== -1) {
                updatedMessages[assistantMessageIndex] = {
                  ...updatedMessages[assistantMessageIndex],
                  content: updatedMessages[assistantMessageIndex].content + chunk,
                };
              }
              
              return updatedMessages;
            });
          }
        }
      } else {
        console.error("Failed to get streaming response from assistant");
        
        // Update the assistant message with an error
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const assistantMessageIndex = updatedMessages.findIndex(
            (msg) => msg.id === assistantMessageId
          );
          
          if (assistantMessageIndex !== -1) {
            updatedMessages[assistantMessageIndex] = {
              ...updatedMessages[assistantMessageIndex],
              content: "Sorry, I encountered an error while processing your request.",
            };
          }
          
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Update the assistant message with an error
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const assistantMessageIndex = updatedMessages.findIndex(
          (msg) => msg.id === assistantMessageId
        );
        
        if (assistantMessageIndex !== -1) {
          updatedMessages[assistantMessageIndex] = {
            ...updatedMessages[assistantMessageIndex],
            content: "Sorry, I encountered an error while processing your request.",
          };
        }
        
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-4 md:p-8">
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <span role="img" aria-label="workout" className="text-2xl">💪</span>
            Workout Buddi
          </CardTitle>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p className="text-lg mb-2">Welcome to Workout Buddi!</p>
              <p>Your AI fitness assistant powered by Llama 3.2</p>
              <p className="mt-4">Start a conversation to track your workouts and diet.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center">
                        U
                      </div>
                    ) : (
                      <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center">
                        AI
                      </div>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center">
                    AI
                  </div>
                </Avatar>
                <div className="rounded-lg p-3 bg-secondary text-secondary-foreground">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-4">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
} 