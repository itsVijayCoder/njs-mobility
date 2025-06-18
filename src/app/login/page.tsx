"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Fuel } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
   const [credentials, setCredentials] = useState({
      email: "",
      password: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const { login } = useAuth();
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         await login(credentials);
         toast.success("Login successful");
         router.push("/dashboard");
      } catch (error) {
         toast.error("Invalid credentials");
      } finally {
         setIsLoading(false);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
         <Card className='w-full max-w-md'>
            <CardHeader className='space-y-1 text-center'>
               <div className='flex justify-center mb-4'>
                  <div className='h-12 w-12 rounded-lg bg-primary flex items-center justify-center'>
                     <Fuel className='h-6 w-6 text-primary-foreground' />
                  </div>
               </div>
               <CardTitle className='text-2xl font-bold'>
                  NJS Mobility
               </CardTitle>
               <CardDescription>
                  Sign in to your petrol management dashboard
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                     <Label htmlFor='email'>Email</Label>
                     <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='Enter your email'
                        value={credentials.email}
                        onChange={handleInputChange}
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='password'>Password</Label>
                     <Input
                        id='password'
                        name='password'
                        type='password'
                        placeholder='Enter your password'
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                     />
                  </div>
                  <Button type='submit' className='w-full' disabled={isLoading}>
                     {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
               </form>

               <div className='mt-6 p-4 bg-muted rounded-lg'>
                  <p className='text-sm font-medium mb-2'>Demo Credentials:</p>
                  <div className='text-xs space-y-1'>
                     <p>
                        <strong>Admin:</strong> admin@njsmobility.com
                     </p>
                     <p>
                        <strong>Manager:</strong> manager@njsmobility.com
                     </p>
                     <p>
                        <strong>Operator:</strong> operator1@njsmobility.com
                     </p>
                     <p className='mt-2'>
                        <strong>Password:</strong> Any password
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
