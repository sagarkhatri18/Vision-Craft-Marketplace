import React, { useState } from 'react';

const ProfilePage = () => {
  // Initial user data
  const [userData, setUserData] = useState({
    email: 'example@example.com',
    phone: '123-456-7890'
  });

  // State for the email edit mode
  const [editEmail, setEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Function to handle email change
  const handleEmailChange = () => {
    // Update email in user data
    setUserData(prevState => ({
      ...prevState,
      email: newEmail
    }));
    // Exit edit mode
    setEditEmail(false);
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <label>Email: </label>
        {/* Display email in edit mode or normal mode */}
        {editEmail ? (
          <>
            <input 
              type="email" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
            />
            <button onClick={handleEmailChange}>Save</button>
          </>
        ) : (
          <>
            <span>{userData.email}</span>
            <button onClick={() => setEditEmail(true)}>Edit</button>
          </>
        )}
      </div>
      <div>
        <label>Phone: </label>
        <span>{userData.phone}</span>
      </div>
    </div>
  );
};

export default ProfilePage;
