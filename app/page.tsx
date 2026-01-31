"use client";

import { useState, useMemo } from "react";
import { Search, DollarSign, AlertTriangle, Tag, Plus, Minus, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data type
type InventoryItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  reorderLevel: number;
  category: string;
};

// Initial mock data
const initialMockData: InventoryItem[] = [
  { id: 1, name: "Laptop Pro 15", price: 1299.99, stock: 45, reorderLevel: 20, category: "Electronics" },
  { id: 2, name: "Wireless Mouse", price: 29.99, stock: 12, reorderLevel: 15, category: "Accessories" },
  { id: 3, name: "Mechanical Keyboard", price: 149.99, stock: 8, reorderLevel: 10, category: "Accessories" },
  { id: 4, name: "4K Monitor 27\"", price: 399.99, stock: 22, reorderLevel: 15, category: "Electronics" },
  { id: 5, name: "USB-C Hub", price: 49.99, stock: 5, reorderLevel: 10, category: "Accessories" },
  { id: 6, name: "Webcam HD", price: 79.99, stock: 18, reorderLevel: 12, category: "Electronics" },
  { id: 7, name: "Desk Chair Ergonomic", price: 299.99, stock: 3, reorderLevel: 5, category: "Furniture" },
  { id: 8, name: "Standing Desk", price: 599.99, stock: 15, reorderLevel: 8, category: "Furniture" },
  { id: 9, name: "Noise Cancelling Headphones", price: 249.99, stock: 7, reorderLevel: 10, category: "Electronics" },
  { id: 10, name: "Cable Management Kit", price: 19.99, stock: 25, reorderLevel: 20, category: "Accessories" },
];

export default function Home() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return inventoryData;
    
    const query = searchQuery.toLowerCase();
    return inventoryData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
    );
  }, [searchQuery, inventoryData]);

  // Calculate metrics
  const totalValuation = useMemo(() => {
    return inventoryData.reduce((sum, item) => sum + item.price * item.stock, 0);
  }, [inventoryData]);

  const alertCount = useMemo(() => {
    return inventoryData.filter((item) => item.stock <= item.reorderLevel).length;
  }, [inventoryData]);

  const uniqueCategories = useMemo(() => {
    return new Set(inventoryData.map((item) => item.category)).size;
  }, [inventoryData]);

  // Handle opening dialog
  const handleManageClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // Handle stock update
  const updateStock = (itemId: number, amount: number) => {
    setInventoryData((prevData) =>
      prevData.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.stock + amount); // Prevent negative stock
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // Get current selected item from inventory data to reflect real-time updates
  const currentSelectedItem = useMemo(() => {
    if (!selectedItem) return null;
    return inventoryData.find((item) => item.id === selectedItem.id) || selectedItem;
  }, [selectedItem, inventoryData]);

  // Handle add stock
  const handleAddStock = () => {
    if (selectedItem) {
      updateStock(selectedItem.id, 1);
    }
  };

  // Handle remove stock
  const handleRemoveStock = () => {
    if (selectedItem) {
      updateStock(selectedItem.id, -1);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SwiftStock Dashboard</h1>
          <p className="mt-2 text-gray-600">Inventory management and monitoring</p>
        </div>

        {/* Top Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Valuation
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalValuation)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total inventory value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {alertCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Items below reorder level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Unique Categories
              </CardTitle>
              <Tag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {uniqueCategories}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, category, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorder Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No items found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const isLowStock = item.stock <= item.reorderLevel;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-gray-600">
                          #{item.id}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {item.stock}
                        </TableCell>
                        <TableCell className="text-right text-gray-600">
                          {item.reorderLevel}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-700">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {isLowStock ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageClick(item)}
                            className="gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stock Management Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Stock</DialogTitle>
              <DialogDescription>
                {currentSelectedItem && (
                  <>
                    Update stock quantity for <strong>{currentSelectedItem.name}</strong>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            {currentSelectedItem && (
              <div className="py-4">
                <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{currentSelectedItem.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Reorder Level</p>
                    <p className="text-2xl font-bold text-gray-600">{currentSelectedItem.reorderLevel}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={handleRemoveStock}
                disabled={currentSelectedItem?.stock === 0}
                className="gap-2"
              >
                <Minus className="h-4 w-4" />
                Remove Stock
              </Button>
              <Button
                onClick={handleAddStock}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
