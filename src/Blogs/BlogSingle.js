import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog, updateBlog, getBlogs } from "../ApiService/action";
import { message, Modal, Tooltip } from "antd";

import "../css/Blogs.css";
import Header from "../Header/Header";
import { Edit, Trash } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Upload } from "lucide-react";
import { Skeleton } from "antd";

export default function BlogSingle() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    console.log("login details", loginDetails)
    const loggedInUserId = loginDetails?.id;
    const [latestBlogs, setLatestBlogs] = useState([]);

    const [form, setForm] = useState({
        blogTitle: "",
        overview: "",
        author: "",
        readingTime: "",
        blogDescription: "",
        blogImage: "",
    });

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    // Fetch blog + latest blogs
    const fetchBlog = async () => {
        try {
            const allBlogs = await getBlogs();
            const blogs = allBlogs.data || [];

            // Set latest blogs (sorted by date)
            const sortedLatest = blogs
                .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                .slice(0, 5);

            setLatestBlogs(sortedLatest);

            // Find blog by slug
            const found = blogs.find(
                (b) => generateSlug(b.blogTitle) === slug
            );

            if (!found) {
                setLoading(false);
                return;
            }

            const res = await getBlogById(found.id);

            setBlog(res.data);
            setForm({
                blogTitle: res.data.blogTitle,
                overview: res.data.overview,
                author: res.data.author,
                readingTime: res.data.readingTime,
                blogDescription: res.data.blogDescription,
                blogImage: res.data.blogImage,
            });

            setLoading(false);
        } catch (error) {
            message.error("Unable to fetch blog");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    // Input handler
    const handleInput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Update blog
    const handleUpdate = async () => {
        try {
            await updateBlog(blog.id, form);
            message.success("Blog updated successfully!");
            setEditMode(false);
            fetchBlog();
        } catch {
            message.error("Error updating blog");
        }
    };

    // Delete blog
    const handleDelete = () => {
        Modal.confirm({
            title: "Delete Blog?",
            content: "Are you sure you want to delete this blog?",
            okType: "danger",
            centered: true,

            onOk: async () => {
                try {
                    await deleteBlog(blog.id);
                    message.success("Blog deleted");
                    navigate("/blogs");
                } catch {
                    message.error("Failed to delete blog");
                }
            },
        });
    };

    if (loading)
        return (
            <div className="singleblog-container">
                <div className="singleblog-layout">

                    {/* LEFT SIDE SKELETON */}
                    <div className="singleblog-main">
                        <div className="singleblog-card">

                            <Skeleton.Input active style={{ width: "80%", height: 40, marginBottom: 20 }} />

                            <div style={{ display: "flex", gap: 10, marginBottom: 25 }}>
                                <Skeleton.Button active size="small" />
                                <Skeleton.Button active size="small" />
                                <Skeleton.Button active size="small" />
                            </div>

                            <Skeleton.Image active style={{ width: "600px", height: 350, borderRadius: 10 }} />

                            <Skeleton active paragraph={{ rows: 8 }} style={{ marginTop: 30 }} />

                        </div>
                    </div>

                    {/* RIGHT SIDE SKELETON (LATEST BLOGS) */}
                    <div className="singleblog-right">
                        <Skeleton.Input
                            active
                            style={{ width: 150, height: 25, marginBottom: 20 }}
                        />

                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="latest-item">
                                <Skeleton.Image
                                    active
                                    style={{ width: 90, height: 70, marginRight: 12 }}
                                />
                                <div style={{ flex: 1 }}>
                                    <Skeleton.Input active style={{ width: "90%" }} />
                                    <Skeleton.Input active style={{ width: "60%", marginTop: 10 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    if (!blog) return <div className="singleblog-notfound">Blog not found</div>;

    return (
        <>

            <Header />

            <div className="singleblog-container">
                <div className="singleblog-layout">

                    {/* ========== LEFT SIDE (MAIN BLOG) ========== */}
                    <div className="singleblog-main">
                        <div className="singleblog-card">

                            {!editMode ? (
                                <>
                                    {/* Blog Header */}
                                    <div className="singleblog-header">
                                        <h1 className="singleblog-title">{blog.blogTitle}</h1>

                                        <div className="singleblog-info">
                                            <span className="singleblog-meta-pill">✍ {blog.author || "Unknown"}</span>
                                            <span className="singleblog-meta-pill">⏱ {blog.readingTime || "N/A"} read</span>
                                            <span className="singleblog-meta-pill">📅 {blog.createdDate?.slice(0, 10)}</span>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    {loggedInUserId && (
                                        <div className="singleblog-actions">
                                            <Tooltip title="Edit blog">
                                                <Edit
                                                    size={24}
                                                    onClick={() => setEditMode(true)}
                                                    className="singleblog-edit-icon"
                                                />
                                            </Tooltip>

                                            <Tooltip title="Delete blog">
                                                <Trash
                                                    size={24}
                                                    onClick={handleDelete}
                                                    className="singleblog-dlt-icon"
                                                />
                                            </Tooltip>
                                        </div>
                                    )}

                                    {/* Blog Image */}
                                    {blog.blogImage && (
                                        <img
                                            src={blog.blogImage}
                                            alt="Blog"
                                            className="singleblog-img"
                                        />
                                    )}

                                    {/* Blog Description */}
                                    <div
                                        className="singleblog-description"
                                        dangerouslySetInnerHTML={{
                                            __html: blog.blogDescription,
                                        }}
                                    />
                                </>

                            ) : (
                                <>
                                    {/* EDIT MODE */}
                                    <div style={{ width: 950, margin: "0 auto" }}>
                                        <h2 className="addblog-title">Edit Blog</h2>

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
                                                onChange={(value) =>
                                                    setForm({ ...form, blogDescription: value })
                                                }
                                                theme="snow"
                                                placeholder="Write blog description..."
                                            />
                                        </div>

                                        <label className="addblog-upload-label">Update Blog Image *</label><br />
                                        <button className="addblog-file-input">
                                            <Upload /> Upload Image
                                            <input
                                                className="upload_blog_img"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    if (file.size > 700 * 1024) {
                                                        return message.error("Image must be less than 700 KB");
                                                    }

                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setForm({ ...form, blogImage: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                        </button><br />

                                        {form.blogImage && (
                                            <img
                                                src={form.blogImage}
                                                alt="Preview"
                                                className="addblog-preview"
                                            />
                                        )}

                                        <div style={{ display: "flex", gap: 20, marginTop: 55, justifyContent: "end" }}>
                                            <button className="edit-blog-btn" onClick={handleUpdate}>
                                                Save Changes
                                            </button>

                                            <button
                                                className="singleblog-cancel-btn"
                                                onClick={() => setEditMode(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ========== RIGHT SIDE (LATEST BLOGS SIDEBAR) ========== */}
                    <div className="singleblog-right">
                        <h3 className="latest-title">Latest Blogs</h3>

                        {latestBlogs.map((item) => (
                            <div
                                key={item.id}
                                className="latest-item"
                                onClick={() =>
                                    navigate(`/blog/${generateSlug(item.blogTitle)}`)
                                }
                            >
                                <img
                                    src={item.blogImage}
                                    alt=""
                                    className="latest-thumb"
                                />
                                <div>
                                    <h4 className="latest-head">{item.blogTitle}</h4>
                                    <p className="latest-date">
                                        {item.createdDate?.slice(0, 10)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}
