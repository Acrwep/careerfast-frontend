import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getAllCourses } from "../ApiService/action";
import { FaClock, FaArrowRight, FaBookOpen, FaExclamationCircle } from "react-icons/fa";
import "../css/PostCourse.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await getAllCourses();
                setCourses(res || []);
            } catch (error) {
                console.error("❌ Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    return (
        <>
            <Helmet>
                {/* Primary Meta Tags */}
                <html lang="en" />
                <title>CareerFast | Online Courses - Master New Skills for Your Career</title>
                <meta
                    name="description"
                    content="Explore our carefully crafted online courses designed to help you master new skills and advance your career. Learn from industry experts with hands-on projects and real-world applications."
                />
                <meta
                    name="keywords"
                    content="online courses, career development courses, skill development, professional training, online learning, career courses, upskilling, reskilling, CareerFast courses"
                />
                <meta name="author" content="CareerFast" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://careerfast.com/courses" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://careerfast.com/courses" />
                <meta property="og:title" content="CareerFast | Online Courses - Master New Skills for Your Career" />
                <meta
                    property="og:description"
                    content="Explore our carefully crafted online courses designed to help you master new skills and advance your career. Learn from industry experts."
                />
                <meta property="og:image" content="https://careerfast.com/og-image-courses.jpg" />
                <meta property="og:site_name" content="CareerFast" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://careerfast.com/courses" />
                <meta name="twitter:title" content="CareerFast | Online Courses - Master New Skills for Your Career" />
                <meta
                    name="twitter:description"
                    content="Explore our carefully crafted online courses designed to help you master new skills and advance your career."
                />
                <meta name="twitter:image" content="https://careerfast.com/twitter-image-courses.jpg" />

                {/* Structured Data - JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Online Courses - CareerFast",
                        "url": "https://careerfast.com/courses",
                        "description": "Explore our carefully crafted online courses designed to help you master new skills and advance your career.",
                        "provider": {
                            "@type": "Organization",
                            "name": "CareerFast",
                            "url": "https://careerfast.com"
                        }
                    })}
                </script>
                {courses.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Available Courses",
                            "description": "Browse our collection of professional development courses",
                            "numberOfItems": courses.length,
                            "itemListElement": courses.map((course, index) => ({
                                "@type": "Course",
                                "position": index + 1,
                                "name": course.title,
                                "description": course.description,
                                "provider": {
                                    "@type": "Organization",
                                    "name": "CareerFast"
                                },
                                "url": course.link
                            }))
                        })}
                    </script>
                )}
            </Helmet>
            <Header />
            <div className="courses-page">
                <div className="courses-header">
                    <div className="header-contentss">
                        <FaBookOpen className="header-icon" />
                        <h1 className="courses-heading">Explore Our Curriculum</h1>
                        <p className="courses-subtitle">
                            Master new skills with our carefully crafted courses
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Loading courses...</div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="no-courses">
                        <FaExclamationCircle className="no-courses-icon" />
                        <h3>No Courses Available</h3>
                        <p>Please check back later — new courses are coming soon!</p>
                    </div>
                ) : (
                    <div className="courses-container">
                        <div
                            className={`courses-grid ${courses.length === 1
                                ? "one-course"
                                : courses.length === 2
                                    ? "two-courses"
                                    : ""
                                }`}
                        >
                            {courses.map((course, index) => (
                                <div key={index} className="course-card">
                                    <div className="card-header">
                                        <div
                                            className="course-image"
                                            style={{ backgroundImage: `url(${course.imageBase64 || course.image})` }}
                                        >
                                            <div className="course-overlay"></div>
                                        </div>
                                    </div>

                                    <div className="course-content">
                                        <div className="course-meta">
                                            <div className="course-lesson">
                                                <FaClock /> {course.lessons || "10x"} Lessons
                                            </div>
                                            <div className="course-level">Intermediate</div>
                                        </div>

                                        <h3 className="course-title">{course.title}</h3>

                                        <p className="course-desc">
                                            {course.description?.length > 100
                                                ? course.description.slice(0, 100) + "..."
                                                : course.description}
                                        </p>

                                        <div className="card-footers">
                                            <a
                                                href={course.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="course-link"
                                            >
                                                Explore Course
                                                <FaArrowRight className="arrow-icon" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

