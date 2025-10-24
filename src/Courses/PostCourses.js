import React, { useState } from "react";
import { createCourse } from "../ApiService/action";
import "../css/PostCourse.css";
import { CommonToaster } from "../Common/CommonToaster";
import { FcCancel } from "react-icons/fc";
import Header from "../Header/Header";
import Footer from "../Footer/Footer"

export default function PostCourses() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "",
    });
    const [imageBase64, setImageBase64] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    // 🔁 Convert image to Base64
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            CommonToaster("Please upload a valid image file", "error");
            return;
        }

        // ✅ Validate file size (2 MB max)
        const maxSize = 1 * 1024 * 1024; // 2 MB in bytes
        if (file.size > maxSize) {
            CommonToaster("File size exceeds 1 MB. Please upload a smaller image", "error");
            e.target.value = ""; // Clear the file input
            return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result);
        reader.readAsDataURL(file);
    };


    // 🧩 Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🧮 Validate fields
    const validateForm = () => {
        if (!formData.title.trim() || !formData.description.trim() || !formData.link.trim()) {
            CommonToaster("All fields are required", "error");
            return false;
        }
        if (!imageBase64) {
            CommonToaster("Please upload a course image", "error");
            return false;
        }
        if (!/^https?:\/\/.+\..+/.test(formData.link)) {
            CommonToaster("Please enter a valid course link", "error");
            return false;
        }
        return true;
    };

    // 🚀 Handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });

            const payload = { ...formData, imageBase64 };
            const res = await createCourse(payload);
            CommonToaster("Course added successfully!", "success");
            setFormData({ title: "", description: "", link: "" });
            setImageBase64("");
        } catch (err) {
            console.error("Error adding course:", err);
            CommonToaster("Failed to add course. Please try again", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="course-form-container">
                <header className="course-form-header">
                    <h1 className="course-form-title">Add a New Course</h1>
                    <p className="course-form-subtitle">Create and publish your next course effortlessly</p>
                </header>

                <div className="course-form">

                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/* Course Image */}
                        <div className="form-group">
                            <label className="form-label">Course Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-file"
                            />
                            {imageBase64 && (
                                <div className="image-wrapper">
                                    <img src={imageBase64} alt="Preview" className="image-preview" />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => setImageBase64("")}
                                    >
                                        <FcCancel />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. React Mastery Bootcamp"
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="What will students learn from this course?"
                            />
                        </div>

                        {/* Link */}
                        <div className="form-group">
                            <label className="form-label">Course Link</label>
                            <input
                                type="url"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://example.com/my-course"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`submit-button ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Create Course"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>

    );
}
