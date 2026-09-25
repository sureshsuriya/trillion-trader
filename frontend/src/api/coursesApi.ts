import { apiClient } from './axios'

export interface QuizQuestion {
  question: string
  options: string[]
  correctOptionIndex: number
  explanation: string
}

export interface Lesson {
  id: string
  title: string
  slug: string
  description?: string
  videoUrl?: string
  duration?: string
  contentHtml?: string
  freePreview: boolean
  orderIndex: number
  quiz?: QuizQuestion[]
}

export interface CourseModule {
  id: string
  title: string
  description?: string
  orderIndex: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnailUrl: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category: 'FOREX' | 'STOCKS' | 'OPTIONS' | 'PROP_FIRM' | 'TECHNICAL_ANALYSIS'
  accessType: 'FREE' | 'PREMIUM'
  duration: string
  rating: number
  totalStudents: number
  published: boolean
  instructorName: string
  instructorTitle: string
  instructorAvatar: string
  modules: CourseModule[]
  createdAt?: string
  updatedAt?: string
}

export interface UserProgress {
  id?: string
  userId: string
  courseId: string
  completedLessonIds: string[]
  lastAccessedLessonId?: string
  progressPercentage: number
  completed: boolean
}

export const coursesApi = {
  getAllCourses: async (): Promise<Course[]> => {
    const res = await apiClient.get<{ data: Course[] }>('/courses')
    return res.data.data
  },
  getCourseBySlug: async (slug: string): Promise<Course> => {
    const res = await apiClient.get<{ data: Course }>(`/courses/slug/${slug}`)
    return res.data.data
  },
  getUserProgress: async (courseId: string, userId: string = 'guest-user'): Promise<UserProgress> => {
    const res = await apiClient.get<{ data: UserProgress }>(`/courses/${courseId}/progress`, {
      params: { userId },
    })
    return res.data.data
  },
  completeLesson: async (courseId: string, lessonId: string, userId: string = 'guest-user'): Promise<UserProgress> => {
    const res = await apiClient.post<{ data: UserProgress }>(`/courses/${courseId}/progress`, {
      userId,
      lessonId,
    })
    return res.data.data
  },
}
