"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import toast from "react-hot-toast";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { adminUser, setAdminUser } = useStore();
  const [action, setAction] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    password: "",
    instagram: "",
    snapchat: "",
    facebook: "",
    twitter: "",
    whatsapp: "",
    phone: "",
    address: "",
  });

  // Load user data when component mounts
  useEffect(() => {
    if (adminUser) {
      setProfile({
        username: adminUser.username || "",
        email: adminUser.email || "",
        password: adminUser.password || "",
        instagram: adminUser.instagram || "",
        snapchat: adminUser.snapchat || "",
        facebook: adminUser.facebook || "",
        twitter: adminUser.twitter || "",
        whatsapp: adminUser.whatsapp || "",
        phone: adminUser.phone || "",
        address: adminUser.address || "",
      });
    }
  }, [adminUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminUser?.id) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    setAction(true);

    try {
      const userRef = doc(db, "adminUser", adminUser?.id);

      const updatedProfile = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };

      await toast.promise(updateDoc(userRef, updatedProfile), {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile.",
      });

      // Update the Zustand store with the new profile data
      setAdminUser({
        ...adminUser,
        ...updatedProfile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setAction(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-3 -mt-2 md:mt-8">Profile</h2>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="">
            <div className="wrapper_lg w-full flex justify-center items-center mb-8">
              <div className="inner_lg w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profile.username}
                    className="text-sm h-12"
                    placeholder="username"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="text-sm h-12"
                    placeholder="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="text-sm h-12"
                    placeholder="password"
                    value={profile.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    className="text-sm h-12"
                    placeholder="ig link"
                    value={profile.instagram}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="snapchat">Snapchat</Label>
                  <Input
                    id="snapchat"
                    name="snapchat"
                    className="text-sm h-12"
                    placeholder="snap link"
                    value={profile.snapchat}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    className="text-sm h-12"
                    placeholder="fb link"
                    value={profile.facebook}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    className="text-sm h-12"
                    placeholder="twitter link"
                    value={profile.twitter}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    className="text-sm h-12"
                    placeholder="whatsapp Number"
                    value={profile.whatsapp}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Call Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="text-sm h-12"
                    placeholder="phone number"
                    value={profile.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    className="text-sm h-12"
                    placeholder="address"
                    value={profile.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center mt-8">
              <Button
                type="submit"
                className="w-1/3 font-bold mt-8"
                disabled={action}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
