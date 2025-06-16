// TinyMCE Resume Editor in React with Dummy HTML from Backend
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./ResumeEditor.css";

export default function ResumeEditor() {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [initialContent, setInitialContent] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    useEffect(() => {
        const dummyResumeHTML = `
            <p>generated resume will appear here.></p>
    `;

        setInitialContent(dummyResumeHTML);
        setLoading(false);
    }, []);

    const handleSave = () => {
        if (!editorRef.current) return;
        const htmlContent = editorRef.current.getContent();
        console.log("Saving resume:", htmlContent);
        alert("Resume saved (simulated). Open console to view the HTML content.");
    };

    if (loading) return <p className="text-center mt-10 text-gray-600">Loading resume editor...</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-6 py-4">
                <div className="nav-container">
                    <div className="logo">Role Alchemy</div>
                    <input type="checkbox" id="nav-toggle" className="nav-toggle" />
                    <label htmlFor="nav-toggle" className="nav-toggle-label">
                        <span></span>
                    </label>
                    <div className="nav-links flex space-x-6">
                        <a href="#">Profile</a>
                        <a href="#">Subscriptions</a>
                        <a href="#">Jobs Whatsapp Group</a>
                        <a href="#">Account</a>
                    </div>
                </div>
            </nav>

            <div className="page-container flex flex-col lg:flex-row items-start justify-center gap-6 px-6 py-10">
                {/* Left Column */}
                <div className="job-description-container w-full lg:max-w-md">
                    <h2>📋 Paste Job Description</h2>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                    />
                </div>

                {/* Right Column */}
                <div className="resume-editor-container w-full">
                    <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={initialContent}
                        apiKey="cj8t272knqraariwd6exq9sf5lg8e37kg29zyazvhj6ahm0i"
                        init={{
                            height: 1050,
                            menubar: false,
                            plugins: ["lists", "link", "table", "autolink", "paste", "wordcount"],
                            toolbar: "undo redo | bold italic underline | bullist numlist | link table",
                            content_css: "/resume-styles.css",
                        }}
                    />
                    <div className="text-center">
                        <button onClick={handleSave} className="save-btn">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
