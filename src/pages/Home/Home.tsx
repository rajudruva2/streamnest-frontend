
import { useEffect, useState } from "react";

const API_URL = "http://54.160.26.131:32379/api/v1";

interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  uploadedAt: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const response = await fetch(`${API_URL}/videos`);
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function uploadVideo() {
    if (!file) {
      alert("Please select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch(`${API_URL}/videos/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Video uploaded successfully.");

      setTitle("");
      setDescription("");
      setFile(null);

      const input = document.getElementById("videoFile") as HTMLInputElement;
      if (input) input.value = "";

      await loadVideos();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>StreamNest</h1>

      <input placeholder="Search" />

      <br />
      <br />

      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        id="videoFile"
        type="file"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={uploadVideo}
        style={{ marginLeft: "10px" }}
      >
        Upload
      </button>

      <br />
      <br />

      {loading && <h3>Loading...</h3>}

      {!loading &&
        videos.map((video) => (
          <div key={video.id} style={{ marginBottom: "30px" }}>
            <h3>{video.title}</h3>

            <p>{video.description}</p>

            <video controls width="500">
              <source
                src={`${API_URL}/videos/${video.id}/stream`}
                type={video.mimetype}
              />
            </video>
          </div>
        ))}
    </div>
  );
}
