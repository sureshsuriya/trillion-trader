import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce'; // We need to create this hook

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Fetch Users
  const { data, isLoading } = useQuery({
    queryKey: ['users', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/users?page=${page}&size=10&search=${debouncedSearch}`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { roles: ['USER'], active: true },
  });

  const openAddModal = () => {
    setEditingUser(null);
    reset({ firstName: '', lastName: '', email: '', password: '', roles: ['USER'], active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // Leave empty to not update
      roles: user.roles,
      active: user.active,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      if (editingUser) {
        return apiClient.put(`/users/${editingUser.id}`, values);
      } else {
        return apiClient.post('/users', values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const onSubmit = (values: UserFormValues) => {
    if (!editingUser && (!values.password || values.password.length < 6)) {
      toast.error('Password is required for new users');
      return;
    }
    // If editing and password is empty, remove it from payload so backend ignores it
    if (editingUser && !values.password) {
      delete (values as any).password;
    }
    saveMutation.mutate(values);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="text-white/50 text-sm mt-1">Add, edit, or remove user accounts.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-tt-gold transition-colors"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0); // Reset page on search
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-white/60 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Roles</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                    No users found.
                  </td>
                </tr>
              ) : (
                data?.content?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.map((role: string) => (
                          <span key={role} className="px-2 py-0.5 rounded text-xs bg-tt-gold/10 text-tt-gold border border-tt-gold/20">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(user)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-white/60">
            <div>
              Showing {page * data.size + 1} to {Math.min((page + 1) * data.size, data.totalElements)} of {data.totalElements} results
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={data.first}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">Page {data.page + 1} of {data.totalPages}</span>
              <button
                disabled={data.last}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">First Name</label>
              <input {...register('firstName')} className="input-field w-full" />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Last Name</label>
              <input {...register('lastName')} className="input-field w-full" />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input type="email" {...register('email')} className="input-field w-full" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Password {editingUser && <span className="text-white/30 text-xs">(Leave blank to keep unchanged)</span>}
            </label>
            <input type="password" {...register('password')} className="input-field w-full" />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Roles</label>
            <select
              {...register('roles')}
              multiple
              className="input-field w-full h-24"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <p className="text-white/30 text-xs mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="active" {...register('active')} className="w-4 h-4 rounded border-white/20 bg-white/5 text-tt-gold focus:ring-tt-gold focus:ring-offset-tt-black" />
            <label htmlFor="active" className="text-sm text-white/70">Account Active</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6 flex items-center gap-2">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
