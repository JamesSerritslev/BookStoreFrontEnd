"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })
  }

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Login to BookHub</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-teal-400 hover:text-teal-300">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
