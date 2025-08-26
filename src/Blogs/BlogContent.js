import { Typography, Avatar, Card, Tag, Button } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useState } from "react";

const { Title, Paragraph } = Typography;

export default function BlogContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog;
  const { slug } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  if (!blog) {
    return (
      <Card
        style={{
          textAlign: "center",
          padding: 40,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Title
          level={2}
          style={{ color: "#bfbfbf", fontFamily: "'Playfair Display', serif" }}
        >
          Blog not found 🚫
        </Title>
        <Button
          type="primary"
          onClick={() => navigate(-1)}
          style={{ marginTop: 20, borderRadius: 8 }}
        >
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Back Button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 30, borderRadius: 8, fontWeight: 500 }}
      >
        Back
      </Button>

      {/* Title */}
      <Title
        level={1}
        style={{
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: 1.2,
          marginBottom: 20,
          fontFamily: "'Playfair Display', serif",
          color: "#1a1a1a",
        }}
      >
        {blog.blogTitle}
      </Title>

      {/* Author + Date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <Avatar
          size={48}
          icon={<UserOutlined />}
          style={{
            background: "#7f5af0 ",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: "1rem" }}>
            {blog.author?.name || "Admin"}
          </div>
          <div
            style={{
              color: "#8c8c8c",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <CalendarOutlined />
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "No date"}
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <Button
            type="text"
            icon={
              isLiked ? (
                <HeartFilled style={{ color: "#ff4d4f" }} />
              ) : (
                <HeartOutlined />
              )
            }
            onClick={() => setIsLiked(!isLiked)}
            style={{ borderRadius: 8 }}
          >
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button
            type="text"
            icon={<ShareAltOutlined />}
            style={{ borderRadius: 8 }}
            onClick={() => {
              const blogUrl = `${window.location.origin}/blog/${slug}`; // full blog URL
              if (navigator.share) {
                navigator
                  .share({
                    title: blog.blogTitle,
                    text: blog.blogDesc || "Check out this blog!",
                    url: blogUrl,
                  })
                  .then(() => console.log("Shared successfully"))
                  .catch((err) => console.error("Share failed:", err));
              } else {
                navigator.clipboard.writeText(blogUrl);
              }
            }}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <div
        style={{
          position: "relative",
          marginBottom: "40px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <img
          src={`http://localhost:1337${blog.coverImg?.url}`}
          alt={blog.blogTitle}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          }}
        ></div>
      </div>

      {/* Blog Description */}
      {blog.blogDesc && (
        <Paragraph
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.7,
            color: "#4a4a4a",
            fontWeight: 400,
            padding: "20px",
            backgroundColor: "#fafafa",
            borderLeft: "4px solid #764ba2",
            borderRadius: "0 8px 8px 0",
            marginBottom: "40px",
          }}
        >
          {blog.blogDesc}
        </Paragraph>
      )}

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          {blog.tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                marginBottom: 8,
                backgroundColor: "#f0f5ff",
                border: "none",
                color: "#1d39c4",
                fontWeight: 500,
              }}
            >
              #{tag}
            </Tag>
          ))}
        </div>
      )}

      {/* Blog Content (Rich Text JSON) */}
      {blog.blogContent && (
        <article
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            color: "#2c2c2c",
          }}
        >
          <BlocksRenderer content={blog.blogContent} />
        </article>
      )}

      {/* Author Bio */}
      <Card
        style={{
          marginTop: 60,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Avatar
            size={50}
            style={{ background: "#7f5af0 " }}
            icon={<UserOutlined size={30} />}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {blog.author?.name || "Admin"}
            </Title>
            <p style={{ color: "#8c8c8c", margin: "0px 0" }}>
              {blog.author?.bio || "Content creator and blogger"}
            </p>
            <div>
              {blog.author?.socials?.twitter && (
                <Button type="text" size="small">
                  Twitter
                </Button>
              )}
              {blog.author?.socials?.instagram && (
                <Button type="text" size="small">
                  Instagram
                </Button>
              )}
              {blog.author?.socials?.website && (
                <Button type="text" size="small">
                  Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Newsletter Subscription */}
      <Card
        style={{
          marginTop: 40,
          borderRadius: 16,
          background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
          border: "none",
          textAlign: "center",
        }}
      >
        <Title level={3}>Enjoyed this article?</Title>
        <Paragraph style={{ color: "#8c8c8c", marginBottom: 20 }}>
          Subscribe to our newsletter for more content like this
        </Paragraph>
        <div style={{ display: "flex", maxWidth: 400, margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Your email address"
            style={{
              flex: 1,
              padding: "10px 15px",
              border: "1px solid #d9d9d9",
              borderRadius: "8px 0 0 8px",
              outline: "none",
            }}
          />
          <Button
            type="primary"
            style={{
              borderRadius: "0 8px 8px 0",
              height: 43,
              background: "#7f5af0",
            }}
          >
            Subscribe
          </Button>
        </div>
      </Card>
    </div>
  );
}
