"use client";

import React, { useState } from "react";
import { Plus, Filter, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-store";
import { Product } from "@/types/store";
import Link from "next/link";

export default function StorePage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("all");

   const { data: products = [], isLoading, error } = useProducts();

   const filteredProducts = products.filter((product: Product) => {
      const matchesSearch =
         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
         categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
   });

   const lowStockProducts = products.filter(
      (product: Product) => product.stock_quantity <= product.min_stock_level
   );

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "INR",
      }).format(amount);
   };

   const getStockStatus = (product: Product) => {
      if (product.stock_quantity === 0) {
         return <Badge variant='destructive'>Out of Stock</Badge>;
      } else if (product.stock_quantity <= product.min_stock_level) {
         return <Badge variant='secondary'>Low Stock</Badge>;
      }
      return <Badge variant='outline'>In Stock</Badge>;
   };

   if (isLoading) {
      return (
         <div className='space-y-4'>
            <div className='h-8 bg-muted animate-pulse rounded'></div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
               {[...Array(6)].map((_, i) => (
                  <div
                     key={i}
                     className='h-48 bg-muted animate-pulse rounded'
                  ></div>
               ))}
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='text-center text-red-600'>
            Error loading products: {error.message}
         </div>
      );
   }

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold tracking-tight'>
                  Store Management
               </h1>
               <p className='text-muted-foreground'>
                  Manage inventory and process store sales
               </p>
            </div>
            <div className='flex items-center space-x-2'>
               <Link href='/dashboard/store/sale'>
                  <Button>
                     <ShoppingCart className='h-4 w-4 mr-2' />
                     New Sale
                  </Button>
               </Link>
               <Link href='/dashboard/store/products/new'>
                  <Button variant='outline'>
                     <Plus className='h-4 w-4 mr-2' />
                     Add Product
                  </Button>
               </Link>
            </div>
         </div>

         {/* Low Stock Alert */}
         {lowStockProducts.length > 0 && (
            <Card className='border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950'>
               <CardHeader>
                  <CardTitle className='text-orange-800 dark:text-orange-200'>
                     Low Stock Alert
                  </CardTitle>
                  <CardDescription className='text-orange-700 dark:text-orange-300'>
                     {lowStockProducts.length} products are running low on stock
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-3'>
                     {lowStockProducts.slice(0, 6).map((product: Product) => (
                        <div key={product.id} className='text-sm'>
                           <span className='font-medium'>{product.name}</span>
                           <span className='text-orange-600 dark:text-orange-400 ml-2'>
                              ({product.stock_quantity} left)
                           </span>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Search and Filters */}
         <Card>
            <CardHeader>
               <CardTitle className='text-lg flex items-center'>
                  <Filter className='h-4 w-4 mr-2' />
                  Search & Filter
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className='flex gap-4'>
                  <div className='flex-1 relative'>
                     <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                     <Input
                        placeholder='Search by name or barcode...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pl-8'
                     />
                  </div>
                  <Select
                     value={categoryFilter}
                     onValueChange={setCategoryFilter}
                  >
                     <SelectTrigger className='w-48'>
                        <SelectValue placeholder='Filter by category' />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value='all'>All Categories</SelectItem>
                        <SelectItem value='beverage'>Beverages</SelectItem>
                        <SelectItem value='snacks'>Snacks</SelectItem>
                        <SelectItem value='automotive'>Automotive</SelectItem>
                        <SelectItem value='tobacco'>Tobacco</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </CardContent>
         </Card>

         {/* Products Grid */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredProducts.map((product: Product) => (
               <Card
                  key={product.id}
                  className='hover:shadow-md transition-shadow'
               >
                  <CardHeader className='pb-3'>
                     <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                           <CardTitle className='text-base'>
                              {product.name}
                           </CardTitle>
                           {product.barcode && (
                              <CardDescription className='text-xs'>
                                 {product.barcode}
                              </CardDescription>
                           )}
                        </div>
                        {getStockStatus(product)}
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                           <span className='text-muted-foreground'>Price:</span>
                           <span className='font-medium'>
                              {formatCurrency(product.price)}
                           </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                           <span className='text-muted-foreground'>Stock:</span>
                           <span
                              className={`font-medium ${
                                 product.stock_quantity <=
                                 product.min_stock_level
                                    ? "text-red-600"
                                    : "text-green-600"
                              }`}
                           >
                              {product.stock_quantity} {product.unit}
                           </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                           <span className='text-muted-foreground'>
                              Category:
                           </span>
                           <Badge variant='outline' className='text-xs'>
                              {product.category}
                           </Badge>
                        </div>
                     </div>

                     <div className='flex space-x-2 mt-4'>
                        <Link
                           href={`/dashboard/store/products/${product.id}`}
                           className='flex-1'
                        >
                           <Button
                              variant='outline'
                              size='sm'
                              className='w-full'
                           >
                              Edit
                           </Button>
                        </Link>
                        <Button
                           size='sm'
                           className='flex-1'
                           disabled={product.stock_quantity === 0}
                        >
                           Add to Sale
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {filteredProducts.length === 0 && (
            <Card>
               <CardContent className='flex flex-col items-center justify-center py-12'>
                  <div className='text-center'>
                     <h3 className='text-lg font-medium mb-2'>
                        No products found
                     </h3>
                     <p className='text-muted-foreground mb-4'>
                        {searchTerm || categoryFilter
                           ? "Try adjusting your search or filters"
                           : "Get started by adding your first product"}
                     </p>
                     {!searchTerm && !categoryFilter && (
                        <Link href='/dashboard/store/products/new'>
                           <Button>
                              <Plus className='h-4 w-4 mr-2' />
                              Add First Product
                           </Button>
                        </Link>
                     )}
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
