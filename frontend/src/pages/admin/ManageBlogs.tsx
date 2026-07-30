import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { apiClient } from '../../api/axios';
import { Modal } from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../contexts/AuthContext';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  published: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function ManageBlogs() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/blog-categories');
      return res.data.data;
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get(`/blogs?page=${page}&size=10&search=${debouncedSearch}&publicOnly=false`);
      return res.data.data;
    },
  });

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: { published: false },
  });

  const watchTitle = watch('title');

  // Auto-generate slug from title
  useMemo(() => {
    if (!editingBlog && watchTitle) {
      const slug = watchTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [watchTitle, editingBlog, setValue]);

  const openAddModal = () => {
    setEditingBlog(null);
    reset({
      title: '', slug: '', content: '', excerpt: '',
      coverImageUrl: '', categoryId: categories?.[0]?.id || '',
      tags: '', published: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlog(blog);
    reset({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      coverImageUrl: blog.coverImageUrl || '',
      categoryId: blog.categoryId,
      tags: blog.tags?.join(', ') || '',
      published: blog.published,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const payload = {
        ...values,
        authorId: user?.id,
        tags: values.tags ? values.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editingBlog) return apiClient.put(`/blogs/${editingBlog.id}`, payload);
      return apiClient.post('/blogs', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save blog post');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully');
    },
  });

  const onSubmit = (values: BlogFormValues) => saveMutation.mutate(values);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Blogs</h1>
          <p className="text-white/50 text-sm">Write and manage educational content.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search posts..."
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
                <th className="px-6 py-4 font-medium">Post</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Views</th>
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
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">No posts found.</td>
                </tr>
              ) : (
                data?.content?.map((b: any) => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.coverImageUrl ? (
                          <img src={b.coverImageUrl} alt="Cover" className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{b.title}</div>
                          <div className="text-xs text-white/40">{b.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {categories?.find((c: any) => c.id === b.categoryId)?.name || b.categoryId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${b.published ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/70'}`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">{b.viewCount || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(b)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBlog ? 'Edit Post' : 'New Post'} maxWidth="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Title</label>
              <input {...register('title')} className="input-field w-full" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Slug</label>
              <input {...register('slug')} className="input-field w-full bg-black/20" />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Category</label>
              <select {...register('categoryId')} className="input-field w-full">
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Cover Image URL</label>
              <input {...register('coverImageUrl')} className="input-field w-full" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Excerpt (Short description)</label>
            <textarea {...register('excerpt')} className="input-field w-full h-20" />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Content</label>
            <div className="bg-white text-black rounded-lg overflow-hidden">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ReactQuill 
                    theme="snow" 
                    value={field.value} 
                    onChange={field.onChange}
                    modules={modules}
                    className="h-64 mb-12"
                  />
                )}
              />
            </div>
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Tags (comma separated)</label>
            <input {...register('tags')} className="input-field w-full" placeholder="Forex, Education, Trading..." />
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <input type="checkbox" id="published" {...register('published')} className="w-4 h-4 rounded border-white/20 bg-white/5 text-tt-gold focus:ring-tt-gold" />
            <label htmlFor="published" className="text-sm font-medium text-white">Publish this post immediately</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2 px-6">
              {saveMutation.isPending ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
