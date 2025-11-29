import React, { useState } from "react";
import { message } from "antd";
import { addBlog } from "../ApiService/action";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/Blogs.css";
import { Upload } from "lucide-react";
import Header from "../Header/Header";
export default function AddBlogs() {
    const [form, setForm] = useState({
        blogTitle: "",
        overview: "",
        author: "",
        readingTime: "",
        blogDescription: "",
        blogImage: "",
    });

    const handleInput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleDescriptionChange = (value) => {
        setForm({ ...form, blogDescription: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 700 * 1024) {
            message.error("Image size must be less than 700 KB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, blogImage: reader.result });
        };
        reader.readAsDataURL(file);
    };


    const handleSubmit = async () => {
        if (!form.blogTitle || !form.blogDescription || !form.blogImage) {
            return message.error("Please fill all required fields");
        }

        try {
            const res = await addBlog(form);
            message.success("Blog added successfully!");

            setForm({
                blogTitle: "",
                author: "",
                readingTime: "",
                blogDescription: "",
                blogImage: "",
            });

            setTimeout(() => {
                window.location.reload();
            }, 200);

        } catch (err) {
            message.error("Error adding blog");
        }
    };

    return (
        <>
            <Header />
            <div className="addblog-container">
                <div className="addblog-card">
                    <h1 className="addblog-title">Create New Blog</h1>

                    <div className="addblog-grid">
                        <input
                            type="text"
                            name="blogTitle"
                            placeholder="Blog Title *"
                            className="addblog-input"
                            value={form.blogTitle}
                            onChange={handleInput}
                        />

                        <input
                            type="text"
                            name="author"
                            placeholder="Author Name"
                            className="addblog-input"
                            value={form.author}
                            onChange={handleInput}
                        />

                        <input
                            type="text"
                            name="readingTime"
                            placeholder="Reading Time (e.g., 3 min)"
                            className="addblog-input"
                            value={form.readingTime}
                            onChange={handleInput}
                        />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <textarea
                            style={{ width: "100%" }}
                            type="text"
                            name="overview"
                            placeholder="Short Overview *"
                            className="addblog-input"
                            value={form.overview}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="addblog-editor">
                        <ReactQuill
                            value={form.blogDescription}
                            onChange={handleDescriptionChange}
                            theme="snow"
                            placeholder="Write blog description..."
                        />
                    </div>

                    <label className="addblog-upload-label">Upload Blog Image *</label><br></br>
                    <button className="addblog-file-input">
                        <Upload /> Upload Image
                        <input
                            className="upload_blog_img"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </button>
                    <br />
                    {form.blogImage && (
                        <img
                            src={form.blogImage}
                            alt="Preview"
                            className="addblog-preview"
                        />
                    )}

                    <button className="addblog-btn" onClick={handleSubmit}>
                        Add Blog
                    </button>
                </div>
            </div>
        </>

    );
}
