import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  getProgressUpdateById,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
} from "../../api/api"; // adjust the path if needed

interface FormData {
  userId: string;
  progressTemplate: string;
  description: string;
  plan: string;
  startTime: Date;
  endTime: Date;
  id: string | null;
}

interface Props {
  onSubmitSuccess?: (data: any) => void;
  progressId?: string;
}

const PCreateForm: React.FC<Props> = ({ onSubmitSuccess, progressId }) => {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    progressTemplate: "",
    description: "",
    plan: "",
    startTime: new Date(),
    endTime: new Date(),
    id: progressId || null,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.id || user?.userId) {
          setFormData((prev) => ({
            ...prev,
            userId: user.id || user.userId,
          }));
        }
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (progressId) {
      setLoading(true);
      getProgressUpdateById(progressId)
        .then((data) => {
          setFormData({
            ...data,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
          });
        })
        .catch(() => {
          showSnackbar("Failed to load progress data", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [progressId]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name: "startTime" | "endTime", value: Date | null) => {
    if (value) setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = formData.id
        ? await updateProgressUpdate(formData.id, formData)
        : await createProgressUpdate(formData);

      showSnackbar(formData.id ? "Progress updated!" : "Progress added!", "success");
      setFormData({
        userId: formData.userId,
        progressTemplate: "",
        description: "",
        plan: "",
        startTime: new Date(),
        endTime: new Date(),
        id: null,
      });
      if (onSubmitSuccess) onSubmitSuccess(data);
    } catch (error: any) {
      showSnackbar("Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id || !confirm("Delete this progress entry?")) return;
    setLoading(true);
    try {
      await deleteProgressUpdate(formData.id);
      showSnackbar("Progress deleted successfully!", "success");
      setFormData({
        userId: formData.userId,
        progressTemplate: "",
        description: "",
        plan: "",
        startTime: new Date(),
        endTime: new Date(),
        id: null,
      });
      if (onSubmitSuccess) onSubmitSuccess({ deleted: true });
    } catch (error) {
      showSnackbar("Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 700, mx: "auto", mb: 4, position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.7)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Typography variant="h5" gutterBottom>
          {formData.id ? "Edit Progress Update" : "Create Progress Update"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <FormControl fullWidth required>
              <InputLabel id="progress-template-label">Progress Template</InputLabel>
              <Select
                labelId="progress-template-label"
                name="progressTemplate"
                value={formData.progressTemplate}
                onChange={handleChange}
                label="Progress Template"
              >
                <MenuItem value="COMPLETED_5KM_RUN">5km Run</MenuItem>
                <MenuItem value="LIFTED_50KG">Lifted 50kg</MenuItem>
                <MenuItem value="COMPLETED_10KM_RUN">10km Run</MenuItem>
                <MenuItem value="LIFTED_100KG">Lifted 100kg</MenuItem>
                <MenuItem value="COMPLETED_YOGA_SESSION">Yoga</MenuItem>
                <MenuItem value="COMPLETED_SWIMMING_SESSION">Swimming</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div style={{ marginBottom: 20 }}>
            <TextField
              fullWidth
              required
              name="description"
              label="Short Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <DateTimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(value) => handleDateChange("startTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <DateTimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(value) => handleDateChange("endTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <TextField
              fullWidth
              multiline
              rows={5}
              name="plan"
              label="Detailed Plan/Content"
              value={formData.plan}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={formData.id ? <EditIcon /> : <AddIcon />}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {formData.id ? "Update Progress" : "Add Progress"}
            </Button>

            {formData.id && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                Delete Progress
              </Button>
            )}
          </div>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
};

export default PCreateForm;