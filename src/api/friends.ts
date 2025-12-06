import {api} from './client';

/* =========================
   All Friends
   ========================= */

export interface Friend {
  user_id: number;
  name: string;
  pro_path?: string | null; // relative path to avatar, e.g. "uploads/images/....png"
}

export interface GetAllFriendsResponse {
  status: string; // "success"
  data: Friend[]; // friends list
}

/** GET /users/all-friends */
export async function fetchAllFriends(): Promise<GetAllFriendsResponse> {
  const res = await api.get<GetAllFriendsResponse>('/users/all-friends');
  return res.data;
}

/** Convenience: returns just the array of friends. */
export async function fetchFriendList(): Promise<Friend[]> {
  const data = await fetchAllFriends();
  return data.data || [];
}

/* =========================
   Friend Suggestions
   ========================= */

export interface FriendSuggestion {
  id: number; // note: suggestions use `id` (not user_id)
  name: string;
  country?: string | null;
  city?: string | null;
  pro_path?: string | null; // relative path to avatar
}

export interface FriendSuggestionParams {
  gender?: string;
  country?: string;
  city?: string;
  religion?: string;
  religion_section?: string;
  marital_status?: string;
  profession?: string;
  education?: string;
  ethnicity?: string;
  body_type?: string;
  hair_color?: string;
  eye_color?: string;
  skin_color?: string;
  page?: number; // optional pagination
  limit?: number; // optional pagination
}

export interface FriendSuggestionResponse {
  status: string; // "success"
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  data: FriendSuggestion[];
}

/** GET /users/friend-suggestions */
export async function fetchFriendSuggestions(
  params: FriendSuggestionParams = {},
): Promise<FriendSuggestionResponse> {
  const res = await api.get<FriendSuggestionResponse>(
    '/users/friend-suggestions',
    {params},
  );
  return res.data;
}

/** Convenience: just the array of suggestions. */
export async function fetchFriendSuggestionList(
  params: FriendSuggestionParams = {},
): Promise<FriendSuggestion[]> {
  const data = await fetchFriendSuggestions(params);
  return data.data || [];
}

/* =========================
   Send Friend Request
   ========================= */

export interface SendFriendRequestBody {
  receiver_id: number;
}
export interface SendFriendRequestResponse {
  status: string; // "success"
  message: string; // "Friend request sent"
}

/** POST /users/send-request */
export async function sendFriendRequest(
  receiverId: number,
): Promise<SendFriendRequestResponse> {
  const payload: SendFriendRequestBody = {receiver_id: receiverId};
  const res = await api.post<SendFriendRequestResponse>(
    '/users/send-request',
    payload,
  );
  return res.data;
}

/* =========================
   Get Friend Requests
   ========================= */

export interface FriendRequestItem {
  request_id: number;
  sender_id: number; // from backend
  name: string;
  pro_path?: string | null; // relative path to avatar
}

export interface GetFriendRequestsResponse {
  status: string; // "success"
  data: FriendRequestItem[];
}

/** GET /users/friend-requests */
export async function fetchFriendRequests(): Promise<GetFriendRequestsResponse> {
  const res = await api.get<GetFriendRequestsResponse>(
    '/users/friend-requests',
  );
  return res.data;
}

/** Convenience: just the array of requests. */
export async function fetchFriendRequestList(): Promise<FriendRequestItem[]> {
  const data = await fetchFriendRequests();
  return data.data || [];
}

/* =========================
   Get Sent Friend Requests
   ========================= */

export interface SentRequestItem {
  request_id: number;
  receiver_id: number; // from backend
  name: string;
  pro_path?: string | null; // relative path to avatar
}

export interface GetSentFriendRequestsResponse {
  status: string; // "success"
  data: SentRequestItem[];
}

/** GET /users/sent-friend-requests */
export async function fetchSentFriendRequests(): Promise<GetSentFriendRequestsResponse> {
  const res = await api.get<GetSentFriendRequestsResponse>(
    '/users/sent-requests',
  );
  return res.data;
}

/** Convenience: just the array of sent requests. */
export async function fetchSentFriendRequestList(): Promise<SentRequestItem[]> {
  const data = await fetchSentFriendRequests();
  return data.data || [];
}

/* =========================
   Accept Friend Request
   ========================= */

export interface AcceptFriendRequestBody {
  id: number; // request_id
}
export interface AcceptFriendRequestResponse {
  status: string; // "success"
  message: string; // "Friend request accepted"
}

/** PUT /users/accept-request */
export async function acceptFriendRequest(
  requestId: number,
): Promise<AcceptFriendRequestResponse> {
  const payload: AcceptFriendRequestBody = {id: requestId};
  const res = await api.put<AcceptFriendRequestResponse>(
    '/users/accept-request',
    payload,
  );
  return res.data;
}

