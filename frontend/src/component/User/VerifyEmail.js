// src/VerifyEmail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const history = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (!token) {
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/api/v1/verify-email?token=${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error || 'An error occurred during verification.');
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleRedirect = () => {
    history('/login'); // Redirect user to login page after verification
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
      {message === 'Email verified successfully!' && (
        <button onClick={handleRedirect} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Go to Login
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
