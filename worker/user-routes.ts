import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, PostEntity, RequestEntity, AnnouncementEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { User, DirectoryPost, DocumentRequest, Announcement, DashboardStats } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // STATS
  app.get('/api/stats', async (c) => {
    // Fetch a larger batch for more accurate stats in demo
    const [users, posts, requests] = await Promise.all([
      UserEntity.list(c.env, null, 100),
      PostEntity.list(c.env, null, 100),
      RequestEntity.list(c.env, null, 100)
    ]);
    const stats: DashboardStats = {
      totalUsers: users.items.length,
      totalPosts: posts.items.length,
      totalRequests: requests.items.length,
      pendingRequests: requests.items.filter(r => r.status === 'pending').length,
      approvedRequests: requests.items.filter(r => r.status === 'approved').length,
      rejectedRequests: requests.items.filter(r => r.status === 'rejected').length,
    };
    return ok(c, stats);
  });
  // USERS MANAGEMENT
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const role = c.req.query('role');
    const page = await UserEntity.list(c.env, null, 100);
    if (role && role !== 'all') {
      page.items = page.items.filter(u => u.role === role);
    }
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    try {
      const data = await c.req.json() as Partial<User>;
      if (!data.name || !data.role) return bad(c, 'User name and role are required for registration');
      const newUser: User = {
        id: crypto.randomUUID(),
        name: data.name,
        role: data.role,
        email: data.email || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      };
      return ok(c, await UserEntity.create(c.env, newUser));
    } catch (e) {
      return bad(c, 'Invalid user data provided');
    }
  });
  app.put('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    try {
      const data = await c.req.json() as Partial<User>;
      const entity = new UserEntity(c.env, id);
      if (!await entity.exists()) return notFound(c, 'User profile not found');
      await entity.patch(data);
      return ok(c, await entity.getState());
    } catch (e) {
      return bad(c, 'Failed to update user profile');
    }
  });
  app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await UserEntity.delete(c.env, id);
    return deleted ? ok(c, { id, message: 'User successfully removed' }) : notFound(c, 'User not found');
  });
  // ANNOUNCEMENTS
  app.get('/api/announcements', async (c) => {
    await AnnouncementEntity.ensureSeed(c.env);
    const list = await AnnouncementEntity.list(c.env, null, 50);
    const sorted = [...list.items].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
    return ok(c, { items: sorted });
  });
  app.post('/api/announcements', async (c) => {
    try {
      const data = await c.req.json() as Partial<Announcement>;
      if (!data.title || !data.content) return bad(c, 'Announcement title and content are mandatory');
      const announcement: Announcement = {
        id: crypto.randomUUID(),
        title: data.title,
        content: data.content,
        authorId: data.authorId || 'system',
        authorName: data.authorName || 'System',
        authorRole: data.authorRole || 'admin',
        isPinned: !!data.isPinned,
        isPublic: true,
        createdAt: Date.now()
      };
      return ok(c, await AnnouncementEntity.create(c.env, announcement));
    } catch (e) {
      return bad(c, 'Failed to create announcement');
    }
  });
  // DIRECTORY POSTS
  app.get('/api/posts', async (c) => {
    await PostEntity.ensureSeed(c.env);
    const category = c.req.query('category');
    const ownerId = c.req.query('ownerId');
    const page = await PostEntity.list(c.env, null, 100);
    if (category && category !== 'all') {
      page.items = page.items.filter(p => p.category === category);
    }
    if (ownerId) {
      page.items = page.items.filter(p => p.ownerId === ownerId);
    }
    return ok(c, page);
  });
  app.post('/api/posts', async (c) => {
    try {
      const data = await c.req.json() as Partial<DirectoryPost>;
      if (!data.title || !data.contact) return bad(c, 'Listing title and contact information are required');
      const post: DirectoryPost = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description || '',
        category: data.category || 'service',
        ownerId: data.ownerId || 'unknown',
        ownerName: data.ownerName || 'Anonymous',
        contact: data.contact,
        createdAt: Date.now()
      };
      return ok(c, await PostEntity.create(c.env, post));
    } catch (e) {
      return bad(c, 'Invalid listing data');
    }
  });
  // DOCUMENT REQUESTS
  app.get('/api/requests', async (c) => {
    await RequestEntity.ensureSeed(c.env);
    const residentId = c.req.query('residentId');
    const page = await RequestEntity.list(c.env, null, 100);
    const sorted = [...page.items].sort((a, b) => b.createdAt - a.createdAt);
    if (residentId) {
      return ok(c, { items: sorted.filter(r => r.residentId === residentId) });
    }
    return ok(c, { items: sorted });
  });
  app.post('/api/requests', async (c) => {
    try {
      const data = await c.req.json() as Partial<DocumentRequest>;
      if (!data.type || !data.purpose || !data.residentId) return bad(c, 'Missing required document request parameters');
      const request: DocumentRequest = {
        id: crypto.randomUUID(),
        residentId: data.residentId,
        residentName: data.residentName || 'Resident',
        type: data.type as DocumentRequest['type'],
        status: 'pending',
        purpose: data.purpose,
        attachments: data.attachments || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      return ok(c, await RequestEntity.create(c.env, request));
    } catch (e) {
      return bad(c, 'Failed to submit document request');
    }
  });
  app.put('/api/requests/:id', async (c) => {
    const id = c.req.param('id');
    try {
      const { status } = await c.req.json() as { status: DocumentRequest['status'] };
      const entity = new RequestEntity(c.env, id);
      if (!await entity.exists()) return notFound(c, 'Document request not found');
      // Always update the updatedAt timestamp on status change
      await entity.patch({ status, updatedAt: Date.now() });
      return ok(c, await entity.getState());
    } catch (e) {
      return bad(c, 'Failed to update request status');
    }
  });
}