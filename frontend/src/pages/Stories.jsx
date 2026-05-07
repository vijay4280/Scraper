import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StoryCard from "../components/StoryCard";

const LIMIT = 10;

export default function Stories() {
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scraping, setScraping] = useState(false);

  const fetchStories = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/stories?page=${page}&limit=${LIMIT}`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load stories. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get("/stories/bookmarks");
      setBookmarkedIds(data.stories.map((s) => s._id));
    } catch {
      /* swallow */
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStories(1);
  }, [fetchStories]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  function handleBookmarkChange(storyId, bookmarked) {
    setBookmarkedIds((prev) =>
      bookmarked ? [...prev, storyId] : prev.filter((id) => id !== storyId)
    );
  }

  async function handleScrape() {
    setScraping(true);
    try {
      await api.post("/scrape");
      await fetchStories(1);
    } catch {
      setError("Scrape failed.");
    } finally {
      setScraping(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 32,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            top stories
          </h1>
          {pagination.total > 0 && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
              {pagination.total} stories scraped
            </p>
          )}
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            padding: "8px 16px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            color: scraping ? "var(--text-dim)" : "var(--text-muted)",
            background: "var(--bg-2)",
            cursor: scraping ? "not-allowed" : "pointer",
            transition: "all var(--transition)",
            letterSpacing: "0.03em",
          }}
        >
          {scraping ? "scraping..." : "↻ refresh"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius)",
            border: "1px solid rgba(248,113,113,0.3)",
            background: "rgba(248,113,113,0.08)",
            color: "var(--red)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        </div>
      ) : (
        <>
          <div>
            {stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                index={i + (pagination.page - 1) * LIMIT}
                bookmarkedIds={bookmarkedIds}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 40,
              }}
            >
              <button
                onClick={() => fetchStories(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "6px 14px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  background: "transparent",
                  cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                  opacity: pagination.page === 1 ? 0.3 : 1,
                }}
              >
                ← prev
              </button>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchStories(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "6px 14px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  background: "transparent",
                  cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
                  opacity: pagination.page === pagination.totalPages ? 0.3 : 1,
                }}
              >
                next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
