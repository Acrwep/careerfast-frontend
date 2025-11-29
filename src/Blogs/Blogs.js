import { useEffect, useState } from "react";
import { getBlogs } from "../ApiService/action";
import { Card, Col, Row, Skeleton } from "antd";
import { motion } from "framer-motion";
import Header from "../Header/Header";
export default function () {
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
            setBlogTips(blogs.slice(0, 10));
        } catch (error) {
            console.error("Error fetching blog tips:", error);
        } finally {
            setLoading(false);
        }
    };

    // Variants for reusability
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    };

    return (
        <div>
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
                                    variants={fadeInUp}
                                    custom={index}
                                    whileHover={{ y: -2, scale: 1.01 }}
                                >
                                    <Card
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
                    <p>Explore more career resources in our <a href="/job-portal">Careerfast</a></p>
                </div>
            </div>
        </div>
    )
}