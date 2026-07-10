
import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {

      const response = await fetch(
        "http://54.160.26.131:32379/api/v1/videos"
      );

      const data = await response.json();

      setVideos(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>StreamNest</h1>

      <input placeholder="Search" />

      <br />
      <br />

      <input type="file" />
      <button>Upload</button>

      <br />
      <br />

      {loading && <h3>Loading...</h3>}

      {!loading &&
        videos.map((video) => (

          <div key={video.id} style={{ marginBottom: 30 }}>

            <h3>{video.title}</h3>

            <p>{video.description}</p>

            <video
              controls
              width="500"
            >
            </video>

          </div>

        ))}

    </div>
  );
}
