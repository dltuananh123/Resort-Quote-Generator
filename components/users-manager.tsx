"use client";

import { useState, useEffect } from "react";
import { User, SafeUser } from "@/lib/supabase-users";
import {
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UsersManager() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state for adding/editing users
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    pass: "",
    user_role: "user" as "admin" | "user",
  });

  // Fetch users list
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");

      if (response.status === 401) {
        setError("Access denied. Please log in with an admin account.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP Error: ${response.status}`,
        }));
        throw new Error(
          errorData.error || `Error loading users: ${response.statusText}`
        );
      }

      const data = await response.json();
      // Sort users by ID
      const sortedUsers = [...data].sort(
        (a, b) => parseInt(a.id) - parseInt(b.id)
      );
      setUsers(sortedUsers);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unable to load users list");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users list when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = async () => {
    if (!formData.full_name || !formData.email || !formData.pass) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        toast({
          title: "Error",
          description: "No permission to add users",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Cannot add user");
      }

      // Add to list and reset form
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setIsAddingUser(false);
      resetForm();

      toast({
        title: "Success",
        description: "New user added",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Cannot add user",
        variant: "destructive",
      });
    }
  };

  // Update user
  const handleUpdateUser = async (userId: string) => {
    try {
      // Only send fields that have been changed
      const dataToUpdate: Partial<User> = {};
      if (formData.full_name) dataToUpdate.full_name = formData.full_name;
      if (formData.email) dataToUpdate.email = formData.email;
      if (formData.pass) dataToUpdate.pass = formData.pass;
      if (formData.user_role) dataToUpdate.user_role = formData.user_role;

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (response.status === 401) {
        toast({
          title: "Error",
          description: "No permission to update user",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Cannot update user");
      }

      const updatedUser = await response.json();

      // Update user in the list
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      setEditingUserId(null);
      resetForm();

      toast({
        title: "Success",
        description: "User information updated",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Cannot update user",
        variant: "destructive",
      });
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        toast({
          title: "Error",
          description: "No permission to delete user",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Cannot delete user");
      }

      // Remove user from list
      setUsers(users.filter((user) => user.id !== userId));

      toast({
        title: "Success",
        description: "User deleted",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Cannot delete user",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      pass: "",
      user_role: "user",
    });
  };

  // Start editing user
  const startEditing = (user: SafeUser) => {
    setEditingUserId(user.id);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      pass: "", // Don't display password
      user_role: user.user_role,
    });
  };

  // Cancel add/edit
  const cancelAction = () => {
    setIsAddingUser(false);
    setEditingUserId(null);
    resetForm();
  };

  // Display loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  // Display error
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        {!isAddingUser && !editingUserId && (
          <button
            onClick={() => setIsAddingUser(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            <span>Thêm người dùng</span>
          </button>
        )}
      </div>

      {/* Form thêm người dùng */}
      {isAddingUser && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium mb-3">Thêm người dùng mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Nhập họ tên"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Nhập email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                value={formData.pass}
                onChange={(e) =>
                  setFormData({ ...formData, pass: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select
                value={formData.user_role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user_role: e.target.value as "admin" | "user",
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="user">Người dùng</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={cancelAction}
              className="px-3 py-2 border rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleAddUser}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </div>
      )}

      {/* Bảng danh sách người dùng */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border text-left">ID</th>
              <th className="py-2 px-4 border text-left">Họ tên</th>
              <th className="py-2 px-4 border text-left">Email</th>
              <th className="py-2 px-4 border text-left">Vai trò</th>
              <th className="py-2 px-4 border text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {editingUserId === user.id ? (
                  // Row đang chỉnh sửa
                  <>
                    <td className="py-2 px-4 border">{user.id}</td>
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="space-y-1">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full p-1 border rounded"
                        />
                        <div>
                          <input
                            type="password"
                            value={formData.pass}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pass: e.target.value,
                              })
                            }
                            className="w-full p-1 border rounded"
                            placeholder="Mật khẩu (để trống nếu không thay đổi)"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            (Để trống nếu không thay đổi mật khẩu)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border">
                      <select
                        value={formData.user_role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user_role: e.target.value as "admin" | "user",
                          })
                        }
                        className="w-full p-1 border rounded"
                        disabled={
                          user.id === "1" &&
                          users.filter((u) => u.user_role === "admin")
                            .length === 1
                        }
                      >
                        <option value="user">Người dùng</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleUpdateUser(user.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Lưu"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelAction}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Hủy"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // Row hiển thị thông thường
                  <>
                    <td className="py-2 px-4 border">{user.id}</td>
                    <td className="py-2 px-4 border">{user.full_name}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.user_role === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.user_role === "admin" ? "Admin" : "Người dùng"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Sửa"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`p-1 ${
                            user.user_role === "admin" &&
                            users.filter((u) => u.user_role === "admin")
                              .length === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800"
                          }`}
                          title={
                            user.user_role === "admin" &&
                            users.filter((u) => u.user_role === "admin")
                              .length === 1
                              ? "Không thể xóa admin duy nhất"
                              : "Xóa"
                          }
                          disabled={
                            user.user_role === "admin" &&
                            users.filter((u) => u.user_role === "admin")
                              .length === 1
                          }
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
