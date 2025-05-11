import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default function CommentPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");

  // ✅ Load post, comments, and current user
  useEffect(() => {
    API.get("/users/me").then((res) => {
      console.log("✅ Current user loaded:", res.data);
      setCurrentUser(res.data);
    });

    API.get(`/posts/${postId}`).then((res) => setPost(res.data));
    API.get(`/posts/${postId}/comments`).then((res) => setComments(res.data));
  }, [postId]);

  // ✅ Safely handle comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // Prevent posting if user is not loaded
    if (!currentUser || !currentUser.id || !currentUser.username) {
      console.error("❌ Cannot comment: user data is missing.");
      return;
    }

    const payload = {
      content: newComment,
      commentBy: currentUser.username,
      commentById: currentUser.id,
      commentByProfile: currentUser.profileImage || "/default-profile.png",
    };

    try {
      const res = await API.post(`/posts/${postId}/comments`, payload);
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Failed to post comment", err);
    }
  };

  // ✅ Wait until both post and user are loaded
  if (!post || !currentUser) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{post.title}</Typography>
      <Typography sx={{ mb: 3 }}>{post.description}</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Comment List */}
      <Box sx={{ mb: 2 }}>
        {comments.map((c) => (
          <Box key={c.id} sx={{ mb: 2, display: "flex", gap: 1 }}>
            <Avatar src={c.commentByProfile} />
            <Box>
              <Typography variant="subtitle2">{c.commentBy}</Typography>
              <Typography variant="body2">{c.content}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* New Comment Input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={currentUser.profileImage || "/default-profile.png"} />
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <IconButton
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
