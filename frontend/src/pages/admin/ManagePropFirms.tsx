import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

const propFirmSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url('Invalid URL'),
  referralLink: z.string().optional(),
  rating: z.coerce.number().min(0).max(5),
  maxFunding: z.string().optional(),
  profitSplit: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  challengeTypes: z.string().optional(),
  recommended: z.boolean(),
});

type PropFirmFormValues = z.infer<typeof propFirmSchema>;

export default function ManagePropFirms() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFirm, setEditingFirm] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['propFirms', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/prop-firms?page=${page}&size=10&search=${debouncedSearch}`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PropFirmFormValues>({
    resolver: zodResolver(propFirmSchema),
    defaultValues: { rating: 5, recommended: false },
  });

  const openAddModal = () => {
    setEditingFirm(null);
    reset({
      name: '', logoUrl: '', websiteUrl: '', referralLink: '',
      rating: 5, maxFunding: '', profitSplit: '',
      pros: '', cons: '', challengeTypes: '', recommended: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (firm: any) => {
    setEditingFirm(firm);
    reset({
      name: firm.name,
      logoUrl: firm.logoUrl || '',
      websiteUrl: firm.websiteUrl,
      referralLink: firm.referralLink || '',
      rating: firm.rating,
      maxFunding: firm.maxFunding || '',
      profitSplit: firm.profitSplit || '',
      pros: firm.pros?.join(', ') || '',
      cons: firm.cons?.join(', ') || '',
      challengeTypes: firm.challengeTypes?.join(', ') || '',
      recommended: firm.recommended,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: PropFirmFormValues) => {
      const payload = {
        ...values,
        pros: values.pros ? values.pros.split(',').map(s => s.trim()).filter(Boolean) : [],
        cons: values.cons ? values.cons.split(',').map(s => s.trim()).filter(Boolean) : [],
        challengeTypes: values.challengeTypes ? values.challengeTypes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (editingFirm) return apiClient.put(`/prop-firms/${editingFirm.id}`, payload);
      return apiClient.post('/prop-firms', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propFirms'] });
      toast.success(editingFirm ? 'Prop Firm updated successfully' : 'Prop Firm created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save prop firm');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/prop-firms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propFirms'] });
      toast.success('Prop Firm deleted successfully');
    },
  });

  const onSubmit = (values: PropFirmFormValues) => saveMutation.mutate(values);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prop firm?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Prop Firms</h1>
          <p className="text-white/50 text-sm">List and review proprietary trading firms.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Prop Firm
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search prop firms..."
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
                <th className="px-6 py-4 font-medium">Prop Firm</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Max Funding</th>
                <th className="px-6 py-4 font-medium">Profit Split</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...
                  </td>
                </tr>
              ) : data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/50">No prop firms found.</td>
                </tr>
              ) : (
                data?.content?.map((f: any) => (
                  <tr key={f.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-white">{f.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-tt-gold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {f.rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{f.maxFunding || '-'}</td>
                    <td className="px-6 py-4 text-white/70">{f.profitSplit || '-'}</td>
                    <td className="px-6 py-4">
                      {f.recommended && <span className="px-2 py-1 rounded text-xs bg-tt-gold/10 text-tt-gold">Recommended</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(f)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(f.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFirm ? 'Edit Prop Firm' : 'Add Prop Firm'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Name</label>
              <input {...register('name')} className="input-field w-full" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Rating (0-5)</label>
              <input type="number" step="0.1" {...register('rating')} className="input-field w-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Website URL</label>
              <input {...register('websiteUrl')} className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Referral Link</label>
              <input {...register('referralLink')} className="input-field w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Max Funding</label>
              <input {...register('maxFunding')} className="input-field w-full" placeholder="$400,000" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Profit Split</label>
              <input {...register('profitSplit')} className="input-field w-full" placeholder="Up to 90%" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Pros (comma separated)</label>
            <input {...register('pros')} className="input-field w-full" placeholder="No time limits, scaling plan..." />
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-1">Cons (comma separated)</label>
            <input {...register('cons')} className="input-field w-full" placeholder="Trailing drawdown..." />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Challenge Types (comma separated)</label>
            <input {...register('challengeTypes')} className="input-field w-full" placeholder="1-Step, 2-Step..." />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="recommended" {...register('recommended')} className="w-4 h-4 rounded border-white/20 bg-white/5 text-tt-gold focus:ring-tt-gold" />
            <label htmlFor="recommended" className="text-sm text-white/70">Mark as Recommended</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6">
              {saveMutation.isPending ? 'Saving...' : 'Save Prop Firm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
