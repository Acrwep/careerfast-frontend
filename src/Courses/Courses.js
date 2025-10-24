import React, { useEffect, useState } from "react";
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
