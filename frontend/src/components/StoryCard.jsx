import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function StoryCard({ story, bookmarkedIds, onBookmarkChange, index }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const isBookmarked = bookmarkedIds?.includes(story._id);

  const domain = (() => {
    try {
      return new URL(story.url).hostname.replace("www.", "");
    } catch {
      return "news.ycombinator.com";
    }
  })();

  async function handleBookmark() {
    if (!isAuthenticated || loading) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/stories/${story._id}/bookmark`);
      onBookmarkChange(story._id, data.bookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="page-enter"
      style={{
        animationDelay: `${index * 40}ms`,
        padding: "18px 0",
        borderBottom: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "32px 1fr auto",
        gap: "0 16px",
        alignItems: "start",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-dim)",
          paddingTop: 2,
          textAlign: "right",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <a
          href={story.url || `https://news.ycombinator.com`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "var(--text)",
            lineHeight: 1.4,
            transition: "color var(--transition)",
          }}
          onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
        >
          {story.title}
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "var(--text-dim)" }}>{domain}</span>
          <span>
            <span style={{ color: "var(--accent)" }}>▲</span> {story.points} pts
          </span>
          <span>by {story.author}</span>
          {story.postedAt && <span>{story.postedAt}</span>}
        </div>
      </div>

      {isAuthenticated && (
        <button
          onClick={handleBookmark}
          disabled={loading}
          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius)",
            border: "1px solid",
            borderColor: isBookmarked ? "rgba(255,102,0,0.4)" : "var(--border)",
            background: isBookmarked ? "var(--accent-glow)" : "transparent",
            color: isBookmarked ? "var(--accent)" : "var(--text-dim)",
            fontSize: 14,
            transition: "all var(--transition)",
            flexShrink: 0,
            opacity: loading ? 0.5 : 1,
          }}
        >
          {isBookmarked ? "◆" : "◇"}
        </button>
      )}
    </div>
  );
}
