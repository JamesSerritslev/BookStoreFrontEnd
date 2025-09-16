"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", formData)
  }

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Join BookHub</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Create your account to start exploring books
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
              required
            />
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
          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium">
            Create Account
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
  )
}
