import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  displayOrder: z.coerce.number().min(0),
});

type FAQFormValues = z.infer<typeof faqSchema>;

export default function ManageFAQ() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['faqs', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/faqs?page=${page}&size=10&search=${debouncedSearch}`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: { displayOrder: 0, category: 'General' },
  });

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      question: '', answer: '', category: 'General', displayOrder: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    reset({
      question: item.question,
      answer: item.answer,
      category: item.category || 'General',
      displayOrder: item.displayOrder,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: FAQFormValues) => {
      if (editingItem) return apiClient.put(`/faqs/${editingItem.id}`, values);
      return apiClient.post('/faqs', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(editingItem ? 'FAQ updated successfully' : 'FAQ created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/faqs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ deleted successfully');
    },
  });

  const onSubmit = (values: FAQFormValues) => saveMutation.mutate(values);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage FAQs</h1>
          <p className="text-white/50 text-sm">Update the Frequently Asked Questions list.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search questions..."
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
                <th className="px-6 py-4 font-medium w-12">#</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium w-1/2">Question</th>
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
                  <td colSpan={4} className="px-6 py-8 text-center text-white/50">No FAQs found.</td>
                </tr>
              ) : (
                data?.content?.map((q: any) => (
                  <tr key={q.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-white/40">{q.displayOrder}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-white/70">
                        {q.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white mb-1 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-tt-gold mt-0.5 flex-shrink-0" />
                        {q.question}
                      </div>
                      <div className="text-white/50 text-xs line-clamp-1 ml-6">{q.answer}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(q)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit FAQ' : 'Add FAQ'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Question</label>
            <input {...register('question')} className="input-field w-full" />
            {errors.question && <p className="text-red-400 text-xs mt-1">{errors.question.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Answer</label>
            <textarea {...register('answer')} className="input-field w-full h-32" />
            {errors.answer && <p className="text-red-400 text-xs mt-1">{errors.answer.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Category</label>
              <input {...register('category')} className="input-field w-full" placeholder="e.g. General, Payments" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Display Order</label>
              <input type="number" {...register('displayOrder')} className="input-field w-full" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6">
              {saveMutation.isPending ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
