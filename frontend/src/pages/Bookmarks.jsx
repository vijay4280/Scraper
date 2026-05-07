import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import StoryCard from "../components/StoryCard";

export default function Bookmarks() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/stories/bookmarks");
      setStories(data.stories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const bookmarkedIds = stories.map((s) => s._id);

  function handleBookmarkChange(storyId, bookmarked) {
    if (!bookmarked) {
      setStories((prev) => prev.filter((s) => s._id !== storyId));
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.02em",
          }}
        >
          bookmarks
        </h1>
        {!loading && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            {stories.length} saved {stories.length === 1 ? "story" : "stories"}
          </p>
        )}
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        </div>
      ) : stories.length === 0 ? (
        <div
          style={{
            padding: "64px 0",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            color: "var(--text-dim)",
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>◇</div>
          no bookmarks yet
          <br />
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            click ◇ on any story to save it here
          </span>
        </div>
      ) : (
        <div>
          {stories.map((story, i) => (
            <StoryCard
              key={story._id}
              story={story}
              index={i}
              bookmarkedIds={bookmarkedIds}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </div>
      )}
    </main>
  );
}
