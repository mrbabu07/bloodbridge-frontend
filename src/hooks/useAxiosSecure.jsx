import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthProvider";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${user?.accessToken}`;
        return config;
      },
      
    );
    const resInterceptor = axiosSecure.interceptors.response.use(response=>{
        return response;
    }, (error)=>{

        console.log("Response error:", error);
        return Promise.reject(error);
    }

    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user?.accessToken]);

  return axiosSecure;
};

export default useAxiosSecure;
