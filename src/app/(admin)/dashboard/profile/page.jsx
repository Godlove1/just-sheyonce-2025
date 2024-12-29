"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";


export default function ProfilePage() {

  const { adminUser } = useStore();

  const [profile, setProfile] = useState({
    username: adminUser?.name || "admin",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
    instagram: "",
    snapchat: "",
    facebook: "",
    twitter: "",
    whatsapp: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (profile.password !== profile.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Update the admin information in the Zustand store
    setAdmin(profile.username, image);

    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile);
    // For now, we'll just show a success message
    alert("Profile updated successfully!");
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-3 -mt-2">Profile</h2>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile.username}
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
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
                  className="text-sm"
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
                  className="text-sm"
                placeholder="phon number"
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
                  className="text-sm"
                placeholder="address"
                value={profile.address}
                onChange={handleInputChange}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="mt-6">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
