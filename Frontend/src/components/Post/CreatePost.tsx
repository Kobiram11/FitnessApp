// ✅ CreatePost.tsx - Upload either image or video
import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createPost, getCurrentUser, uploadMedia } from "../../api/api";

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const steps = ["Select Media", "Create Post"];

export default function CreatePost({ open, onClose }: CreatePostProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("User");
  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUserId(res.data.id);
        setUsername(res.data.username || "User");
        setUserProfile(res.data.profileImage || "");
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
      }
    };
    if (open) fetchUser();
  }, [open]);

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setMediaFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setMediaPreview(e.target.result as string);
          setMediaType(file.type.startsWith("video") ? "video" : "image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      let imageUrl = "";
      let videoUrl = null;

      if (mediaFile) {
        const result = await uploadMedia(mediaFile);
        if (result.type === "image") imageUrl = result.url;
        if (result.type === "video") videoUrl = result.url;
      }

      const newPost = {
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
        userId,
        username,
        userProfile,
        video: videoUrl,
      };

      await createPost(newPost);
      console.log("✅ Post created successfully");
      handleClose();
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Backend error:", error.response.data);
        alert(`Error: ${error.response.data}`);
      } else {
        console.error("❌ Axios error:", error.message);
      }
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h6">Create New Post</Typography>
        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <Box sx={{ width: "100%", px: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent dividers>
        {activeStep === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
            {mediaPreview ? (
              mediaType === "image" ? (
                <img
                  src={mediaPreview}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 400, marginBottom: 16 }}
                />
              ) : (
                <video
                  src={mediaPreview}
                  controls
                  style={{ maxWidth: "100%", maxHeight: 400, marginBottom: 16 }}
                />
              )
            ) : (
              <Paper
                elevation={0}
                sx={{ height: 300, width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "2px dashed", borderColor: "divider", borderRadius: 2, p: 3 }}
              >
                <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h6">Upload an Image or Video</Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Drag and drop a file here, or click to select one
                </Typography>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Select File
                  <VisuallyHiddenInput type="file" accept="image/*,video/*" onChange={handleMediaChange} />
                </Button>
              </Paper>
            )}
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar src={userProfile} sx={{ mr: 2 }} />
              <Typography variant="subtitle1" fontWeight="medium">{username}</Typography>
            </Box>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: activeStep === 1 ? "space-between" : "flex-end", px: 3, py: 2 }}>
        {activeStep === 1 && <Button onClick={handleBack}>Back</Button>}
        <Button
          onClick={activeStep === 0 ? handleNext : handleSubmit}
          variant="contained"
          disabled={activeStep === 0 && !mediaFile}
        >
          {activeStep === 0 ? "Next" : "Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
