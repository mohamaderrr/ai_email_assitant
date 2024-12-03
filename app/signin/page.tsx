'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, action: 'signin' | 'signup') => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (action === 'signin') {
          console.log('Sign-in successful, redirecting to /email');
          router.push('/email');
        } else {
          alert('Sign up successful! Please sign in.');
        }
      } else {
        console.error(`Error during ${action}:`, data.error);
        alert(data.error || `Error during ${action}`);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      alert(`An error occurred during ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/test.jpg"
          alt="Authentication"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <Card className="w-[400px] h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in or create a new account</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Tabs defaultValue="signin" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="flex-grow flex flex-col">
                <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-8 flex flex-col flex-grow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input id="signin-password" name="password" type="password" required />
                    </div>
                  </div>
                  <div className="flex-grow"></div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="flex-grow flex flex-col">
                <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-8 flex flex-col flex-grow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" name="password" type="password" required />
                    </div>
                  </div>
                  <div className="flex-grow"></div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

