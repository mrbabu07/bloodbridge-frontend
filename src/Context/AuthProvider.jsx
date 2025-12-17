// // src/Context/AuthProvider.jsx
// import { useEffect, useState, createContext } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../Firebase/Firebase.config";
// import axios from "axios";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [roleLoading, setRoleLoading] = useState(true);
//   const [role, setRole] = useState(null);
//   const [userStatus, setUserStatus] = useState('')

//   // Fetch user role from backend
//   const fetchUserRole = async (email) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/users/role/${email}`);
//       if (response.data) {
//         setRole(response.data.role || null);
//         setUserStatus(response.data.status)
//         setRoleLoading(false)
//         console.log(`User ${email} has role:`, response.data.role);
//       } else {
//         setRole(null);
//         console.log(`User ${email} not found in DB`);
//       }
//     } catch (error) {
//       console.error(`Error fetching role for ${email}:`, error.message);
//       setRole(null);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//       console.log("Auth State Changed:", currentUser);

//       if (currentUser?.email) {
//         await fetchUserRole(currentUser.email);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, role, fetchUserRole, roleLoading, userStatus }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthProvider, AuthContext };


import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("donor");
  const [userStatus, setUserStatus] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const res = await axios.get(`http://localhost:5000/users/role/${currentUser.email}`);
          if (res.data) {
            setRole(res.data.role || "donor");
            setUserStatus(res.data.status || "active");
          }
        } catch (err) {
          setRole("donor");
          setUserStatus("active");
        }
      } else {
        setRole("donor");
        setUserStatus("active");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, userStatus, loading }}>
      {children}
    </AuthContext.Provider>
  );
};