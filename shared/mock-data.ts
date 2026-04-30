import type { User, DirectoryPost, DocumentRequest, Announcement } from './types';
export const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'System Admin', role: 'admin', email: 'admin@panipuan.gov' },
  { id: 'capt-1', name: 'Capt. Juan Dela Cruz', role: 'captain', email: 'captain@panipuan.gov' },
  { id: 'sec-1', name: 'Maria Santos', role: 'secretary', email: 'secretary@panipuan.gov' },
  { id: 'kag-1', name: 'Kgd. Roberto Reyes', role: 'kagawad', email: 'roberto@panipuan.gov' },
  { id: 'res-1', name: 'Pedro Penduko', role: 'resident', email: 'pedro@resident.com' },
];
export const MOCK_POSTS: DirectoryPost[] = [
  {
    id: 'p1',
    title: 'Expert Electrician',
    description: 'Residential wiring and repair services with 10 years experience.',
    category: 'service',
    ownerId: 'res-1',
    ownerName: 'Pedro Penduko',
    contact: '0912-345-6789',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'p2',
    title: 'Panipuan Sari-Sari Store',
    description: 'Fresh vegetables, grocery items, and reloading station.',
    category: 'business',
    ownerId: 'res-2',
    ownerName: 'Aling Nena',
    contact: '0912-999-8888',
    createdAt: Date.now() - 86400000 * 2,
  }
];
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Upcoming Clean-up Drive',
    content: 'Join us this Saturday for our monthly community cleaning event at the Plaza.',
    authorId: 'capt-1',
    authorName: 'Capt. Juan Dela Cruz',
    authorRole: 'captain',
    isPinned: true,
    isPublic: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'a2',
    title: 'New Health Center Schedule',
    content: 'The barangay health center will now be open from 8AM to 5PM daily starting next week.',
    authorId: 'sec-1',
    authorName: 'Maria Santos',
    authorRole: 'secretary',
    isPinned: false,
    isPublic: true,
    createdAt: Date.now() - 7200000,
  }
];
export const MOCK_REQUESTS: DocumentRequest[] = [
  {
    id: 'req-1',
    residentId: 'res-1',
    residentName: 'Pedro Penduko',
    type: 'clearance',
    status: 'pending',
    purpose: 'Job Application',
    attachments: [],
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'req-2',
    residentId: 'res-3',
    residentName: 'Liza Soberano',
    type: 'indigency',
    status: 'approved',
    purpose: 'Educational Assistance',
    attachments: [],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 43200000,
  }
];