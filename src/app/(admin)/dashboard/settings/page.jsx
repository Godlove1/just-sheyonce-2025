"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SettingsPage() {
  const [globalDiscount, setGlobalDiscount] = useState({
    enabled: false,
    percentage: 0,
  });
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: 0,
  });
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SUMMER10", discount: 10 },
    { id: 2, code: "WELCOME20", discount: 20 },
  ]);
  const [error, setError] = useState("");

  const handleGlobalDiscountChange = (e) => {
    const { name, value } = e.target;
    setGlobalDiscount({ ...globalDiscount, [name]: value });
  };

  const handleNewCouponChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  const handleGlobalDiscountSubmit = (e) => {
    e.preventDefault();
    setError("");
    // Here you would typically send the global discount settings to your backend
    console.log("Global discount settings:", globalDiscount);
    alert("Global discount settings updated!");
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    setError("");

    if (!newCoupon.code || !newCoupon.discount) {
      setError("Please fill in all fields for the new coupon");
      return;
    }

    const newId = Math.max(...coupons.map((c) => c.id)) + 1;
    setCoupons([...coupons, { id: newId, ...newCoupon }]);
    setNewCoupon({ code: "", discount: 1 });
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 md:mt-8">Settings</h2>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Global Discount</CardTitle>
            <p className="text-xs">give every product on website a discount</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGlobalDiscountSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="discount-enabled"
                  checked={globalDiscount.enabled}
                  onCheckedChange={(checked) =>
                    setGlobalDiscount({ ...globalDiscount, enabled: checked })
                  }
                />
                <Label htmlFor="discount-enabled">Enable global discount</Label>
              </div>
              <div>
                <Label htmlFor="discount-percentage">Discount Percentage</Label>
                <Input
                  id="discount-percentage"
                  name="percentage"
                  type="number"
                  min="1"
                  value={globalDiscount.percentage}
                  onChange={handleGlobalDiscountChange}
                  disabled={!globalDiscount.enabled}
                />
              </div>
              <Button type="submit" disabled={!globalDiscount.enabled}>
                Save Global Discount
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coupon Management</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCoupon} className="space-y-4 mb-6">
              <div>
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <Input
                  id="coupon-code"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleNewCouponChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coupon-discount">Discount Percentage</Label>
                <Input
                  id="coupon-discount"
                  name="discount"
                  type="number"
                  value={newCoupon.discount}
                  onChange={handleNewCouponChange}
                  required
                />
              </div>
              <Button type="submit">Add Coupon</Button>
            </form>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.discount}%</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card> */}
      </div>
    </>
  );
}
