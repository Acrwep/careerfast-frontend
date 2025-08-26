import { Row, Col, Card, Typography, Skeleton, Alert } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import "../css/Blogs.css";
import { LuUserRoundPen } from "react-icons/lu";

const { Title, Paragraph } = Typography;

const truncateText = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export default function Blogs({ blogs, loading, error }) {
  console.log("Blog page", blogs);

  if (loading) {
    return (
      <div className="blogs-container">
        <Row gutter={[32, 32]}>
          {[...Array(6)].map((_, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                className="blog-card loading"
                cover={<Skeleton.Image className="blog-image" active />}
              >
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="blogs-container">
        <Alert
          message="Failed to load blogs"
          description="Something went wrong while fetching blogs. Please try again later."
          type="error"
          showIcon
          className="blog-error-alert"
        />
      </div>
    );
  }

  // No blogs case
  if (!blogs || !blogs.data || blogs.data.length === 0) {
    return (
      <div className="blogs-container">
        <div className="no-blogs-container">
          <div className="no-blogs-icon">📝</div>
          <Title level={2} className="no-blogs-title">
            No Blogs Available
          </Title>
          <Paragraph className="no-blogs-subtitle">
            Check back later for new content
          </Paragraph>
        </div>
      </div>
    );
  }

  // Blogs available
  return (
    <div className="blogs-page">
      <Header />
      <div className="blogs-container">
        <div className="blogs-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ textAlign: "center" }}>
              <Title level={1} className="blogs-main-title">
                <span className="title-icon">🚀</span>
                Latest Blogs
              </Title>
              <Paragraph className="blogs-subtitle">
                Discover insights, trends, and stories from our experts
              </Paragraph>
            </div>
          </motion.div>
          <div className="title-decoration"></div>
        </div>

        <Row gutter={[32, 32]}>
          {blogs.data.map((blog, index) => (
            <Col xs={24} sm={12} lg={8} key={blog.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="blog-card-wrapper"
              >
                <Link to={`/blog/${blog.slug}`} state={{ blog }}>
                  <Card
                    hoverable
                    className="blog-card"
                    cover={
                      <div className="blog-image-container">
                        <img
                          alt={blog.blogTitle}
                          src={`http://localhost:1337${blog.coverImg?.url}`}
                          className="blog-image"
                        />
                        <div className="blog-image-overlay"></div>
                      </div>
                    }
                  >
                    <div className="blog-content">
                      <div className="author-div">
                        <div className="blog-category">
                          {" "}
                          <LuUserRoundPen size={16} />{" "}
                          {blog.author?.name || "Unknown Author"}
                        </div>
                        <div className="blog-date">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>

                      <Title level={4} className="blog-title">
                        {truncateText(blog.blogTitle, 50)}
                      </Title>
                      <Paragraph className="blog-description">
                        {truncateText(blog.blogDesc, 120)}
                      </Paragraph>
                      <div className="blog-footer">
                        <span className="read-more">Read More</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
