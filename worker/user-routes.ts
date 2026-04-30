import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, PostEntity, RequestEntity, AnnouncementEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, DirectoryPost, DocumentRequest, Announcement } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
  // ANNOUNCEMENTS
  app.get('/api/announcements', async (c) => {
    await AnnouncementEntity.ensureSeed(c.env);
    const list = await AnnouncementEntity.list(c.env);
    // Sort by pinned then by date
    const sorted = [...list.items].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
    return ok(c, { items: sorted });
  });
  app.post('/api/announcements', async (c) => {
    const data = await c.req.json() as Partial<Announcement>;
    if (!data.title || !data.content) return bad(c, 'Title and content required');
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
  });
  // DIRECTORY POSTS
  app.get('/api/posts', async (c) => {
    await PostEntity.ensureSeed(c.env);
    const category = c.req.query('category');
    const page = await PostEntity.list(c.env);
    if (category && category !== 'all') {
      page.items = page.items.filter(p => p.category === category);
    }
    return ok(c, page);
  });
  app.post('/api/posts', async (c) => {
    const data = await c.req.json() as Partial<DirectoryPost>;
    if (!data.title || !data.contact) return bad(c, 'Title and contact required');
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
  });
  // DOCUMENT REQUESTS
  app.get('/api/requests', async (c) => {
    await RequestEntity.ensureSeed(c.env);
    const residentId = c.req.query('residentId');
    const page = await RequestEntity.list(c.env);
    if (residentId) {
      page.items = page.items.filter(r => r.residentId === residentId);
    }
    return ok(c, page);
  });
  app.post('/api/requests', async (c) => {
    const data = await c.req.json() as Partial<DocumentRequest>;
    if (!data.type || !data.purpose || !data.residentId) return bad(c, 'Missing required fields');
    const request: DocumentRequest = {
      id: crypto.randomUUID(),
      residentId: data.residentId,
      residentName: data.residentName || 'Resident',
      type: data.type,
      status: 'pending',
      purpose: data.purpose,
      attachments: data.attachments || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return ok(c, await RequestEntity.create(c.env, request));
  });
  app.put('/api/requests/:id', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json() as { status: DocumentRequest['status'] };
    const entity = new RequestEntity(c.env, id);
    if (!await entity.exists()) return notFound(c);
    await entity.patch({ status, updatedAt: Date.now() });
    return ok(c, await entity.getState());
  });
}