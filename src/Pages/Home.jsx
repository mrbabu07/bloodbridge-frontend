// src/Pages/Home.jsx
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="absolute inset-0 bg-[url('https://svgbackgrounds.com/svg/84/84-blood-donation-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-md">
            Save Lives Through Blood Donation
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Every drop counts. Join thousands of heroes who give the gift of life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-lg btn-secondary"
                >
                  Join as a Donor
                </button>
                <button
                  onClick={() => navigate("/search")}
                  className="btn btn-lg btn-outline btn-white"
                >
                  Search Donors
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-lg btn-secondary"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Donate Blood?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
              <p className="text-gray-600">
                One donation can save up to 3 lives. Be a hero in someone’s story.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Quick</h3>
              <p className="text-gray-600">
                The process takes only 30 minutes and is completely safe.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2zM17 8a4 4 0 10-8 0v6a2 2 0 002 2h4a2 2 0 002-2V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Strengthen your community by ensuring blood is available when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input input-bordered w-full"
                />
                <textarea
                  placeholder="Your Message"
                  className="textarea textarea-bordered w-full"
                  rows="4"
                ></textarea>
                <button type="submit" className="btn btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Emergency Blood Request</h3>
                <p className="text-red-600 font-bold text-lg">+880 17XX-XXXXXX</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Office Address</h3>
                <p className="text-gray-700">
                  National Blood Bank Center,  
                  Mohakhali, Dhaka-1212, Bangladesh
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-700">contact@blooddonation.org</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer will be handled by MainLayout */}
    </div>
  );
};

export default Home;