import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Button,
  Modal,
  Stack,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import AddIcon from "@mui/icons-material/Add";
import PCreateForm from "./PCreateForm"; // Adjust the path if different

interface ProgressUpdate {
  id: string;
  userId: string;
  progressTemplate: string;
  description: string;
  plan: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
}

interface TemplateData {
  name: string;
  value: number;
}

interface Props {
  userId: string;
}

const ProgressDashboard: React.FC<Props> = ({ userId }) => {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const prepareTemplateData = (): TemplateData[] => {
    const templateCounts: { [key: string]: number } = {};
    updates.forEach((update) => {
      const template = update.progressTemplate;
      templateCounts[template] = (templateCounts[template] || 0) + 1;
    });

    return Object.keys(templateCounts).map((template) => ({
      name: template,
      value: templateCounts[template],
    }));
  };

  const prepareTimelineData = () => {
    const dateGroups: { [key: string]: ProgressUpdate[] } = {};

    updates.forEach((update) => {
      const date = new Date(update.createdAt || update.startTime).toISOString().split("T")[0];
      if (!dateGroups[date]) {
        dateGroups[date] = [];
      }
      dateGroups[date].push(update);
    });

    return Object.keys(dateGroups)
      .map((date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const count = dateGroups[date].length;

        const templateCounts: { [key: string]: number } = {};
        dateGroups[date].forEach((update) => {
          const template = update.progressTemplate;
          templateCounts[template] = (templateCounts[template] || 0) + 1;
        });

        return {
          date: formattedDate,
          count,
          ...templateCounts,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const templateData = prepareTemplateData();
  const timelineData = prepareTimelineData();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: 600 }}>
        Progress Dashboard
      </Typography>

      {/* Add Progress Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Progress
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Overview" />
        <Tab label="Timeline" />
        <Tab label="Categories" />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {tabValue === 0 && (
        <Stack spacing={2}>
          {templateData.map((template) => (
            <Card key={template.name}>
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {template.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {tabValue === 1 && (
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6">Timeline</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h6">Category Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={templateData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                    {templateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#90caf9" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Category Comparison</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={templateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2">
                    {templateData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill="#90caf9" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Create Progress Modal */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto"
        }}>
          <PCreateForm
            onSubmitSuccess={() => {
              setOpenForm(false);
              fetchUpdates();
            }}
          />
        </Box>
      </Modal>
    </Paper>
  );
};

export default ProgressDashboard;
