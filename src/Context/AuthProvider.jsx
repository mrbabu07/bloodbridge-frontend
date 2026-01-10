import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("donor");
  const [userStatus, setUserStatus] = useState("active");
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Seed demo users on first visit
  useEffect(() => {
    const seedDemoUsers = async () => {
      const hasSeeded = localStorage.getItem("bloodbridge_demo_seeded");
      if (hasSeeded) return;

      try {
        await axios.post(`${apiBase}/seed-demo-users`);
        localStorage.setItem("bloodbridge_demo_seeded", "true");
        console.log("Demo users seeded successfully");
      } catch (error) {
        // Silently fail - demo users might already exist
        console.log("Demo users may already exist");
      }
    };

    seedDemoUsers();
  }, [apiBase]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("bloodbridge_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data);
          setRole(response.data.role || "donor");
          setUserStatus(response.data.status || "active");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("bloodbridge_token");
        setUser(null);
        setRole("donor");
        setUserStatus("active");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [apiBase]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiBase}/auth/login`, {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem("bloodbridge_token", token);
      setUser(userData);
      setRole(userData.role || "donor");
      setUserStatus(userData.status || "active");

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(`${apiBase}/auth/register`, userData);

      const { token, user: newUser } = response.data;

      localStorage.setItem("bloodbridge_token", token);
      setUser(newUser);
      setRole(newUser.role || "donor");
      setUserStatus(newUser.status || "active");

      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("bloodbridge_token");
    setUser(null);
    setRole("donor");
    setUserStatus("active");
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("bloodbridge_token");
      await axios.patch(`${apiBase}/users/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh user data
      const response = await axios.get(`${apiBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUser(response.data);
        setRole(response.data.role || "donor");
        setUserStatus(response.data.status || "active");
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      return { success: false, message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("bloodbridge_token");
      await axios.patch(
        `${apiBase}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      return { success: false, message };
    }
  };

  // Seed demo users manually
  const seedDemoUsers = async () => {
    try {
      const response = await axios.post(`${apiBase}/seed-demo-users`);
      localStorage.setItem("bloodbridge_demo_seeded", "true");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: "Failed to seed demo users" };
    }
  };

  const value = {
    user,
    role,
    userStatus,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    seedDemoUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
