"use client";

import React from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Fuel,
   Store,
   TrendingUp,
   DollarSign,
   Users,
   AlertTriangle,
   Plus,
   BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface StatCard {
   title: string;
   value: string;
   description: string;
   icon: React.ComponentType<any>;
   trend?: string;
   trendUp?: boolean;
}

const mockStats: StatCard[] = [
   {
      title: "Today's Fuel Sales",
      value: "₹45,650",
      description: "Total fuel revenue today",
      icon: Fuel,
      trend: "+12.5%",
      trendUp: true,
   },
   {
      title: "Store Sales",
      value: "₹1,250",
      description: "Store items sold today",
      icon: Store,
      trend: "+8.2%",
      trendUp: true,
   },
   {
      title: "Total Revenue",
      value: "₹46,900",
      description: "Combined sales today",
      icon: DollarSign,
      trend: "+11.8%",
      trendUp: true,
   },
   {
      title: "Active Shifts",
      value: "2",
      description: "Currently ongoing shifts",
      icon: Users,
   },
];

const recentActivities = [
   {
      id: 1,
      type: "shift_start",
      description: "Shift 2 started by Operator John",
      time: "2 hours ago",
      status: "active",
   },
   {
      id: 2,
      type: "sale",
      description: "Store sale completed - ₹554.60",
      time: "3 hours ago",
      status: "completed",
   },
   {
      id: 3,
      type: "fuel_reading",
      description: "Pump 1 reading updated - 63.5L sold",
      time: "4 hours ago",
      status: "completed",
   },
   {
      id: 4,
      type: "price_update",
      description: "Fuel prices updated for MS",
      time: "1 day ago",
      status: "info",
   },
];

const lowStockItems = [
   { name: "Engine Oil 1L", stock: 5, minLevel: 10 },
   { name: "Coca Cola 500ml", stock: 18, minLevel: 20 },
   { name: "Lays Classic 52g", stock: 25, minLevel: 30 },
];

export function DashboardOverview() {
   const { user } = useAuth();

   return (
      <div className='space-y-6'>
         {/* Welcome Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold tracking-tight'>
                  Welcome back, {user?.full_name.split(" ")[0]}!
               </h1>
               <p className='text-muted-foreground'>
                  Here's what's happening at your station today.
               </p>
            </div>
            <div className='flex items-center space-x-2'>
               <Button>
                  <Plus className='h-4 w-4 mr-2' />
                  New Shift
               </Button>
               <Button variant='outline'>
                  <BarChart3 className='h-4 w-4 mr-2' />
                  View Reports
               </Button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {mockStats.map((stat) => {
               const Icon = stat.icon;
               return (
                  <Card key={stat.title}>
                     <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                           {stat.title}
                        </CardTitle>
                        <Icon className='h-4 w-4 text-muted-foreground' />
                     </CardHeader>
                     <CardContent>
                        <div className='text-2xl font-bold'>{stat.value}</div>
                        <p className='text-xs text-muted-foreground'>
                           {stat.description}
                        </p>
                        {stat.trend && (
                           <div className='flex items-center mt-2'>
                              <TrendingUp
                                 className={`h-3 w-3 mr-1 ${
                                    stat.trendUp
                                       ? "text-green-500"
                                       : "text-red-500"
                                 }`}
                              />
                              <span
                                 className={`text-xs ${
                                    stat.trendUp
                                       ? "text-green-600"
                                       : "text-red-600"
                                 }`}
                              >
                                 {stat.trend} from yesterday
                              </span>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {/* Recent Activities */}
            <Card className='lg:col-span-2'>
               <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                     Latest updates from your station
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className='space-y-4'>
                     {recentActivities.map((activity) => (
                        <div
                           key={activity.id}
                           className='flex items-center justify-between p-3 rounded-lg border'
                        >
                           <div className='flex-1'>
                              <p className='text-sm font-medium'>
                                 {activity.description}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                 {activity.time}
                              </p>
                           </div>
                           <Badge
                              variant={
                                 activity.status === "active"
                                    ? "default"
                                    : activity.status === "completed"
                                    ? "secondary"
                                    : "outline"
                              }
                           >
                              {activity.status}
                           </Badge>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
               <CardHeader>
                  <CardTitle className='flex items-center'>
                     <AlertTriangle className='h-4 w-4 mr-2 text-orange-500' />
                     Low Stock Alert
                  </CardTitle>
                  <CardDescription>
                     Items running low on inventory
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className='space-y-3'>
                     {lowStockItems.map((item) => (
                        <div
                           key={item.name}
                           className='flex items-center justify-between'
                        >
                           <div>
                              <p className='text-sm font-medium'>{item.name}</p>
                              <p className='text-xs text-muted-foreground'>
                                 Stock: {item.stock} (Min: {item.minLevel})
                              </p>
                           </div>
                           <Badge variant='destructive'>Low</Badge>
                        </div>
                     ))}
                  </div>
                  <Button variant='outline' className='w-full mt-4'>
                     Manage Inventory
                  </Button>
               </CardContent>
            </Card>
         </div>

         {/* Quick Actions */}
         <Card>
            <CardHeader>
               <CardTitle>Quick Actions</CardTitle>
               <CardDescription>Common tasks for your role</CardDescription>
            </CardHeader>
            <CardContent>
               <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <Button variant='outline' className='h-20 flex flex-col'>
                     <Fuel className='h-6 w-6 mb-2' />
                     Record Fuel Reading
                  </Button>
                  <Button variant='outline' className='h-20 flex flex-col'>
                     <Store className='h-6 w-6 mb-2' />
                     Store Sale
                  </Button>
                  <Button variant='outline' className='h-20 flex flex-col'>
                     <DollarSign className='h-6 w-6 mb-2' />
                     Shift Checkout
                  </Button>
                  <Button variant='outline' className='h-20 flex flex-col'>
                     <BarChart3 className='h-6 w-6 mb-2' />
                     View Reports
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
