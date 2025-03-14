import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-5xl mr-2" role="img" aria-label="workout">💪</span>
          Workout Buddi
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Your AI fitness assistant powered by Llama 3.2
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Workouts</CardTitle>
              <CardDescription>
                Log your exercises and get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Workout Buddi helps you keep track of your fitness journey with
                easy-to-use workout logging tools. Get insights on your progress
                and suggestions for improvement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitor Your Diet</CardTitle>
              <CardDescription>
                Log your meals and track your nutrition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Keep track of your daily food intake and get nutritional insights.
                Workout Buddi helps you maintain a balanced diet to complement
                your fitness goals.
              </p>
            </CardContent>
          </Card>
        </div>

        <Link href="/chat" className="mt-8">
          <Button size="lg" className="text-lg px-8">
            Start Chatting Now
          </Button>
        </Link>

        <p className="text-sm text-muted-foreground mt-8">
          Powered by Next.js, Llama 3.2, and SQLite
        </p>
      </main>
    </div>
  );
}
