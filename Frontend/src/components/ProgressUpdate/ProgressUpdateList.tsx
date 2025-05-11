"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

interface ProgressUpdate {
  id: string;
  userId: string;
  progressTemplate: string;
  description: string;
  plan: string;
  startTime: string;
  endTime: string;
}

interface Props {
  userId: string;
  onEditItem: (item: ProgressUpdate) => void;
}

const ProgressUpdateList: React.FC<Props> = ({ userId, onEditItem }) => {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchUpdates();
  }, [userId]);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/progress-updates?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      } else {
        console.error("Failed to fetch progress updates");
      }
    } catch (error) {
      console.error("Error fetching progress updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      try {
        const response = await fetch(`/api/progress-updates/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setUpdates((prev) => prev.filter((update) => update.id !== id));
        } else {
          console.error("Failed to delete progress update");
        }
      } catch (error) {
        console.error("Error deleting progress update:", error);
      }
    }
  };

  const filterUpdates = (template: string) => {
    setFilter((prev) => (prev === template ? null : template));
  };

  const filteredUpdates = filter
    ? updates.filter((u) => u.progressTemplate === filter)
    : updates;

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Your Progress Journey</Typography>
      </Box>

      {loading ? (
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ display: "flex", height: 200 }}>
              <Skeleton variant="rectangular" width={200} height={200} />
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="90%" height={60} />
                </CardContent>
              </Box>
            </Card>
          ))}
        </Stack>
      ) : filteredUpdates.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No progress updates found
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {filteredUpdates.map((update) => (
            <Card key={update.id} sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: "100%", md: 200 }, height: { xs: 200, md: "100%" } }}
                image="/images/default.jpg"
                alt={update.progressTemplate}
              />
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">{update.description}</Typography>
                    <Box>
                      <IconButton onClick={() => onEditItem(update)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(update.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {update.plan}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {`${format(new Date(update.startTime), "MMM d, yyyy h:mm a")} - ${format(
                        new Date(update.endTime),
                        "h:mm a"
                      )}`}
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default ProgressUpdateList;
