import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getBlogs } from "../ApiService/action";
import { Card, Col, Row, Skeleton } from "antd";
import { motion } from "framer-motion";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [blogTips, setBlogTips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        loadBlogsForTips();
    }, []);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const loadBlogsForTips = async () => {
        try {
            setLoading(true);
            const res = await getBlogs();
            const blogs = res.data || [];
            setBlogTips(blogs);
        } catch (error) {
            console.error("Error fetching blog tips:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Helmet>
                {/* Primary Meta Tags */}
                <html lang="en" />
                <title>CareerFast Blogs | Career Insights, Tips & Strategies</title>
                <meta
                    name="description"
                    content="Stay updated with the latest career insights, job search strategies, interview tips, and professional development advice. Expert guidance to boost your career growth."
                />
                <meta
                    name="keywords"
                    content="career blogs, job search tips, interview preparation, career advice, professional development, career growth, job hunting strategies, resume tips, CareerFast blogs"
                />
                <meta name="author" content="CareerFast" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://careerfast.com/blogs" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://careerfast.com/blogs" />
                <meta property="og:title" content="CareerFast Blogs | Career Insights, Tips & Strategies" />
                <meta
                    property="og:description"
                    content="Stay updated with the latest career insights, job search strategies, interview tips, and professional development advice."
                />
                <meta property="og:image" content="https://careerfast.com/og-image-blogs.jpg" />
                <meta property="og:site_name" content="CareerFast" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://careerfast.com/blogs" />
                <meta name="twitter:title" content="CareerFast Blogs | Career Insights, Tips & Strategies" />
                <meta
                    name="twitter:description"
                    content="Stay updated with the latest career insights, job search strategies, interview tips, and professional development advice."
                />
                <meta name="twitter:image" content="https://careerfast.com/twitter-image-blogs.jpg" />

                {/* Structured Data - JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "CareerFast Blogs",
                        "url": "https://careerfast.com/blogs",
                        "description": "Career insights, strategies & tips to boost your career growth",
                        "publisher": {
                            "@type": "Organization",
                            "name": "CareerFast",
                            "url": "https://careerfast.com"
                        }
                    })}
                </script>
                {blogTips.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Blog Posts",
                            "numberOfItems": blogTips.length,
                            "itemListElement": blogTips.map((blog, index) => ({
                                "@type": "BlogPosting",
                                "position": index + 1,
                                "headline": blog.blogTitle,
                                "description": blog.overview,
                                "image": blog.blogImage,
                                "url": `https://careerfast.com/blog/${generateSlug(blog.blogTitle)}`
                            }))
                        })}
                    </script>
                )}
            </Helmet>

            <Header />
            {/* Blog Banner */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="blog-banner"
            >
                <div className="banner-content">
                    <h1>CareerFast Blogs</h1>
                    <p>Insights, strategies & tips to boost your career growth</p>

                    <a href="#ourblogs" className="banner-btn">
                        Explore Blogs
                    </a>
                </div>
            </motion.div>

            {/* Career Tips Section */}
            <div id="ourblogs" className={`career-tips ${isVisible ? 'visible' : ''}`}>
                <div className="premium-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>

                <div className="section-headers">
                    <div className="header-decoration">
                        <h4>Career Fast Blogs</h4>
                    </div>
                    <p>Stay updated with the latest blog trends & interview hacks</p>
                </div>

                <Row gutter={[30, 30]}>
                    {loading ? (
                        // Skeleton Loading Placeholder
                        [...Array(6)].map((_, i) => (
                            <Col xs={24} sm={12} lg={8} key={i}>
                                <Card>
                                    <Skeleton.Image style={{ width: "330px", height: 200, marginBottom: 15 }} active />
                                    <Skeleton active title={{ width: "80%" }} paragraph={{ rows: 3 }} />
                                </Card>
                            </Col>
                        ))
                    ) : blogTips.length === 0 ? (
                        <Col span={24} style={{ textAlign: "center" }}>
                            <h3>No Blogs Found</h3>
                            <p style={{ color: "#666" }}>Check back later for new blog updates.</p>
                        </Col>
                    ) : (
                        blogTips.map((tip, index) => (
                            <Col xs={24} sm={12} lg={8} key={index} className="tip-col">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={index}
                                    whileHover={{ y: -2, scale: 1.01 }}
                                >
                                    <Card
                                        onClick={() => navigate(`/blog/${generateSlug(tip.blogTitle)}`)}
                                        className="premium-tip-card"
                                        cover={
                                            <div className="card-image-container">
                                                <img alt={tip.blogTitle} src={tip.blogImage} />
                                                <div className="image-overlay"></div>
                                                <div className="read-time">
                                                    {tip.readingTime || "3 min read"}
                                                </div>
                                            </div>
                                        }
                                        hoverable
                                        loading={false}
                                    >
                                        <div className="card-contents">
                                            <h3>{tip.blogTitle?.slice(0, 60) + "..."}</h3>
                                            <p>{tip.overview?.slice(0, 100) + "..."}</p>
                                            <a
                                                href={`/blog/${generateSlug(tip.blogTitle)}`}
                                                className="premium-read-more"
                                            >
                                                Read More <i className="fas fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))
                    )}
                </Row>
                <div className="section-footer">
                    <p>Explore more career resources in our <a href="/">Careerfast</a></p>
                </div>
            </div>
        </div>
    )
}