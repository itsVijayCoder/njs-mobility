"use client";

import React, { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   BarChart3,
   Download,
   Calendar,
   TrendingUp,
   Fuel,
   Store,
   DollarSign,
   FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
   const [dateRange, setDateRange] = useState({
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
   });

   const [reportType, setReportType] = useState("daily");

   const mockDailyData = {
      totalRevenue: 46900,
      fuelSales: 45650,
      storeSales: 1250,
      totalLitres: 200.5,
      variance: 0,
      transactions: 45,
      fuelBreakdown: {
         ms: { litres: 145.75, revenue: 15340.125 },
         hsd: { litres: 54.75, revenue: 4913.8125 },
      },
      paymentBreakdown: {
         cash: 25400,
         card: 12500,
         upi: 9000,
      },
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
      }).format(amount);
   };

   const StatCard = ({
      title,
      value,
      icon: Icon,
      trend,
      className = "",
   }: any) => (
      <Card className={className}>
         <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{title}</CardTitle>
            <Icon className='h-4 w-4 text-muted-foreground' />
         </CardHeader>
         <CardContent>
            <div className='text-2xl font-bold'>{value}</div>
            {trend && (
               <div className='flex items-center mt-2'>
                  <TrendingUp className='h-3 w-3 mr-1 text-green-500' />
                  <span className='text-xs text-green-600'>{trend}</span>
               </div>
            )}
         </CardContent>
      </Card>
   );

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold tracking-tight'>
                  Reports & Analytics
               </h1>
               <p className='text-muted-foreground'>
                  Comprehensive insights into your station's performance
               </p>
            </div>
            <Button>
               <Download className='h-4 w-4 mr-2' />
               Export Report
            </Button>
         </div>

         {/* Date Range and Report Type */}
         <Card>
            <CardHeader>
               <CardTitle className='flex items-center'>
                  <Calendar className='h-4 w-4 mr-2' />
                  Report Configuration
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className='grid gap-4 md:grid-cols-4'>
                  <div className='space-y-2'>
                     <Label>Report Type</Label>
                     <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='daily'>Daily Report</SelectItem>
                           <SelectItem value='weekly'>Weekly Report</SelectItem>
                           <SelectItem value='monthly'>
                              Monthly Report
                           </SelectItem>
                           <SelectItem value='custom'>Custom Range</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className='space-y-2'>
                     <Label>From Date</Label>
                     <Input
                        type='date'
                        value={dateRange.from}
                        onChange={(e) =>
                           setDateRange((prev) => ({
                              ...prev,
                              from: e.target.value,
                           }))
                        }
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label>To Date</Label>
                     <Input
                        type='date'
                        value={dateRange.to}
                        onChange={(e) =>
                           setDateRange((prev) => ({
                              ...prev,
                              to: e.target.value,
                           }))
                        }
                     />
                  </div>
                  <div className='flex items-end'>
                     <Button className='w-full'>
                        <BarChart3 className='h-4 w-4 mr-2' />
                        Generate Report
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Summary Stats */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <StatCard
               title='Total Revenue'
               value={formatCurrency(mockDailyData.totalRevenue)}
               icon={DollarSign}
               trend='+12.5% from yesterday'
            />
            <StatCard
               title='Fuel Sales'
               value={formatCurrency(mockDailyData.fuelSales)}
               icon={Fuel}
               trend='+8.3% from yesterday'
            />
            <StatCard
               title='Store Sales'
               value={formatCurrency(mockDailyData.storeSales)}
               icon={Store}
               trend='+15.2% from yesterday'
            />
            <StatCard
               title='Transactions'
               value={mockDailyData.transactions.toString()}
               icon={FileText}
               trend='+5.8% from yesterday'
            />
         </div>

         {/* Detailed Reports */}
         <Tabs defaultValue='fuel' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-4'>
               <TabsTrigger value='fuel'>Fuel Sales</TabsTrigger>
               <TabsTrigger value='store'>Store Sales</TabsTrigger>
               <TabsTrigger value='payments'>Payments</TabsTrigger>
               <TabsTrigger value='performance'>Performance</TabsTrigger>
            </TabsList>

            <TabsContent value='fuel' className='space-y-4'>
               <div className='grid gap-4 md:grid-cols-2'>
                  <Card>
                     <CardHeader>
                        <CardTitle>Fuel Type Breakdown</CardTitle>
                        <CardDescription>
                           Sales by fuel type for selected period
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className='space-y-4'>
                           <div className='flex items-center justify-between p-3 rounded-lg border'>
                              <div>
                                 <div className='font-medium'>
                                    Motor Spirit (MS)
                                 </div>
                                 <div className='text-sm text-muted-foreground'>
                                    {mockDailyData.fuelBreakdown.ms.litres}L
                                    sold
                                 </div>
                              </div>
                              <div className='text-right'>
                                 <div className='font-medium'>
                                    {formatCurrency(
                                       mockDailyData.fuelBreakdown.ms.revenue
                                    )}
                                 </div>
                                 <Badge variant='secondary'>73% of total</Badge>
                              </div>
                           </div>
                           <div className='flex items-center justify-between p-3 rounded-lg border'>
                              <div>
                                 <div className='font-medium'>
                                    High Speed Diesel (HSD)
                                 </div>
                                 <div className='text-sm text-muted-foreground'>
                                    {mockDailyData.fuelBreakdown.hsd.litres}L
                                    sold
                                 </div>
                              </div>
                              <div className='text-right'>
                                 <div className='font-medium'>
                                    {formatCurrency(
                                       mockDailyData.fuelBreakdown.hsd.revenue
                                    )}
                                 </div>
                                 <Badge variant='secondary'>27% of total</Badge>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Pump Performance</CardTitle>
                        <CardDescription>
                           Individual pump sales data
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className='space-y-3'>
                           {[
                              {
                                 name: "Pump 1 - MS",
                                 litres: 63.5,
                                 revenue: 6683.375,
                              },
                              {
                                 name: "Pump 2 - MS",
                                 litres: 82.25,
                                 revenue: 8656.8125,
                              },
                              {
                                 name: "Pump 3 - HSD",
                                 litres: 54.75,
                                 revenue: 4913.8125,
                              },
                           ].map((pump, index) => (
                              <div
                                 key={index}
                                 className='flex items-center justify-between text-sm'
                              >
                                 <span className='font-medium'>
                                    {pump.name}
                                 </span>
                                 <div className='text-right'>
                                    <div>{pump.litres}L</div>
                                    <div className='text-muted-foreground'>
                                       {formatCurrency(pump.revenue)}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value='store' className='space-y-4'>
               <div className='grid gap-4 md:grid-cols-2'>
                  <Card>
                     <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>
                           Best performing store items
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className='space-y-3'>
                           {[
                              {
                                 name: "Engine Oil 1L",
                                 sales: 450,
                                 quantity: 1,
                              },
                              {
                                 name: "Coca Cola 500ml",
                                 sales: 50,
                                 quantity: 2,
                              },
                              {
                                 name: "Lays Classic 52g",
                                 sales: 40,
                                 quantity: 2,
                              },
                           ].map((product, index) => (
                              <div
                                 key={index}
                                 className='flex items-center justify-between'
                              >
                                 <div>
                                    <div className='font-medium'>
                                       {product.name}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                       {product.quantity} units sold
                                    </div>
                                 </div>
                                 <div className='font-medium'>
                                    {formatCurrency(product.sales)}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Store Performance</CardTitle>
                        <CardDescription>Store sales metrics</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className='space-y-4'>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Total Sales:
                              </span>
                              <span className='font-medium'>
                                 {formatCurrency(mockDailyData.storeSales)}
                              </span>
                           </div>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Avg. Transaction:
                              </span>
                              <span className='font-medium'>
                                 {formatCurrency(327.7)}
                              </span>
                           </div>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Margin:
                              </span>
                              <span className='font-medium text-green-600'>
                                 28.5%
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value='payments' className='space-y-4'>
               <Card>
                  <CardHeader>
                     <CardTitle>Payment Mode Analysis</CardTitle>
                     <CardDescription>
                        Breakdown of payment methods used
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className='grid gap-4 md:grid-cols-3'>
                        {Object.entries(mockDailyData.paymentBreakdown).map(
                           ([mode, amount]) => (
                              <div
                                 key={mode}
                                 className='text-center p-4 rounded-lg border'
                              >
                                 <div className='text-2xl font-bold mb-2'>
                                    {formatCurrency(amount as number)}
                                 </div>
                                 <div className='text-sm text-muted-foreground capitalize'>
                                    {mode} Payments
                                 </div>
                                 <div className='text-xs text-muted-foreground mt-1'>
                                    {Math.round(
                                       ((amount as number) /
                                          mockDailyData.totalRevenue) *
                                          100
                                    )}
                                    % of total
                                 </div>
                              </div>
                           )
                        )}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value='performance' className='space-y-4'>
               <div className='grid gap-4 md:grid-cols-2'>
                  <Card>
                     <CardHeader>
                        <CardTitle>Daily Trends</CardTitle>
                        <CardDescription>
                           Performance over the last 7 days
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className='text-center text-muted-foreground'>
                           <BarChart3 className='h-12 w-12 mx-auto mb-2' />
                           <p>Chart visualization would go here</p>
                           <p className='text-xs'>
                              Integration with charts library needed
                           </p>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                        <CardDescription>
                           Important performance indicators
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className='space-y-4'>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Fuel Efficiency:
                              </span>
                              <Badge variant='outline'>98.5%</Badge>
                           </div>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Cash Variance:
                              </span>
                              <Badge variant='secondary'>₹0.00</Badge>
                           </div>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Store Margin:
                              </span>
                              <Badge variant='outline'>28.5%</Badge>
                           </div>
                           <div className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                 Customer Satisfaction:
                              </span>
                              <Badge variant='default'>4.8/5</Badge>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
