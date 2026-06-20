import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function ManageUsers() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: false,
    is_active: true
  });
  
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/users/manage/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  if (user && !user.is_staff) {
    return <Navigate to="/analysis" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openModal = (userToEdit = null) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
        password: '', // Blank for security, only update if typed
        is_staff: userToEdit.is_staff,
        is_active: userToEdit.is_active
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        is_staff: false,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser 
      ? `http://localhost:8000/api/users/manage/${editingUser.id}/` 
      : 'http://localhost:8000/api/users/manage/';
    
    const method = editingUser ? 'PATCH' : 'POST';
    
    const payload = { ...formData };
    if (editingUser && !payload.password) {
      delete payload.password; // don't send empty password on update
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchUsers();
        closeModal();
      } else {
        const data = await response.json();
        alert('Error saving user: ' + JSON.stringify(data));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/users/manage/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuickAdd = async () => {
    const randomId = Math.floor(Math.random() * 10000);
    const mockUser = {
      username: `testuser_${randomId}`,
      email: `test${randomId}@example.com`,
      password: 'password123!',
      is_staff: false,
      is_active: true
    };
    try {
      const response = await fetch('http://localhost:8000/api/users/manage/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mockUser)
      });
      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to quick add');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-margin-mobile">Loading...</div>;
  if (error) return <div className="p-margin-mobile text-error">Error: {error}</div>;

  return (
    <div className="p-margin-mobile max-w-7xl mx-auto space-y-stack-lg h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <button onClick={() => navigate('/admin')} className="text-primary font-label-bold mb-2 uppercase flex items-center hover:underline">
            <span className="material-symbols-outlined mr-1 text-sm">arrow_back</span> Back to Command Center
          </button>
          <h2 className="font-headline-lg text-headline-lg uppercase">Manage Users</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleQuickAdd}
            className="bg-secondary text-on-secondary border-thick border-on-surface px-4 py-2 font-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase cursor-pointer flex items-center"
          >
            <span className="material-symbols-outlined mr-1">bolt</span> Quick Add Test User
          </button>
          <button 
            onClick={() => openModal()}
            className="bg-primary text-on-primary border-thick border-on-surface px-4 py-2 font-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase cursor-pointer flex items-center"
          >
            <span className="material-symbols-outlined mr-1">person_add</span> Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-on-surface text-surface uppercase font-label-bold">
              <th className="p-3 border-b-thick border-on-surface">ID</th>
              <th className="p-3 border-b-thick border-on-surface">Username</th>
              <th className="p-3 border-b-thick border-on-surface">Email</th>
              <th className="p-3 border-b-thick border-on-surface">Role</th>
              <th className="p-3 border-b-thick border-on-surface">Status</th>
              <th className="p-3 border-b-thick border-on-surface text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b-thin border-on-surface hover:bg-surface-container-high transition-colors">
                <td className="p-3 font-body-md">{u.id}</td>
                <td className="p-3 font-label-bold">{u.username}</td>
                <td className="p-3 font-body-md text-on-surface-variant">{u.email}</td>
                <td className="p-3">
                  {u.is_staff 
                    ? <span className="bg-secondary-container text-on-secondary-container px-2 py-1 border-thin border-on-surface font-label-sm uppercase">Admin</span> 
                    : <span className="bg-surface-variant text-on-surface px-2 py-1 border-thin border-on-surface font-label-sm uppercase">User</span>
                  }
                </td>
                <td className="p-3">
                  {u.is_active 
                    ? <span className="bg-tertiary-container text-on-tertiary-container px-2 py-1 border-thin border-on-surface font-label-sm uppercase">Active</span> 
                    : <span className="bg-error-container text-on-error-container px-2 py-1 border-thin border-on-surface font-label-sm uppercase">Inactive</span>
                  }
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <button 
                    onClick={() => openModal(u)}
                    className="bg-surface text-on-surface border-thick border-on-surface p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-sm block">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="bg-error text-on-error border-thick border-on-surface p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-sm block">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-on-surface-variant font-body-md">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="bg-on-surface text-surface p-3 flex justify-between items-center">
              <h3 className="font-headline-sm uppercase">{editingUser ? 'Edit User' : 'Create User'}</h3>
              <button onClick={closeModal} className="text-surface hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-stack-md space-y-4">
              <div>
                <label className="block font-label-bold uppercase mb-1">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick focus:bg-primary-container/10 outline-none"
                />
              </div>
              
              <div>
                <label className="block font-label-bold uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick focus:bg-primary-container/10 outline-none"
                />
              </div>

              <div>
                <label className="block font-label-bold uppercase mb-1">
                  Password {editingUser && <span className="text-xs text-on-surface-variant">(Leave blank to keep current)</span>}
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange}
                  required={!editingUser}
                  className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick focus:bg-primary-container/10 outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_staff" 
                    checked={formData.is_staff} 
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-label-bold uppercase">Is Admin</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    checked={formData.is_active} 
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-label-bold uppercase">Is Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t-thin border-outline mt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 bg-surface-variant border-thick border-on-surface font-label-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-on-primary border-thick border-on-surface font-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
