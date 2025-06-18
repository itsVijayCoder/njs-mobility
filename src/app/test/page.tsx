"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   TestTube,
   FileSpreadsheet,
   Fuel,
   Calculator,
   Palette,
   Database,
   Bug,
   Settings,
   ArrowRight,
} from "lucide-react";
import Link from "next/link";

const testRoutes = [
   {
      title: "Shift Reading Tests",
      description:
         "Test shift reading functionality with different configurations",
      routes: [
         {
            path: "/test/test-shift",
            name: "Shift 1 Test",
            description: "Test Shift 1 with automatic pump test (5L)",
            icon: Fuel,
            color: "bg-blue-50 text-blue-700 border-blue-200",
         },
         {
            path: "/test/test-shift-2",
            name: "Shift 2 Test",
            description: "Test Shift 2 without pump test",
            icon: Fuel,
            color: "bg-green-50 text-green-700 border-green-200",
         },
      ],
   },
   {
      title: "Data Import & Parsing Tests",
      description: "Test spreadsheet data import and parsing functionality",
      routes: [
         {
            path: "/test/test-paste-functionality",
            name: "Paste Functionality",
            description: "Comprehensive paste and import testing",
            icon: FileSpreadsheet,
            color: "bg-purple-50 text-purple-700 border-purple-200",
         },
         {
            path: "/test/test-parsing",
            name: "Basic Parsing Test",
            description: "Simple parsing algorithm testing",
            icon: Calculator,
            color: "bg-orange-50 text-orange-700 border-orange-200",
         },
         {
            path: "/test/user-data-test",
            name: "User Data Test",
            description: "Test with user's exact data format",
            icon: Database,
            color: "bg-cyan-50 text-cyan-700 border-cyan-200",
         },
         {
            path: "/test/debug-parsing",
            name: "Debug Parsing",
            description: "Detailed parsing logs and debugging",
            icon: Bug,
            color: "bg-red-50 text-red-700 border-red-200",
         },
      ],
   },
   {
      title: "Fuel Price Integration Tests",
      description: "Test fuel price API integration and dynamic updates",
      routes: [
         {
            path: "/test/fuel-price-demo",
            name: "Live Price Demo",
            description: "Simulated live fuel price updates",
            icon: Settings,
            color: "bg-yellow-50 text-yellow-700 border-yellow-200",
         },
         {
            path: "/test/fuel-price-api-test",
            name: "API Integration Test",
            description: "Test /api/admin/fuel-prices endpoint",
            icon: Database,
            color: "bg-indigo-50 text-indigo-700 border-indigo-200",
         },
         {
            path: "/test/admin-fuel-price-integration",
            name: "Admin Price Integration",
            description:
               "Test real-time price propagation from admin to shift readings",
            icon: Calculator,
            color: "bg-purple-50 text-purple-700 border-purple-200",
         },
      ],
   },
   {
      title: "UI & Theme Tests",
      description: "Test UI components and theming",
      routes: [
         {
            path: "/test/theme-test",
            name: "Theme Test",
            description: "Test UI components and styling",
            icon: Palette,
            color: "bg-pink-50 text-pink-700 border-pink-200",
         },
      ],
   },
];

export default function TestIndexPage() {
   return (
      <div className='container mx-auto p-6 space-y-8'>
         <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2'>
               <TestTube className='h-8 w-8 text-blue-600' />
               <h1 className='text-3xl font-bold'>Test Suite</h1>
            </div>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
               Comprehensive testing environment for the NJS Mobility Shift
               Management System. Test all features, components, and
               integrations in a controlled environment.
            </p>
            <Badge variant='outline' className='text-green-600'>
               All Test Routes Organized & Ready
            </Badge>
         </div>

         {testRoutes.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
               <CardHeader>
                  <CardTitle className='text-xl'>{category.title}</CardTitle>
                  <p className='text-muted-foreground'>
                     {category.description}
                  </p>
               </CardHeader>
               <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                     {category.routes.map((route, routeIndex) => {
                        const IconComponent = route.icon;
                        return (
                           <Link key={routeIndex} href={route.path}>
                              <Card
                                 className={`hover:shadow-md transition-shadow cursor-pointer ${route.color}`}
                              >
                                 <CardContent className='p-4'>
                                    <div className='flex items-start gap-3'>
                                       <IconComponent className='h-5 w-5 mt-0.5 flex-shrink-0' />
                                       <div className='space-y-1 flex-1'>
                                          <div className='flex items-center justify-between'>
                                             <h3 className='font-medium'>
                                                {route.name}
                                             </h3>
                                             <ArrowRight className='h-4 w-4' />
                                          </div>
                                          <p className='text-sm opacity-80'>
                                             {route.description}
                                          </p>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>
                           </Link>
                        );
                     })}
                  </div>
               </CardContent>
            </Card>
         ))}

         <Card>
            <CardHeader>
               <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
               <Link href='/dashboard'>
                  <Button variant='outline' className='w-full'>
                     Dashboard
                  </Button>
               </Link>
               <Link href='/admin/fuel-prices'>
                  <Button variant='outline' className='w-full'>
                     Admin Panel
                  </Button>
               </Link>
               <Link href='/api/admin/fuel-prices'>
                  <Button variant='outline' className='w-full'>
                     API Endpoint
                  </Button>
               </Link>
               <Link href='/'>
                  <Button variant='outline' className='w-full'>
                     Home
                  </Button>
               </Link>
            </CardContent>
         </Card>

         <Card className='bg-gray-50'>
            <CardContent className='p-6'>
               <h3 className='font-medium mb-3'>Architecture Benefits</h3>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                     <h4 className='font-medium text-green-600'>
                        ✅ Clean Organization
                     </h4>
                     <p className='text-muted-foreground'>
                        All test routes organized under /test
                     </p>
                  </div>
                  <div>
                     <h4 className='font-medium text-green-600'>
                        ✅ Easy Navigation
                     </h4>
                     <p className='text-muted-foreground'>
                        Centralized test suite dashboard
                     </p>
                  </div>
                  <div>
                     <h4 className='font-medium text-green-600'>
                        ✅ Production Ready
                     </h4>
                     <p className='text-muted-foreground'>
                        Test routes separate from main app
                     </p>
                  </div>
                  <div>
                     <h4 className='font-medium text-green-600'>
                        ✅ Maintainable
                     </h4>
                     <p className='text-muted-foreground'>
                        Clear separation of concerns
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
