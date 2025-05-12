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

  // Form state cho thêm/sửa người dùng
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    pass: "",
    user_role: "user" as "admin" | "user",
  });

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");

      if (response.status === 401) {
        setError(
          "Không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin."
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Lỗi HTTP: ${response.status}`,
        }));
        throw new Error(
          errorData.error || `Lỗi khi tải người dùng: ${response.statusText}`
        );
      }

      const data = await response.json();
      // Sắp xếp người dùng theo ID
      const sortedUsers = [...data].sort(
        (a, b) => parseInt(a.id) - parseInt(b.id)
      );
      setUsers(sortedUsers);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách người dùng");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tải danh sách người dùng khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Thêm người dùng mới
  const handleAddUser = async () => {
    if (!formData.full_name || !formData.email || !formData.pass) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
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
          title: "Lỗi",
          description: "Không có quyền thêm người dùng",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể thêm người dùng");
      }

      // Thêm vào danh sách và reset form
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setIsAddingUser(false);
      resetForm();

      toast({
        title: "Thành công",
        description: "Đã thêm người dùng mới",
      });
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể thêm người dùng",
        variant: "destructive",
      });
    }
  };

  // Cập nhật người dùng
  const handleUpdateUser = async (userId: string) => {
    try {
      // Chỉ gửi các trường đã được thay đổi
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
          title: "Lỗi",
          description: "Không có quyền cập nhật người dùng",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể cập nhật người dùng");
      }

      const updatedUser = await response.json();

      // Cập nhật người dùng trong danh sách
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      setEditingUserId(null);
      resetForm();

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin người dùng",
      });
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật người dùng",
        variant: "destructive",
      });
    }
  };

  // Xóa người dùng
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        toast({
          title: "Lỗi",
          description: "Không có quyền xóa người dùng",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể xóa người dùng");
      }

      // Xóa người dùng khỏi danh sách
      setUsers(users.filter((user) => user.id !== userId));

      toast({
        title: "Thành công",
        description: "Đã xóa người dùng",
      });
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể xóa người dùng",
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

  // Bắt đầu chỉnh sửa người dùng
  const startEditing = (user: SafeUser) => {
    setEditingUserId(user.id);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      pass: "", // Không hiển thị mật khẩu
      user_role: user.user_role,
    });
  };

  // Hủy thêm/sửa
  const cancelAction = () => {
    setIsAddingUser(false);
    setEditingUserId(null);
    resetForm();
  };

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  // Hiển thị lỗi
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
