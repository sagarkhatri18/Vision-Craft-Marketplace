import React, { useState } from 'react';
import {  forgetpassword } from "../../../../src/services/Services";
function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      forgetpassword(email)
        .then((res) => {
          const response = res.data;

          if (response.success) {
            dispatch(hideLoader());
            const token = response.token;
            localStorage.setItem("token", token);
            navigate("/dashboard");
          } else {
            dispatch(hideLoader());
            toast.error("Invalid email ");
          }
        })
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="text-center">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email" className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-2">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgetPassword;
