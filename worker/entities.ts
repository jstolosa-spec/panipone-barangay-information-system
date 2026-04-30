import { IndexedEntity } from "./core-utils";
import type { User, DirectoryPost, DocumentRequest, Announcement } from "@shared/types";
import { MOCK_USERS, MOCK_POSTS, MOCK_REQUESTS, MOCK_ANNOUNCEMENTS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", role: "resident" };
  static seedData = MOCK_USERS;
}
export class PostEntity extends IndexedEntity<DirectoryPost> {
  static readonly entityName = "post";
  static readonly indexName = "posts";
  static readonly initialState: DirectoryPost = {
    id: "",
    title: "",
    description: "",
    category: "service",
    ownerId: "",
    ownerName: "",
    contact: "",
    createdAt: 0
  };
  static seedData = MOCK_POSTS;
}
export class RequestEntity extends IndexedEntity<DocumentRequest> {
  static readonly entityName = "request";
  static readonly indexName = "requests";
  static readonly initialState: DocumentRequest = {
    id: "",
    residentId: "",
    residentName: "",
    type: "clearance",
    status: "pending",
    purpose: "",
    attachments: [],
    createdAt: 0,
    updatedAt: 0
  };
  static seedData = MOCK_REQUESTS;
}
export class AnnouncementEntity extends IndexedEntity<Announcement> {
  static readonly entityName = "announcement";
  static readonly indexName = "announcements";
  static readonly initialState: Announcement = {
    id: "",
    title: "",
    content: "",
    authorId: "",
    authorName: "",
    authorRole: "resident",
    isPinned: false,
    isPublic: true,
    createdAt: 0
  };
  static seedData = MOCK_ANNOUNCEMENTS;
}