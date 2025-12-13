import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);

  // fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // load users on page load
  useEffect(() => {
    fetchUsers();
  }, [axiosSecure]);

  // update user status
  const handleStatusChange = async (email, status) => {
    try {
      const res = await axiosSecure.patch(
        `/update/user/status?email=${email}&status=${status}`
      );

      if (res.data?.modifiedCount > 0) {
        // 🔁 refresh users without reload
        fetchUsers();
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Role</th>
            <th>User Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>
                <input type="checkbox" className="checkbox" />
              </td>

              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={user?.photoURL || "https://via.placeholder.com/48"}
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user?.name}</div>
                    <div className="text-sm opacity-50">{user?.email}</div>
                  </div>
                </div>
              </td>

              <td>{user?.role}</td>
              <td>{user?.status}</td>

              <td>
                {user?.status !== "active" ? (
                  <button
                    onClick={() =>
                      handleStatusChange(user.email, "active")
                    }
                    className="btn btn-ghost btn-xs"
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleStatusChange(user.email, "blocked")
                    }
                    className="btn btn-error btn-xs"
                  >
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
