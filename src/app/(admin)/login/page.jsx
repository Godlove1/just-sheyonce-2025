"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Store a dummy token
      localStorage.setItem("token", "dummy_token");
      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="w-full flex justify-center items-center">
            <Image
              src={"/logo.png"}
              width={100}
              height={100}
              unoptimized
              alt="logo"
              className=""
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div className="mt-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="w-full flex justify-center mt-6 items-center">
              <Button
                className="w-1/2 rounded-full border shadow-md hover:bg-white hover:text-black hover:border-black"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* back to website */}
      <div className="w-full flex justify-center items-center mt-6">
        <div className="w-1/2 mt-6 flex justify-start ">
          <Link href={'/'} title="bact to home" className="text-sm underline flex items-center justify-start">
            <ArrowBigLeft className="w-5 h-5" /> bact to website
          </Link>
        </div>
      </div>
    </div>
  );
}
