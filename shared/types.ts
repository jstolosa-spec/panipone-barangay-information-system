export type UserRole = 'resident' | 'secretary' | 'kagawad' | 'captain' | 'admin';
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}
export interface DirectoryPost {
  id: string;
  title: string;
  description: string;
  category: 'service' | 'business' | 'skill';
  ownerId: string;
  ownerName: string;
  contact: string;
  image?: string;
  createdAt: number;
}
export interface DocumentRequest {
  id: string;
  residentId: string;
  residentName: string;
  type: 'clearance' | 'certificate' | 'indigency' | 'permit';
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  purpose: string;
  attachments: string[]; // Mocked as metadata string URLs
  createdAt: number;
  updatedAt: number;
}
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isPinned: boolean;
  isPublic: boolean;
  createdAt: number;
}