"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BUYER" as "BUYER" | "SELLER",
  });
  const { register, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (value: "BUYER" | "SELLER") => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      // Wait for state to propagate, then redirect
      setTimeout(() => {
        router.replace("/dashboard");
      }, 200);
    } catch (err) {
      // Error is handled by the auth context
      console.error("Registration failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">
          Join BookHub
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Create your account to start exploring books
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">
              Account Type
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-teal-400">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem
                  value="BUYER"
                  className="text-white hover:bg-gray-700"
                >
                  Buyer - Purchase and read books
                </SelectItem>
                <SelectItem
                  value="SELLER"
                  className="text-white hover:bg-gray-700"
                >
                  Seller - Sell books and manage inventory
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-400 hover:text-teal-300">
              Login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
