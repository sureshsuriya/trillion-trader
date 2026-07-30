import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2, Star, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

const testimonialSchema = z.object({
  authorName: z.string().min(1, 'Author name is required'),
  authorRole: z.string().optional(),
  avatarUrl: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  rating: z.coerce.number().min(1).max(5),
  featured: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function ManageTestimonials() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/testimonials?page=${page}&size=10&search=${debouncedSearch}`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 5, featured: false },
  });

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      authorName: '', authorRole: '', avatarUrl: '', content: '',
      rating: 5, featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    reset({
      authorName: item.authorName,
      authorRole: item.authorRole || '',
      avatarUrl: item.avatarUrl || '',
      content: item.content,
      rating: item.rating,
      featured: item.featured,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: TestimonialFormValues) => {
      if (editingItem) return apiClient.put(`/testimonials/${editingItem.id}`, values);
      return apiClient.post('/testimonials', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(editingItem ? 'Testimonial updated successfully' : 'Testimonial created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully');
    },
  });

  const onSubmit = (values: TestimonialFormValues) => saveMutation.mutate(values);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Testimonials</h1>
          <p className="text-white/50 text-sm">Update student reviews and social proof.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search reviews..."
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
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Review</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Featured</th>
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
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">No testimonials found.</td>
                </tr>
              ) : (
                data?.content?.map((t: any) => (
                  <tr key={t.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {t.avatarUrl ? (
                          <img src={t.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{t.authorName}</div>
                          <div className="text-xs text-white/40">{t.authorRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/70 line-clamp-2 max-w-xs">{t.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-tt-gold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {t.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.featured && <span className="px-2 py-1 rounded text-xs bg-tt-gold/10 text-tt-gold">Featured</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(t)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Review' : 'Add Review'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Author Name</label>
              <input {...register('authorName')} className="input-field w-full" />
              {errors.authorName && <p className="text-red-400 text-xs mt-1">{errors.authorName.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Author Role</label>
              <input {...register('authorRole')} className="input-field w-full" placeholder="e.g. Funded Trader" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Avatar URL</label>
              <input {...register('avatarUrl')} className="input-field w-full" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Rating (1-5)</label>
              <input type="number" {...register('rating')} className="input-field w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Review Content</label>
            <textarea {...register('content')} className="input-field w-full h-24" />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 rounded border-white/20 bg-white/5 text-tt-gold focus:ring-tt-gold" />
            <label htmlFor="featured" className="text-sm text-white/70">Mark as Featured (shows on Homepage)</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6">
              {saveMutation.isPending ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
