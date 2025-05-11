// ✅ ViewPost.tsx with editable post popup for owner (now sends full post data to /posts/{id})
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardMedia, CardContent, CardActions, Avatar,
  IconButton, Typography, Box, Menu, MenuItem, TextField, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from "@mui/material";
import {
  Favorite as FavoriteIcon, Share as ShareIcon, Comment as CommentIcon,
  MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Send as SendIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default function ViewPost() {
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: any[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState<any>({});
  const [editingComment, setEditingComment] = useState<{ postId: number, commentId: number, content: string } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users/me").then((res) => setCurrentUser(res.data));
    API.get("/posts").then((res) => setPosts(res.data));
  }, []);

  const handleLikeClick = async (postId: number) => {
    if (!currentUser?.id) return;
    const isLiked = likedPosts.includes(postId);
    await API.post(`/posts/like`, null, { params: { postId, userId: currentUser.id } });
    setLikedPosts((prev) => isLiked ? prev.filter((id) => id !== postId) : [...prev, postId]);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likeCount: (p.likeCount || 0) + (isLiked ? -1 : 1) } : p));
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await API.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const openEditDialog = (post: any) => {
    setEditContent(post);
    setEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    const {
      id, title, description, images = [], video = "",
      userId, username, userProfile, likeCount, commentsCount
    } = editContent;

    const payload = {
      id, title, description, images, video,
      userId, username, userProfile,
      likeCount: likeCount || 0,
      commentsCount: commentsCount || 0,
      date: new Date(),
    };

    await API.put(`/posts/${id}`, payload);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, ...payload } : p));
    setEditDialogOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, postId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPostId(null);
  };

  const toggleCommentSection = async (postId: number) => {
    const isExpanded = expandedPostId === postId ? null : postId;
    setExpandedPostId(isExpanded);
    if (isExpanded && !comments[postId]) {
      const res = await API.get(`/posts/${postId}/comments`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !currentUser?.id) return;

    if (editingComment) {
      const res = await API.put(`/posts/${postId}/comments/${editingComment.commentId}`, {
        content,
        commentBy: currentUser.username,
        commentById: currentUser.id,
        commentByProfile: currentUser.profileImage || "/default-profile.png",
      });
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) => c.id === editingComment.commentId ? res.data : c)
      }));
      setEditingComment(null);
    } else {
      const res = await API.post(`/posts/${postId}/comments`, {
        content,
        commentBy: currentUser.username,
        commentById: currentUser.id,
        commentByProfile: currentUser.profileImage || "/default-profile.png",
      });
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), res.data] }));
    }

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleEditComment = (postId: number, comment: any) => {
    setEditingComment({ postId, commentId: comment.id, content: comment.content });
    setCommentInputs((prev) => ({ ...prev, [postId]: comment.content }));
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    await API.delete(`/posts/${postId}/comments/${commentId}`);
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== commentId)
    }));
  };

  if (!currentUser) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, px: 2, py: 4 }}>
      {posts.map((post) => (
        <Card key={post.id} sx={{ width: "100%", maxWidth: 600, mx: "auto", borderRadius: 4, boxShadow: 4 }}>
          <CardHeader
            avatar={<Avatar src={post.userProfile}>{post.username?.charAt(0)}</Avatar>}
            title={<Typography variant="subtitle1">{post.username}</Typography>}
            subheader={new Date(post.date).toLocaleString()}
            action={post.userId === currentUser.id && (
              <>
                <IconButton onClick={(e) => handleMenuOpen(e, post.id)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && menuPostId === post.id} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { openEditDialog(post); handleMenuClose(); }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                  </MenuItem>
                  <MenuItem onClick={() => { handleDeletePost(post.id); handleMenuClose(); }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          />

          {post.images?.length > 0 && post.images[0] && (
            <CardMedia component="img" 
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: 500,
              objectFit: "cover",
              borderRadius: 0, 
            }}
            height="250" 
            image={post.images[0]} alt="Post" />
          )}
          {post.video && (
            <CardMedia component="video" 
            controls height="250" 
            sx={{ width: "100%", height: "auto", maxHeight: 500, objectFit: "cover" }}
            src={post.video} />
          )}

          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">{post.description}</Typography>
          </CardContent>

          <CardActions disableSpacing>
            <IconButton onClick={() => handleLikeClick(post.id)} color={likedPosts.includes(post.id) ? "primary" : "default"}>
              <FavoriteIcon />
              <Typography variant="caption" sx={{ ml: 0.5 }}>{post.likeCount || 0}</Typography>
            </IconButton>
            <IconButton onClick={() => toggleCommentSection(post.id)}><CommentIcon /></IconButton>
            <IconButton><ShareIcon /></IconButton>
          </CardActions>

          {expandedPostId === post.id && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Comments</Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
                {comments[post.id]?.map((c) => (
                  <Box key={c.id} sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}>
                    <Avatar src={c.commentByProfile} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">{c.commentBy}</Typography>
                      <Typography variant="body2">{c.content}</Typography>
                    </Box>
                    {c.commentById === currentUser.id && (
                      <Box>
                        <IconButton size="small" onClick={() => handleEditComment(post.id, c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteComment(post.id, c.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={currentUser.profileImage || "/default-profile.png"} />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                />
                <IconButton onClick={() => handleCommentSubmit(post.id)} disabled={!commentInputs[post.id]?.trim()}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Card>
      ))}

      {/* ✏️ Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editContent.title || ""}
            onChange={(e) => setEditContent((prev: any) => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={editContent.description || ""}
            onChange={(e) => setEditContent((prev: any) => ({ ...prev, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdatePost} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
