import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

const settingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
});

type SettingFormValues = z.infer<typeof settingSchema>;

export default function ManageSettings() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['settings', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/settings?page=${page}&size=10&search=${debouncedSearch}`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
  });

  const openAddModal = () => {
    setEditingItem(null);
    reset({ key: '', value: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    reset({
      key: item.key,
      value: item.value,
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: SettingFormValues) => {
      if (editingItem) return apiClient.put(`/settings/${editingItem.key}`, values);
      return apiClient.post('/settings', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(editingItem ? 'Setting updated successfully' : 'Setting created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save setting');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => apiClient.delete(`/settings/${key}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Setting deleted successfully');
    },
  });

  const onSubmit = (values: SettingFormValues) => saveMutation.mutate(values);

  const handleDelete = (key: string) => {
    if (window.confirm(`Are you sure you want to delete the setting '${key}'?`)) {
      deleteMutation.mutate(key);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Website Settings</h1>
          <p className="text-white/50 text-sm">Manage global key-value configuration variables.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Setting
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search keys..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-tt-gold"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-white/60 text-xs uppercase">
                <th className="px-6 py-4 font-medium">Key</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-white/50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...
                  </td>
                </tr>
              ) : data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-white/50">No settings found.</td>
                </tr>
              ) : (
                data?.content?.map((s: any) => (
                  <tr key={s.key} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="font-mono text-tt-gold text-xs">{s.key}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white truncate max-w-[200px]">{s.value}</div>
                    </td>
                    <td className="px-6 py-4 text-white/50 text-xs">{s.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(s)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.key)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Setting' : 'Add Setting'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Key (Identifier)</label>
            <input {...register('key')} disabled={!!editingItem} className="input-field w-full font-mono text-sm disabled:opacity-50" placeholder="e.g. SITE_MAINTENANCE_MODE" />
            {errors.key && <p className="text-red-400 text-xs mt-1">{errors.key.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Value</label>
            <textarea {...register('value')} className="input-field w-full font-mono text-sm h-24" />
            {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Description</label>
            <input {...register('description')} className="input-field w-full" placeholder="What does this setting control?" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6">
              {saveMutation.isPending ? 'Saving...' : 'Save Setting'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
