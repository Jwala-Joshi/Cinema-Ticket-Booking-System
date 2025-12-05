import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'ADMIN') {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      setActionLoading(true);
      const response = await fetch(`${BASE_URL}/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
      } else {
        setError('Failed to update user role');
      }
    } catch (err) {
      setError('An error occurred while updating role');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${BASE_URL}/users/${selectedUser.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setNewPassword('');
        setSelectedUser(null);
        setError('');
      } else {
        setError('Failed to update password');
      }
    } catch (err) {
      setError('An error occurred while updating password');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`${BASE_URL}/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchUsers();
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred while deleting user');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-600';
      case 'CINEMA_OWNER':
        return 'bg-blue-600';
      case 'USER':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'ALL' || user.role === filter;
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-white text-lg'>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            👥 User Management
          </h1>
          <p className='text-gray-400 mb-4'>
            View and manage all registered users
          </p>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        {error && (
          <div className='mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center max-w-4xl mx-auto'>
            <p className='text-red-400'>{error}</p>
            <button
              onClick={() => setError('')}
              className='mt-2 text-sm text-red-300 hover:text-red-100 underline'
            >
              Dismiss
            </button>
          </div>
        )}

        <div className='max-w-7xl mx-auto'>
          <div className='bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-6'>
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
              <input
                type='text'
                placeholder='Search by name or email...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600'
              />
              
              <div className='flex gap-2 flex-wrap'>
                {['ALL', 'ADMIN', 'CINEMA_OWNER', 'USER'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      filter === role
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {role === 'ALL' ? 'All' : role.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <p className='text-gray-400'>
              Total Users: <span className='text-white font-bold'>{filteredUsers.length}</span>
            </p>
          </div>

          {filteredUsers.length === 0 ? (
            <div className='text-center py-20 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-2xl font-bold text-white mb-2'>No users found</h3>
              <p className='text-gray-400'>Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className='bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-800'>
                    <tr>
                      <th className='px-6 py-4 text-left text-white font-semibold'>User</th>
                      <th className='px-6 py-4 text-left text-white font-semibold'>Role</th>
                      <th className='px-6 py-4 text-left text-white font-semibold'>Bookings</th>
                      <th className='px-6 py-4 text-left text-white font-semibold'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id || index}
                        className='border-t border-gray-800 hover:bg-gray-800/50 transition-colors duration-200'
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-lg'>
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className='text-white font-medium'>
                                {user.name && user.surname 
                                  ? `${user.name} ${user.surname}` 
                                  : user.userName || 'Unknown'
                                }
                              </p>
                              <p className='text-gray-400 text-sm'>{user.email || 'N/A'}</p>
                              <p className='text-gray-500 text-xs'>ID: #{user.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4'>
                          {editingUser === user.id ? (
                            <div className='flex gap-2'>
                              <select
                                defaultValue={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className='px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-600'
                                disabled={actionLoading}
                              >
                                <option value='USER'>User</option>
                                <option value='CINEMA_OWNER'>Cinema Owner</option>
                                <option value='ADMIN'>Admin</option>
                              </select>
                              <button
                                onClick={() => setEditingUser(null)}
                                className='px-2 text-gray-400 hover:text-white'
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className='flex items-center gap-2'>
                              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                                {user.role?.replace('_', ' ') || 'N/A'}
                              </span>
                              <button
                                onClick={() => setEditingUser(user.id)}
                                className='text-blue-400 hover:text-blue-300 text-sm'
                                title='Edit role'
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </td>

                        <td className='px-6 py-4'>
                          <button
                            onClick={() => navigate(`/user-bookings/${user.id}`)}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2'
                          >
                            🎫 View Bookings
                          </button>
                        </td>

                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordModal(true);
                              }}
                              className='px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors duration-300'
                              title='Change password'
                            >
                              🔑
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-300'
                              title='Delete user'
                            >
                              ❌
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {showPasswordModal && (
          <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70 backdrop-blur-sm'>
            <div className='bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-red-900/30'>
              <h3 className='text-2xl font-bold text-white mb-4'>Change Password</h3>
              <p className='text-gray-400 mb-4'>
                Changing password for: <span className='text-white font-semibold'>{selectedUser?.userName}</span>
              </p>
              
              <input
                type='password'
                placeholder='Enter new password (min 8 characters)'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white mb-4 focus:outline-none focus:border-red-600'
              />

              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setSelectedUser(null);
                  }}
                  className='flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={actionLoading}
                  className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50'
                >
                  {actionLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70 backdrop-blur-sm'>
            <div className='bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-red-900/30'>
              <h3 className='text-2xl font-bold text-white mb-4'>Delete User</h3>
              <p className='text-gray-400 mb-4'>
                Are you sure you want to delete user: <span className='text-white font-semibold'>{selectedUser?.userName}</span>?
              </p>
              <p className='text-red-400 text-sm mb-6'>This action cannot be undone!</p>

              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className='flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className='flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50'
                >
                  {actionLoading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='text-center mt-8'>
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

export default UserData;