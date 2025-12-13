import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";

const AllUsers = () => {

    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
  

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUsers();
}, [axiosSecure]);
 console.log(users)

    return (
        <div>
            all users here
        </div>
    );
}

export default AllUsers;