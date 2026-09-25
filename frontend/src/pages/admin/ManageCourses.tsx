import { useState, useEffect } from 'react'
import { coursesApi, type Course } from '../../api/coursesApi'
import { Button } from '../../components/ui/Button'

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coursesApi
      .getAllCourses()
      .then((data) => setCourses(data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Academy Courses</h1>
          <p className="text-white/50 text-xs mt-1">Create, update, and organize learning modules & video lessons.</p>
        </div>
        <Button variant="gold" size="sm">
          + Create New Course
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/40 font-mono text-sm">Loading courses...</div>
      ) : (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-xs text-white/40 uppercase font-mono border-b border-white/10">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Access</th>
                <th className="p-4">Students</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={c.thumbnailUrl} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-xs text-white/40 font-mono">{c.duration}</div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono">{c.category}</td>
                  <td className="p-4 text-xs font-mono">{c.level}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gold/20 text-gold font-bold">
                      {c.accessType}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono">{c.totalStudents}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Lessons</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
