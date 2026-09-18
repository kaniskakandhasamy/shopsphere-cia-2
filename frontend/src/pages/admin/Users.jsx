import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiShield, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Registered customers and platform administrators ({users.length} total)
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Phone</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">City / Location</th>
                <th className="py-3 px-4 font-bold">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">Loading users...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="flex items-center space-x-1">
                        <FiMail className="text-slate-400" />
                        <span>{u.email}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.phone ? (
                        <span className="flex items-center space-x-1">
                          <FiPhone className="text-slate-400" />
                          <span>{u.phone}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {u.role === 'ADMIN' && <FiShield className="text-[10px]" />}
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {u.address?.city ? `${u.address.city}, ${u.address.state || ''}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span className="flex items-center space-x-1">
                        <FiCalendar className="text-slate-400" />
                        <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminUsers;
