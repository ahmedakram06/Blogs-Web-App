export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  author: User;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string; // Optional if you want to show "edited at"
}

export interface CreateBlogDto {
  title: string;
  content: string;
  isPublic: boolean;
}

export interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  blogId: string;
  parentId?: string;
  parent?: Comment; // For displaying "replying to"
  replies: Comment[];
  createdAt: string;
}

export interface CreateCommentDto {
  content: string;
  blogId: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface ChatMessage {
  roomName: string;
  senderId: string;
  receiverId: string;
  message: string;
  timeSent: number;
}
