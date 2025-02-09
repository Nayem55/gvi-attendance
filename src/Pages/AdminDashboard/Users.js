import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    role: "",
    group: "",
    zone: "",
    outlet: "",
  });
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://attendance-app-server-blue.vercel.app/getAllUser"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://attendance-app-server-blue.vercel.app/api/users",
        newUser
      );
      toast.success("User created successfully!");
      // setNewUser({ name: "", email: "", number: "", password: "", role: "", group: "", zone: "", outlet: "" });
      // fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(
        `https://attendance-app-server-blue.vercel.app/api/users/${userId}`
      );
      if (response.status === 200) {
        toast.success("User deleted successfully!");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `https://attendance-app-server-blue.vercel.app/updateUser/${updateUser._id}`,
        updateUser
      );
      if (response.status === 200) {
        toast.success("User updated successfully!");
        setUpdateUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex w-[95vw] sm:w-[100vw] overflow-x-scroll">
      {/* Side Drawer */}
      <div
        className={`fixed md:relative z-20 bg-gray-800 text-white w-64 h-screen transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-white md:hidden focus:outline-none"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <Link
            to="/admin/today-report"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Today's Report
          </Link>
          <Link
            to="/admin/monthly-summary"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Monthly Summary
          </Link>
          <Link
            to="/admin/monthly-details"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Monthly Details
          </Link>
          <Link
            to="/admin/applications"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700"
          >
            Leave Requests
          </Link>
          <Link
            to="/admin/user"
            className="px-4 py-2 rounded hover:bg-gray-700 focus:bg-gray-700 flex items-center"
          >
            Users
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 bg-gray-100 py-10">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="md:hidden mb-4 px-4 py-2 bg-gray-800 text-white rounded"
        >
          {isDrawerOpen ? "Close Menu" : "Open Menu"}
        </button>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            onClick={() => setIsAddUserVisible(!isAddUserVisible)}
            className="px-4 py-2 bg-[#002B54] hover:bg-black text-white rounded"
          >
            {isAddUserVisible ? "Hide Form" : "Add User"}
          </button>
        </div>

        {isAddUserVisible && (
          <form
            onSubmit={handleCreateUser}
            className="bg-white p-4 rounded shadow-md mb-6"
          >
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="number"
                className="block text-sm font-semibold mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                value={newUser.number}
                onChange={(e) =>
                  setNewUser({ ...newUser, number: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="tel"
                id="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-semibold mb-2"
              >
                Role
              </label>
              <input
                type="tel"
                id="role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="group"
                className="block text-sm font-semibold mb-2"
              >
                Group
              </label>
              <input
                type="tel"
                id="group"
                value={newUser.group}
                onChange={(e) =>
                  setNewUser({ ...newUser, group: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="zone"
                className="block text-sm font-semibold mb-2"
              >
                Zone
              </label>
              <input
                type="tel"
                id="zone"
                value={newUser.zone}
                onChange={(e) =>
                  setNewUser({ ...newUser, zone: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="outlet"
                className="block text-sm font-semibold mb-2"
              >
                Outlet
              </label>
              <input
                type="tel"
                id="outlet"
                value={newUser.outlet}
                onChange={(e) =>
                  setNewUser({ ...newUser, outlet: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 bg-[#002B54] hover:bg-black text-white rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </form>
        )}

        <div className="bg-white p-4 rounded shadow-md ">
          <h2 className="text-lg font-bold mb-4">User List</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone Number</th>
                  <th className="border p-2">Password</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Group</th>
                  <th className="border p-2">Zone</th>
                  <th className="border p-2">Outlet</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.number}</td>
                    <td className="border p-2">{user.password}</td>
                    <td className="border p-2">{user.role}</td>
                    <td className="border p-2">{user.group || ""}</td>
                    <td className="border p-2">{user.zone || ""}</td>
                    <td className="border p-2">{user.outlet || ""}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => setUpdateUser(user)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {updateUser && (
          <div className="fixed h-[100vh] overflow-y-scroll inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-[90vw] sm:w-[60vw]">
              <h2 className="text-lg font-bold mb-4">Update User</h2>
              <form onSubmit={handleUpdateUser}>
                <div className="mb-4">
                  <label
                    htmlFor="updateName"
                    className="block text-sm font-semibold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="updateName"
                    value={updateUser.name}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateEmail"
                    className="block text-sm font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="updateEmail"
                    value={updateUser.email}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateNumber"
                    className="block text-sm font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="updateNumber"
                    value={updateUser.number}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, number: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateNumber"
                    className="block text-sm font-semibold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="tel"
                    id="updateNumber"
                    value={updateUser.password}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, password: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateNumber"
                    className="block text-sm font-semibold mb-2"
                  >
                    Role
                  </label>
                  <input
                    type="tel"
                    id="updateNumber"
                    value={updateUser.role}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, role: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateNumber"
                    className="block text-sm font-semibold mb-2"
                  >
                    Group
                  </label>
                  <input
                    type="tel"
                    id="updateNumber"
                    value={updateUser.group}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, group: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateNumber"
                    className="block text-sm font-semibold mb-2"
                  >
                    Zone
                  </label>
                  <input
                    type="tel"
                    id="updateNumber"
                    value={updateUser.zone}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, zone: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="updateNumber"
                    className="block text-sm font-semibold mb-2"
                  >
                    Outlet
                  </label>
                  <input
                    type="tel"
                    id="updateNumber"
                    value={updateUser.outlet}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, outlet: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateUser(null)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
