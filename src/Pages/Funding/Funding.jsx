import React, { useContext } from 'react';
import useAxios from '../../hooks/useAxios';
import { AuthContext } from '../../Context/AuthProvider';
import { useNavigate } from 'react-router';

function Funding() {
  const axios = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = (e) => {
    e.preventDefault();
    
    const donorEmail = user?.email;
    const donateAmount = e.target.donateAmount.value;
    const donorName = user?.displayName;

    const formData = {
      donorEmail,
      donateAmount,
      donorName
    };

    
    axios
      .post('http://localhost:5000/create-payment-checkout', formData)
      .then(res => {
        const { url } = res.data;
        
        if (url) {
          window.location.href = url;
        }
      })
      .catch(err => {
        console.error("Payment error:", err.response?.data || err.message);
      });
  };

  return (
    <div>
      <form
        onSubmit={handleCheckout}
        className="flex justify-center items-center min-h-screen gap-4"
      >
        <input
          name="donateAmount"
          placeholder="type amount here"
          type="number"
          className="input input-bordered"
          required
          min="1"
        />
        <button className="btn btn-primary" type="submit">
          Donate
        </button>
      </form>
    </div>
  );
}

export default Funding;