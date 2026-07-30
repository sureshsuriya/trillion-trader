import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fileUrl: z.string().url('Invalid URL for file'),
  coverImageUrl: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  isFree: z.boolean(),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

export default function ManageResources() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['resources', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/resources?page=${page}&size=10&search=${debouncedSearch}`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { type: 'PDF', isFree: true },
  });

  const openAddModal = () => {
    setEditingResource(null);
    reset({
      title: '', description: '', fileUrl: '', coverImageUrl: '',
      type: 'PDF', isFree: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (res: any) => {
    setEditingResource(res);
    reset({
      title: res.title,
      description: res.description || '',
      fileUrl: res.fileUrl,
      coverImageUrl: res.coverImageUrl || '',
      type: res.type,
      isFree: res.isFree,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: ResourceFormValues) => {
      if (editingResource) return apiClient.put(`/resources/${editingResource.id}`, values);
      return apiClient.post('/resources', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success(editingResource ? 'Resource updated successfully' : 'Resource created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save resource');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/resources/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource deleted successfully');
    },
  });

  const onSubmit = (values: ResourceFormValues) => saveMutation.mutate(values);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Resources</h1>
          <p className="text-white/50 text-sm">Upload and manage educational PDFs and downloads.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search resources..."
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
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Access</th>
                <th className="px-6 py-4 font-medium">Downloads</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...
                  </td>
                </tr>
              ) : data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">No resources found.</td>
                </tr>
              ) : (
                data?.content?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {r.coverImageUrl ? (
                          <img src={r.coverImageUrl} alt="Cover" className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{r.title}</div>
                          <div className="text-xs text-white/40 line-clamp-1 max-w-xs">{r.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{r.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${r.isFree ? 'bg-green-500/10 text-green-400' : 'bg-tt-gold/10 text-tt-gold'}`}>
                        {r.isFree ? 'Free' : 'Premium'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white/70">
                        <Download className="w-3.5 h-3.5" /> {r.downloadCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(r)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingResource ? 'Edit Resource' : 'Add Resource'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Title</label>
            <input {...register('title')} className="input-field w-full" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-1">Description</label>
            <textarea {...register('description')} className="input-field w-full h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">File URL</label>
              <input {...register('fileUrl')} className="input-field w-full" placeholder="https://..." />
              {errors.fileUrl && <p className="text-red-400 text-xs mt-1">{errors.fileUrl.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Cover Image URL</label>
              <input {...register('coverImageUrl')} className="input-field w-full" placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Type</label>
              <select {...register('type')} className="input-field w-full">
                <option value="PDF">PDF Guide</option>
                <option value="CHEATSHEET">Cheat Sheet</option>
                <option value="INDICATOR">Custom Indicator</option>
                <option value="SPREADSHEET">Spreadsheet</option>
              </select>
            </div>
            <div className="flex items-end mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isFree')} className="w-4 h-4 rounded border-white/20 bg-white/5 text-tt-gold focus:ring-tt-gold" />
                <span className="text-sm text-white/70">Is Free Resource?</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6">
              {saveMutation.isPending ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
