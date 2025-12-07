import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const [nameData, setNameData] = useState({ name: '', surname: '', currentPassword: '' });
  const [emailData, setEmailData] = useState({ email: '', currentPassword: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) navigate('/');
    else {
      setUser(loggedInUser);
      setNameData({ name: loggedInUser.userName, surname: loggedInUser.surname, currentPassword: '' });
      setEmailData({ email: loggedInUser.email, currentPassword: '' });
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const updateLocalStorage = (updatedUser) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const newUser = { ...currentUser, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const submitNameChange = async () => {
    setMessage('');
    if (!nameData.currentPassword) {
      setMessage('Enter current password to update name.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameData.name,
          surname: nameData.surname,
          currentPassword: nameData.currentPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update name.');
      }

      const updatedUser = await response.json();
      updateLocalStorage({ userName: updatedUser.name, surname: updatedUser.surname });

      setUser(prevUser => ({
        ...prevUser,
        userName: updatedUser.name,
        surname: updatedUser.surname
      }));

      setActiveSection('');
      setNameData({ name: updatedUser.name, surname: updatedUser.surname, currentPassword: '' });
      setMessage('Name updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error updating name. Check your password.');
    }
  };

  const submitEmailChange = async () => {
    setMessage('');
    if (!emailData.currentPassword) {
      setMessage('Enter current password to update email.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${user.userId}/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailData.email,
          currentPassword: emailData.currentPassword
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update email.');
      }
      const updatedUser = await response.json();
      updateLocalStorage({ email: updatedUser.email });
      setActiveSection('');
      setEmailData({ email: updatedUser.email, currentPassword: '' });
      setMessage('Email updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error updating email. Check your password.');
    }
  };

  const submitPasswordChange = async () => {
    setMessage('');
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage('Fill all password fields.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${user.userId}/passwordUpdate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveSection('');
      setMessage('Password updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error updating password. Check your current password.');
    }
  };

  const renderForm = () => {
    switch (activeSection) {
      case 'name':
        return (
          <div className='space-y-4 transition-opacity duration-300'>
            <input
              type='text'
              name='name'
              placeholder='First Name'
              value={nameData.name}
              onChange={handleInputChange(setNameData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <input
              type='text'
              name='surname'
              placeholder='Last Name'
              value={nameData.surname}
              onChange={handleInputChange(setNameData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <input
              type='password'
              name='currentPassword'
              placeholder='Current Password'
              value={nameData.currentPassword}
              onChange={handleInputChange(setNameData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <div className="flex gap-4">
              <button
                onClick={submitNameChange}
                className='w-full py-3 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-500 transition-all'
              >
                Update Name
              </button>
              <button
                onClick={() => setActiveSection('')}
                className='w-full py-3 bg-gray-600 rounded-lg font-semibold text-white hover:bg-gray-500 transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className='space-y-4 transition-opacity duration-300'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={emailData.email}
              onChange={handleInputChange(setEmailData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <input
              type='password'
              name='currentPassword'
              placeholder='Current Password'
              value={emailData.currentPassword}
              onChange={handleInputChange(setEmailData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <div className="flex gap-4">
              <button
                onClick={submitEmailChange}
                className='w-full py-3 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-500 transition-all'
              >
                Update Email
              </button>
              <button
                onClick={() => setActiveSection('')}
                className='w-full py-3 bg-gray-600 rounded-lg font-semibold text-white hover:bg-gray-500 transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        );
      case 'password':
        return (
          <div className='space-y-4 transition-opacity duration-300'>
            <input
              type='password'
              name='currentPassword'
              placeholder='Current Password'
              value={passwordData.currentPassword}
              onChange={handleInputChange(setPasswordData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <input
              type='password'
              name='newPassword'
              placeholder='New Password'
              value={passwordData.newPassword}
              onChange={handleInputChange(setPasswordData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <input
              type='password'
              name='confirmPassword'
              placeholder='Confirm New Password'
              value={passwordData.confirmPassword}
              onChange={handleInputChange(setPasswordData)}
              className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600'
            />
            <div className="flex gap-4">
              <button
                onClick={submitPasswordChange}
                className='w-full py-3 bg-red-600 rounded-lg font-semibold text-white hover:bg-red-500 transition-all'
              >
                Update Password
              </button>
              <button
                onClick={() => setActiveSection('')}
                className='w-full py-3 bg-gray-600 rounded-lg font-semibold text-white hover:bg-gray-500 transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className='flex flex-col gap-4'>
            <button
              onClick={() => setActiveSection('name')}
              className='w-full text-left p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-red-600 transition-all text-white hover:bg-black/60'
            >
              Change Name
            </button>
            <button
              onClick={() => setActiveSection('email')}
              className='w-full text-left p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-red-600 transition-all text-white hover:bg-black/60'
            >
              Change Email
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className='w-full text-left p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-red-600 transition-all text-white hover:bg-black/60'
            >
              Change Password
            </button>
          </div>
        );
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4 max-w-2xl'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>Settings</h1>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
          {message && <div className='mt-4 text-red-400 font-semibold'>{message}</div>}
        </div>

        <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
          {renderForm()}
        </div>

        <div className='text-center pt-6 space-x-4'>
          <button
            onClick={() => navigate('/profile')}
            className='px-8 py-3 bg-transparent border-2 border-gray-700 text-white rounded-full font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
          >
            Back to Profile
          </button>
          <button
            onClick={() => navigate('/')}
            className='px-8 py-3 bg-transparent border-2 border-gray-700 text-white rounded-full font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;