"use client";

import { useEffect, useState } from "react";
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
import toast from "react-hot-toast";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const [globalDiscount, setGlobalDiscount] = useState({
    enabled: false,
    percentage: 0,
  });
const [action, setAction] = useState(false)
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: 0,
  });
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleGlobalDiscountChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "percentage" ? Number(value) : value;
    setGlobalDiscount((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleNewCouponChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchDiscount = async () => {
      setLoading(true);
      try {
        const discountQuery = query(
          collection(db, "globalDiscount"),
          orderBy("updatedAt", "desc"),
          limit(1)
        );
        const discountSnapshot = await getDocs(discountQuery);

        if (!discountSnapshot.empty) {
          const discountData = discountSnapshot.docs[0].data();
          setGlobalDiscount({
            enabled: discountData.enabled,
            percentage: Number(discountData.percentage),
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load global discount settings.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCoupons = async () => {
      try {
        const couponQuery = query(collection(db, "coupons"));
        const couponSnapshot = await getDocs(couponQuery);
        const couponData = couponSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCoupons(couponData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load coupons.");
      }
    };

    fetchDiscount();
    fetchCoupons();
  }, []);

  const handleGlobalDiscountSubmit = async (e) => {
    e.preventDefault();

    if (globalDiscount.percentage < 0 || globalDiscount.percentage > 100 || globalDiscount === "") {
      toast.error("Discount percentage must be between 0 and 100");
      return;
    }

    setAction(true)
    try {
      const discountRef = doc(db, "globalDiscount", "zTigBXScQrQruPiyhMk1");
      await toast.promise(
        setDoc(discountRef, {
          enabled: globalDiscount.enabled,
          percentage: Number(globalDiscount.percentage),
          updatedAt: new Date(),
        }),
        {
          loading: "Updating global discount settings...",
          success: "Global discount settings updated successfully!",
          error: "Failed to update global discount settings.",
        }
      );

      setAction(false)
    } catch (err) {
      setAction(false)
      console.error(err);
      toast.error("Failed to update global discount settings.");
    }
  };

  const handleAddOrEditCoupon = async (e) => {
    e.preventDefault();
    setError("");
 setAction(true);
    if (!newCoupon.code || !newCoupon.discount) {
      setError("Please fill in all fields for the coupon");
      return;
  }

    if (newCoupon.discount < 0 || newCoupon.discount > 100) {
      setError("Discount percentage must be between 0 and 100");
      return;
    }

    try {
      const couponRef = doc(
        db,
        "coupons",
        editingCoupon ? editingCoupon.id : newCoupon.code
      );

      await toast.promise(
        setDoc(couponRef, {
          code: newCoupon.code,
          discount: Number(newCoupon.discount),
        }),
        {
          loading: editingCoupon ? "Updating coupon..." : "Adding coupon...",
          success: editingCoupon
            ? "Coupon updated successfully!"
            : "Coupon added successfully!",
          error: "Failed to save coupon.",
        }
      );

      const couponQuery = query(collection(db, "coupons"));
      const couponSnapshot = await getDocs(couponQuery);
      const couponData = couponSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCoupons(couponData);
      setNewCoupon({ code: "", discount: 0 });
      setEditingCoupon(null);
       setAction(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save coupon");
       setAction(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setNewCoupon({ code: coupon.code, discount: coupon.discount });
    setEditingCoupon(coupon);
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const couponRef = doc(db, "coupons", id);
      await toast.promise(deleteDoc(couponRef), {
        // Use deleteDoc instead of setDoc
        loading: "Deleting coupon...",
        success: "Coupon deleted successfully!",
        error: "Failed to delete coupon.",
      });

      // Update the coupons state after deletion
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete coupon");
    }
  };

  if (loading) return <p>Loading discounts...</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 md:mt-8">Settings</h2>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Global Discount</CardTitle>
            <p className="text-xs">
              Give every product on the website a discount
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGlobalDiscountSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="discount-enabled"
                  checked={globalDiscount.enabled}
                  onCheckedChange={(checked) =>
                    setGlobalDiscount((prev) => ({ ...prev, enabled: checked }))
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
                  max="100"
                  value={globalDiscount.percentage || ""}
                  onChange={handleGlobalDiscountChange}
                  disabled={!globalDiscount.enabled}
                />
              </div>
              <Button type="submit" disabled={action}>
                Save Global Discount
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coupon Management</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrEditCoupon} className="space-y-4 mb-6">
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
                  min="1"
                  max="100"
                  value={newCoupon.discount || ''}
                  onChange={handleNewCouponChange}
                  required
                />
              </div>
              <Button type="submit" disabled={action}>
                {editingCoupon ? "Update Coupon" : "Add Coupon"}
              </Button>
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
                      <div className="space-x-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCoupon(coupon)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
