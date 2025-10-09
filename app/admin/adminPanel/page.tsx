"use client"

import { useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminPanelPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users")
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) throw new Error("Failed to update role")

      // Update the UI instantly
      setUsers(prev =>
        prev.map(user => (user.id === id ? { ...user, role: newRole } : user))
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel (MOCK DATA NOT FROM DATABASE)</h1>
      <p className="text-gray-600 mb-8">Manage user roles here.</p>

      <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-gray-200">
          {users.map(user => (
            <tr key={user.id} className="border-t border-gray-700">
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.role}</td>
              <td className="py-3 px-4">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className="bg-gray-700 text-white px-2 py-1 rounded"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SELLER">SELLER</option>
                  <option value="BUYER">BUYER</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
