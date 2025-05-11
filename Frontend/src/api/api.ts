import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 🔐 Auth APIs
export const registerUser = (data: {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  profileImage?: string | null;
  source: "CREDENTIAL";
}) => API.post("/users/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/users/login", data);

export const getCurrentUser = () => API.get("/users/me");

export const updateUser = (
  userId: string,
  updates: { username?: string; profileImage?: string }
) => API.put(`/users/${userId}`, updates);

export const getAllUsers = () => API.get("/users");

export const followUser = (
  userId: string,
  followedUserId: string
) =>
  API.post("/users/follow", null, {
    params: { userId, FollowedUserId: followedUserId },
  });

// 📝 Post APIs
export const createPost = (postData: any) => API.post("/posts", postData);
export const getAllPosts = () => API.get("/posts");

// 💬 Comments APIs
export const getComments = (postId: number) =>
  API.get(`/posts/${postId}/comments`);

export const addComment = (
  postId: number,
  comment: {
    content: string;
    commentBy: string;
    commentById: string;
    commentByProfile: string;
  }
) => API.post(`/posts/${postId}/comments`, comment);

// 🖼️ Media Upload API for image or video
export const uploadMedia = async (file: File): Promise<{ url: string; type: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:8080/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const fileType = file.type.startsWith("video") ? "video" : "image";

  return {
    url: res.data, // now a full URL
    type: fileType,
  };
};


// ✅ Notification APIs (now using axios)

export const fetchNotifications = (userId: string) =>
  API.get(`/notifications/${userId}`).then(res => res.data)

export const markNotificationAsRead = (id: string) =>
  API.post(`/notifications/read/${id}`)

export const deleteNotification = (id: string) =>
  API.delete(`/notifications/${id}`)

// 📈 Progress Update APIs

export const getProgressUpdateById = (id: string) =>
  API.get(`/api/progress-updates/${id}`).then(res => res.data);

export const createProgressUpdate = (data: any) =>
  API.post("/api/progress-updates", data).then(res => res.data);

export const updateProgressUpdate = (id: string, data: any) =>
  API.put(`/api/progress-updates/${id}`, data).then(res => res.data);

export const deleteProgressUpdate = (id: string) =>
  API.delete(`/api/progress-updates/${id}`).then(res => res.data);



export default API