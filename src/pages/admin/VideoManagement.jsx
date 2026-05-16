import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const VIDEOS_STORAGE_KEY = "fenixrise_videos";

function readLocalVideos() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalVideos(videos) {
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    category: "sat",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setVideos(readLocalVideos());
    setLoading(false);
  }, []);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  const getThumbnailUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeUrl) return;

    const videoId = extractVideoId(formData.youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    const newVideo = {
      id: editingId || String(Date.now()),
      title: formData.title,
      youtubeUrl: formData.youtubeUrl,
      videoId: videoId,
      thumbnail: getThumbnailUrl(formData.youtubeUrl),
      category: formData.category,
      description: formData.description,
      createdAt: editingId ? videos.find(v => v.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setVideos(prev => prev.map(v => v.id === editingId ? newVideo : v));
      setEditingId(null);
    } else {
      setVideos(prev => [newVideo, ...prev]);
    }

    saveLocalVideos(editingId ? videos.map(v => v.id === editingId ? newVideo : v) : [newVideo, ...videos]);
    
    setFormData({ title: "", youtubeUrl: "", category: "sat", description: "" });
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
      description: video.description,
    });
    setEditingId(video.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const filtered = videos.filter(v => v.id !== id);
      setVideos(filtered);
      saveLocalVideos(filtered);
      if (editingId === id) {
        setEditingId(null);
        setFormData({ title: "", youtubeUrl: "", category: "sat", description: "" });
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading videos...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 className="font-display" style={{ margin: 0, color: "var(--text-primary)", fontSize: 28 }}>
          📹 Video Management
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>
          Add and manage YouTube videos for SAT/IELTS preparation
        </p>

        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--glass-border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--text-primary)" }}>
            {editingId ? "Edit Video" : "Add New Video"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Video Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., SAT Math: Algebra Fundamentals"
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                }}
              >
                <option value="sat">SAT</option>
                <option value="ielts">IELTS</option>
                <option value="general">General</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", color: "var(--text-primary)", marginBottom: 8, fontWeight: 500 }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the video content..."
                rows={3}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, justifyContent: "flex-end" }}>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: "", youtubeUrl: "", category: "sat", description: "" });
                  }}
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    borderRadius: 10,
                    padding: "12px 24px",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                style={{
                  border: "1px solid var(--glass-border)",
                  background: "var(--pumpkin-soft)",
                  color: "var(--text-primary)",
                  borderRadius: 10,
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {editingId ? "Update Video" : "Add Video"}
              </button>
            </div>
          </form>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {videos.length === 0 ? (
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--glass-border)",
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
            }}>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>No videos added yet.</p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 16,
                  padding: 20,
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                      width: 120,
                      height: 90,
                      borderRadius: 8,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: 18 }}>
                    {video.title}
                  </h3>
                  <p style={{ margin: "0 0 8px 0", color: "var(--text-secondary)", fontSize: 14 }}>
                    {video.description}
                  </p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span
                      style={{
                        background: "var(--pumpkin-soft)",
                        color: "var(--text-primary)",
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {video.category}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    onClick={() => handleEdit(video)}
                    style={{
                      border: "1px solid var(--border)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      borderRadius: 8,
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    style={{
                      border: "1px solid var(--border)",
                      background: "var(--bg-secondary)",
                      color: "#ef4444",
                      borderRadius: 8,
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
