import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TestTube } from "lucide-react";
import Link from "next/link";

export default function TestLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className='min-h-screen bg-gray-50'>
         {/* Test Environment Header */}
         <div className='bg-blue-600 text-white p-4'>
            <div className='container mx-auto flex items-center justify-between'>
               <div className='flex items-center gap-3'>
                  <TestTube className='h-6 w-6' />
                  <div>
                     <h1 className='text-lg font-semibold'>Test Environment</h1>
                     <p className='text-blue-100 text-sm'>
                        NJS Mobility Shift Management System
                     </p>
                  </div>
               </div>
               <div className='flex items-center gap-2'>
                  <Link href='/test'>
                     <Button variant='secondary' size='sm'>
                        Test Suite
                     </Button>
                  </Link>
                  <Link href='/dashboard'>
                     <Button
                        variant='ghost'
                        size='sm'
                        className='text-white hover:bg-blue-700'
                     >
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to App
                     </Button>
                  </Link>
               </div>
            </div>
         </div>

         {/* Test Content */}
         <div className='py-6'>{children}</div>

         {/* Test Environment Footer */}
         <div className='bg-gray-100 border-t p-4 mt-8'>
            <div className='container mx-auto text-center text-sm text-muted-foreground'>
               <p>
                  🧪 Test Environment - All features are safe to test without
                  affecting production data
               </p>
            </div>
         </div>
      </div>
   );
}
