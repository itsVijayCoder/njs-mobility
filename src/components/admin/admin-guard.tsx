"use client";

import React, { useState } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, LogOut, AlertTriangle, User } from "lucide-react";

interface AdminGuardProps {
   children: React.ReactNode;
   fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
   const { isAdmin, user, login, logout, checkAdminAccess } = useAdmin();
   const [credentials, setCredentials] = useState({ email: "", password: "" });
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         const success = await login(credentials);
         if (!success) {
            setError("Invalid credentials. Please try again.");
         }
      } catch (err) {
         setError("Login failed. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   if (!checkAdminAccess()) {
      return (
         fallback || (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
               <Card className='w-full max-w-md shadow-xl border-2 border-red-200'>
                  <CardHeader className='text-center space-y-4'>
                     <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                        <Shield className='h-8 w-8 text-red-600' />
                     </div>
                     <div>
                        <CardTitle className='text-2xl font-bold text-red-800'>
                           Admin Access Required
                        </CardTitle>
                        <p className='text-muted-foreground mt-2'>
                           This area is restricted to authorized administrators
                           only
                        </p>
                     </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                     <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                           <AlertTriangle className='h-4 w-4 text-red-600' />
                           <span className='font-semibold text-red-800'>
                              Security Notice
                           </span>
                        </div>
                        <p className='text-sm text-red-700'>
                           Only authorized personnel with valid administrator
                           credentials can access fuel price management.
                        </p>
                     </div>

                     <form onSubmit={handleLogin} className='space-y-4'>
                        <div className='space-y-2'>
                           <Label htmlFor='email'>Administrator Email</Label>
                           <Input
                              id='email'
                              type='email'
                              placeholder='admin@njsmobility.com'
                              value={credentials.email}
                              onChange={(e) =>
                                 setCredentials((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                 }))
                              }
                              required
                           />
                        </div>

                        <div className='space-y-2'>
                           <Label htmlFor='password'>Password</Label>
                           <Input
                              id='password'
                              type='password'
                              placeholder='Enter admin password'
                              value={credentials.password}
                              onChange={(e) =>
                                 setCredentials((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                 }))
                              }
                              required
                           />
                        </div>

                        {error && (
                           <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                              <p className='text-sm text-red-700'>{error}</p>
                           </div>
                        )}

                        <Button
                           type='submit'
                           className='w-full bg-red-600 hover:bg-red-700'
                           disabled={isLoading}
                        >
                           {isLoading ? (
                              <>
                                 <Lock className='h-4 w-4 mr-2 animate-spin' />
                                 Authenticating...
                              </>
                           ) : (
                              <>
                                 <Shield className='h-4 w-4 mr-2' />
                                 Administrator Login
                              </>
                           )}
                        </Button>
                     </form>

                     <div className='text-center'>
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                           <p className='text-xs text-blue-700'>
                              <strong>Demo Credentials:</strong>
                              <br />
                              Email: admin@njsmobility.com
                              <br />
                              Password: admin123
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )
      );
   }

   return (
      <div>
         {/* Admin Header */}
         <div className='bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow-lg'>
            <div className='flex items-center justify-between max-w-7xl mx-auto'>
               <div className='flex items-center gap-3'>
                  <div className='p-2 bg-white/20 rounded-lg'>
                     <Shield className='h-5 w-5' />
                  </div>
                  <div>
                     <h2 className='font-semibold'>Administrator Panel</h2>
                     <p className='text-sm opacity-90'>
                        Authenticated as {user?.name}
                     </p>
                  </div>
               </div>
               <div className='flex items-center gap-3'>
                  <Badge
                     variant='outline'
                     className='bg-white/20 text-white border-white/30'
                  >
                     <User className='h-3 w-3 mr-1' />
                     {user?.role.toUpperCase()}
                  </Badge>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={logout}
                     className='text-white border-white/30 hover:bg-white/20'
                  >
                     <LogOut className='h-4 w-4 mr-2' />
                     Logout
                  </Button>
               </div>
            </div>
         </div>

         {/* Protected Content */}
         <div className='max-w-7xl mx-auto'>{children}</div>
      </div>
   );
}