/* =========================
   Friend Profile
   ========================= */

export interface FriendProfile {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  gender?: string | null;
  dob?: string | null; // ISO string
  country?: string | null;
  city?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  ethnicity?: string | null;
  education?: string | null;
  profession?: string | null;
  body_type?: string | null;
  height?: number | string | null;
  weight?: number | string | null;
  hair_color?: string | null;
  eye_color?: string | null;
  skin_color?: string | null;
  prayer_frequency?: number | string | null;
  religion?: string | null;
  religion_section?: string | null;
  dress_code?: string | null;
  dietary_preference?: string | null;
  marital_status?: string | null;
  marital_duration?: number | string | null;
  have_child?: number | string | null;
  want_child?: number | string | null;
  prefered_partner_age_start?: number | string | null;
  prefered_partner_age_end?: number | string | null;
  prefered_partner_distance_range?: number | string | null;
  prefered_partner_religion?: string | null;
  prefered_partner_religion_section?: string | null;
  prefered_partner_occupation?: string | null;
  prefered_partner_education?: string | null;

  // images/paths from example
  pro_path?: string | null;
  image_one?: string | null;
  image_two?: string | null;

  created_at?: string | null;
}

export interface FriendProfileResponse {
  status: string; // "success"
  data: FriendProfile[]; // API returns an array with a single profile
}

/** GET /users/friend-profile/{user_id} */
export async function fetchFriendProfile(
  userId: number,
): Promise<FriendProfile | undefined> {
  const res = await api.get<FriendProfileResponse>(
    `/users/friend-profile/${userId}`,
  );
  // API returns { status, data: [ { ...profile } ] }
  return res.data.data?.[0];
}

/* =========================
   Cancel Request / Unfriend
   ========================= */

export interface CancelFriendOrUnfriendBody {
  receiver_id: number;
}

export interface CancelFriendOrUnfriendResponse {
  status: string; // "success"
  message: string; // "Unfriended"
}

/** DELETE /users/unfriend */
export async function cancelFriendOrUnfriend(
  receiverId: number,
): Promise<CancelFriendOrUnfriendResponse> {
  const payload: CancelFriendOrUnfriendBody = {receiver_id: receiverId};

  console.log(`Calling unfriend: ${receiverId}`);

  // axios DELETE with body: pass it via `data`
  const res = await api.delete<CancelFriendOrUnfriendResponse>(
    '/users/unfriend',
    {
      data: payload,
    },
  );

  console.log(res.data);

  return res.data;
}

/* =========================
   Block User
   ========================= */

export interface BlockUserBody {
  blocked_id: number;
}

export interface BlockUserResponse {
  status: string; // "success"
  message: string; // "blocked"
}

/** POST /users/block */
export async function blockUser(userId: number): Promise<BlockUserResponse> {
  const payload: BlockUserBody = {blocked_id: userId};

  console.log(`BLOCKING USER: ${userId}`);

  const res = await api.post<BlockUserResponse>('/users/block', payload);
  return res.data;
}

/* =========================
   Blocked Users List
   ========================= */

export interface BlockedUser {
  id: number;
  name: string;
}

export interface BlockedUsersResponse {
  status: string; // "success"
  data: BlockedUser[];
}

/** GET /users/blocked-users */
export async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  const res = await api.get<BlockedUsersResponse>('/users/blocked-users');
  return res.data.data ?? [];
}

/* =========================
   Unblock User
   ========================= */

export interface UnblockUserBody {
  id: number;
}

export interface UnblockUserResponse {
  status: string; // "success"
  message: string; // "Unblocked"
}

/** DELETE /users/unblock */
export async function unblockUser(
  userId: number,
): Promise<UnblockUserResponse> {
  const payload: UnblockUserBody = {id: userId};

  console.log(`UNBLOCKING USER: ${userId}`);

  const res = await api.delete<UnblockUserResponse>('/users/unblock', {
    data: payload,
  });

  return res.data;
}

/* =========================
   Report User
   ========================= */

export interface ReportUserBody {
  user_id: number;
  report: string; // "Reason: details"
}

export interface ReportUserResponse {
  status: string; // "success"
  message: string; // e.g. "Report submitted"
}

/** POST /users/report-user */
export async function reportUser(
  userId: number,
  reportText: string,
): Promise<ReportUserResponse> {
  const payload: ReportUserBody = {
    user_id: userId,
    report: reportText,
  };

  console.log(`REPORTING USER: ${userId} | ${reportText}`);

  const res = await api.post<ReportUserResponse>('/users/report', payload);
  return res.data;
}
