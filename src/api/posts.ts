import {api} from './client';

export interface UserPost {
  id: number;
  user_id: number;
  image_path: string;
  caption?: string;
}

interface MyPostsResponse {
  status: string;
  data: UserPost[];
}

export async function fetchMyPosts(): Promise<UserPost[]> {
  const res = await api.get<MyPostsResponse>('/posts/my');
  return res.data.data ?? [];
}

/** ---------- FEED ---------- **/

export interface FeedPost {
  id: number;
  user_id: number;
  image_path: string;
  caption?: string;
  created_at?: string;
  pro_path?: string | null;
  name?: string | null;
}

export interface FeedResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  data: FeedPost[];
}

export async function fetchFeedPage(
  page: number,
  limit: number,
): Promise<FeedResponse> {
  const res = await api.get<FeedResponse>('/posts/feed', {
    params: {page, limit},
  });
  return res.data;
}

/** ---------- REACT ---------- **/

export interface PostReactor {
  user_id: number;
  name: string;
  pro_path: string; // relative image path
}

export interface GetReactorsResponse {
  status: string; // "success"
  page: number;
  limit: number;
  total: number;
  data: PostReactor[];
}

interface GetReactorsParams {
  post_id: number;
  page?: number;
  limit?: number;
}

export const fetchPostReactors = async ({
  post_id,
  page = 1,
  limit = 20,
}: GetReactorsParams): Promise<GetReactorsResponse> => {
  const query = `?post_id=${post_id}&page=${page}&limit=${limit}`;
  const res = await api.get<GetReactorsResponse>(`/posts/get-reacts${query}`);
  return res.data;
};

/** ---------- COMMENTS ---------- **/

export interface PostComment {
  user_id: number;
  name: string;
  pro_path: string; // relative image path
  comment_text: string;
  created_at: string; // ISO date string
}

export interface GetCommentsResponse {
  status: string; // "success"
  page: number;
  limit: number;
  total: number;
  data: PostComment[];
}

interface GetCommentsParams {
  post_id: number;
  page?: number;
  limit?: number;
}

export const fetchPostComments = async ({
  post_id,
  page = 1,
  limit = 20,
}: GetCommentsParams): Promise<GetCommentsResponse> => {
  const query = `?post_id=${post_id}&page=${page}&limit=${limit}`;
  const res = await api.get<GetCommentsResponse>(`/posts/get-comments${query}`);
  return res.data;
};

/** ---------- CREATE POST ---------- **/

export interface PostImageFile {
  uri: string;
  name?: string;
  type?: string;
}

export interface CreatePostPayload {
  caption?: string;
  image?: PostImageFile; // will map to `image_path`
}

export interface CreatePostResponse {
  status: string; // "success"
  message: string; // "Post created successfully"
}

export const createPost = async (
  payload: CreatePostPayload,
): Promise<CreatePostResponse> => {
  const formData = new FormData();

  if (payload.caption) {
    formData.append('caption', payload.caption);
  }

  if (payload.image?.uri) {
    formData.append('image_path', {
      uri: payload.image.uri,
      name: payload.image.name ?? 'post.jpg',
      type: payload.image.type ?? 'image/jpeg',
    } as any);
  }

  const {data} = await api.post<CreatePostResponse>('/posts/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export interface ReactPostResponse {
  status: string; // "success"
  message: string; // "Post reacted successfully"
}

/** POST /posts/react/{post_id} */
export const reactToPost = async (
  postId: number,
): Promise<ReactPostResponse> => {
  const {data} = await api.post<ReactPostResponse>(`/posts/react/${postId}`);
  return data;
};

export interface AddCommentPayload {
  post_id: number;
  comment: string;
}
export interface AddCommentResponse {
  status: string; // "success"
  message: string; // "Commented successfully"
}

/** POST /posts/add-comment */
export async function addComment(
  payload: AddCommentPayload,
): Promise<AddCommentResponse> {
  // uses the shared axios `api` instance (interceptors included)
  const {data} = await api.post<AddCommentResponse>('/posts/add-comment', {
    post_id: payload.post_id,
    comment: payload.comment,
  });
  return data;
}
