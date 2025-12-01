import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal thêm tài khoản
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  // Modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách tài khoản thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // API thêm tài khoản
  const handleSubmitAdd = async () => {
    try {
      const payload = {
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      };

      await axios.post("http://localhost:8080/api/auth/register", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Thêm tài khoản thành công!");
      setShowAddModal(false);
      setNewUser({ fullname: "", username: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Thêm tài khoản thất bại!");
    }
  };

  // API xóa tài khoản
  const confirmDelete = async () => {
    if (!selectedUser) return;

    console.log(selectedUser.userName);
    try {
      await axios.delete(
        `http://localhost:8080/api/auth/delete/${selectedUser.userName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Xóa tài khoản thành công!");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Xóa tài khoản thất bại!");
    // }

     } catch (err) {
  console.error(err);

  const msg =
    err.response?.data?.message ||  // backend trả về message
    err.response?.data ||           // backend trả về string
    "Xóa tài khoản thất bại!";      // fallback nếu không có gì

  toast.error(msg);
}
  };

  // Lọc danh sách
  const filteredUsers = users.filter(
    (user) =>
      (user.fullName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (user.userName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Quản lý tài khoản</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 p-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Bảng tài khoản */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-3">ID</th>
              <th className="border p-3">Họ & Tên</th>
              <th className="border p-3">Tên đăng nhập</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Ngày tạo</th>
              <th className="border p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border p-3">{user.userId}</td>
                  <td className="border p-3">{user.fullName}</td>
                  <td className="border p-3">{user.userName}</td>
                  <td className="border p-3">{user.email}</td>
                  <td className="border p-3">
                    {new Date(user.createAt).toLocaleDateString()}
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Không có tài khoản
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm tài khoản */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-[400px]">
            <h3 className="text-xl font-bold mb-4">Thêm tài khoản</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ và tên"
                value={newUser.fullname}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullname: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="password"
                placeholder="Mật khẩu"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitAdd}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-[380px]">
            <h3 className="text-xl font-bold">Xác nhận xóa</h3>

            <p className="mt-3 text-gray-700">
              Bạn có chắc chắn muốn xóa tài khoản:
              <span className="font-semibold"> {selectedUser.fullName}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

