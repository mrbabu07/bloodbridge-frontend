// src/Pages/Register.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../Firebase/Firebase.config";
import { FaEye, FaHome, FaGoogle, FaLock, FaEnvelope, FaUser, FaImage } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET"); // Replace with your preset
    formData.append("cloud_name", "YOUR_CLOUDINARY_CLOUD_NAME"); // Replace with your cloud name

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      toast.error("Image upload failed. Try again.");
      return "";
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    const photoURL = await handleImageUpload();

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) =>
        updateProfile(result.user, {
          displayName: name,
          photoURL: photoURL,
        })
      )
      .then(() => {
        toast.success("Account created successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then(() => {
        toast.success("Welcome!");
        navigate("/");
      })
      .catch(() => toast.error("Google sign-in failed."))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <FaHome className="text-white text-2xl mr-2" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-blue-100 mt-1">Join our community</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleRegistration} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none" />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter a strong password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {isPasswordVisible ? <IoEyeOff className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Image (optional)
              </label>
              <div className="relative">
                <FaImage className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-500 hover:to-teal-600 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="mx-3 text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
