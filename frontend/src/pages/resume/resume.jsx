import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import html2pdf from "html2pdf.js";
import "./ResumeEditor.css";
import "./print-resume.css";

export default function ResumeEditor() {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [initialContent, setInitialContent] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const maxChars = 5000;

    // Simulate backend resume on mount
    useEffect(() => {
        const dummyHTML = `<p>You resume will appear here after you generate...</p>`;
        setInitialContent(dummyHTML);
        setTimeout(() => setLoading(false), 1000);
    }, []);

    // Update character count
    useEffect(() => {
        setCharCount(jobDescription.length);
    }, [jobDescription]);

    // Toggle mobile menu
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Simulated resume generator
    const handleGenerateResume = () => {
        if (!jobDescription.trim()) {
            alert("Please enter a job description.");
            return;
        }
        const simulatedHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alex Johnson - Software Developer Resume</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #fff;">
            
            <!-- Header Section -->
            <header style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px; color: #2c3e50;">Alex Johnson</h1>
                <h2 style="margin: 5px 0; font-size: 18px; color: #7f8c8d; font-weight: normal;">Software Developer</h2>
                <div style="margin-top: 15px;">
                    <span style="margin: 0 15px;">📧 alex.johnson@email.com</span>
                    <span style="margin: 0 15px;">📱 (555) 123-4567</span>
                    <span style="margin: 0 15px;">🌐 linkedin.com/in/alexjohnson</span>
                    <span style="margin: 0 15px;">💻 github.com/alexjohnson</span>
                </div>
                <div style="margin-top: 10px; color: #7f8c8d;">San Francisco, CA</div>
            </header>
        
            <!-- Professional Summary -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px;">Professional Summary</h3>
                <p style="margin: 0; text-align: justify;">Motivated Software Developer with 2 years of experience building responsive web applications and RESTful APIs. Proficient in JavaScript, Python, and modern frameworks including React and Node.js. Strong problem-solving skills with experience in agile development environments. Passionate about writing clean, maintainable code and collaborating with cross-functional teams to deliver high-quality software solutions.</p>
            </section>
        
            <!-- Technical Skills -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px;">Technical Skills</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <div style="flex: 1; min-width: 200px;">
                        <strong>Programming Languages:</strong> JavaScript, Python, HTML5, CSS3, SQL
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <strong>Frameworks & Libraries:</strong> React, Node.js, Express, Django, Bootstrap
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <strong>Databases:</strong> MySQL, PostgreSQL, MongoDB
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <strong>Tools & Technologies:</strong> Git, Docker, AWS, Postman, VS Code
                    </div>
                </div>
            </section>
        
            <!-- Professional Experience -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px;">Professional Experience</h3>
                
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #34495e; font-size: 18px;">Junior Software Developer</h4>
                        <span style="color: #7f8c8d; font-weight: bold;">June 2023 - Present</span>
                    </div>
                    <div style="color: #7f8c8d; margin-bottom: 10px; font-style: italic;">TechStart Solutions | San Francisco, CA</div>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Developed and maintained 5+ responsive web applications using React and Node.js, serving over 10,000 daily active users</li>
                        <li style="margin-bottom: 8px;">Collaborated with UI/UX designers to implement pixel-perfect interfaces, improving user satisfaction scores by 15%</li>
                        <li style="margin-bottom: 8px;">Built RESTful APIs using Express.js and integrated with MySQL databases, reducing data retrieval time by 25%</li>
                        <li style="margin-bottom: 8px;">Participated in code reviews and implemented unit tests using Jest, contributing to 95% code coverage</li>
                        <li style="margin-bottom: 8px;">Worked in Agile/Scrum environment, consistently meeting sprint deadlines and project milestones</li>
                    </ul>
                </div>
        
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #34495e; font-size: 18px;">Software Developer Intern</h4>
                        <span style="color: #7f8c8d; font-weight: bold;">January 2023 - May 2023</span>
                    </div>
                    <div style="color: #7f8c8d; margin-bottom: 10px; font-style: italic;">WebCraft Technologies | San Francisco, CA</div>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Assisted in developing customer-facing web applications using JavaScript, HTML5, and CSS3</li>
                        <li style="margin-bottom: 8px;">Fixed 20+ bugs and implemented minor feature enhancements based on user feedback</li>
                        <li style="margin-bottom: 8px;">Collaborated with senior developers to optimize database queries, improving application performance by 20%</li>
                        <li style="margin-bottom: 8px;">Documented code and created technical specifications for new features</li>
                    </ul>
                </div>
            </section>
        
            <!-- Projects -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px;">Key Projects</h3>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 5px 0; color: #34495e;">E-Commerce Platform</h4>
                    <p style="margin: 0 0 8px 0; color: #7f8c8d; font-style: italic;">React, Node.js, MongoDB, Stripe API</p>
                    <p style="margin: 0;">Built a full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment processing. Implemented responsive design and deployed using Docker containers on AWS EC2.</p>
                </div>
        
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 5px 0; color: #34495e;">Task Management API</h4>
                    <p style="margin: 0 0 8px 0; color: #7f8c8d; font-style: italic;">Python, Django REST Framework, PostgreSQL</p>
                    <p style="margin: 0;">Developed RESTful API for task management system with user authentication, CRUD operations, and email notifications. Implemented comprehensive API documentation using Swagger.</p>
                </div>
        
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 5px 0; color: #34495e;">Weather Dashboard</h4>
                    <p style="margin: 0 0 8px 0; color: #7f8c8d; font-style: italic;">JavaScript, Chart.js, OpenWeather API</p>
                    <p style="margin: 0;">Created interactive weather dashboard with real-time data visualization, location-based forecasts, and responsive design. Integrated third-party APIs and implemented data caching for improved performance.</p>
                </div>
            </section>
        
            <!-- Education -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px;">Education</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #34495e;">Bachelor of Science in Computer Science</h4>
                    <span style="color: #7f8c8d; font-weight: bold;">May 2023</span>
                </div>
                <div style="color: #7f8c8d; font-style: italic;">University of California, Berkeley | Berkeley, CA</div>
                <p style="margin: 10px 0 0 0;">Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development, Software Engineering</p>
            </section>
        
            <!-- Certifications -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px;">Certifications</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">AWS Certified Cloud Practitioner (2024)</li>
                    <li style="margin-bottom: 8px;">MongoDB Certified Developer Associate (2023)</li>
                </ul>
            </section>
        
        </body>
        </html>
        `;
        editorRef.current?.setContent(simulatedHTML);
    };

    // Clear job description
    const handleClear = () => {
        setJobDescription("");
    };

    // Save (simulated)
    const handleSave = () => {
        const htmlContent = editorRef.current?.getContent();
        if (!htmlContent) {
            alert("No content to save.");
            return;
        }
        console.log("Saved Resume:", htmlContent);
        alert("Resume saved (simulated). Check console for HTML output.");
    };

    // Generate A4 PDF
    const handleDownloadPDF = () => {
        const content = editorRef.current?.getContent();
        if (!content) {
            alert("No content to download.");
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.id = "print-container";
        wrapper.innerHTML = content;
        wrapper.style.width = "210mm";
        wrapper.style.minHeight = "297mm";
        wrapper.style.padding = "15mm";
        wrapper.style.backgroundColor = "#fff";
        wrapper.style.color = "#000";
        wrapper.style.fontFamily = "var(--font-family-base)";

        document.body.appendChild(wrapper);

        const opt = {
            margin: 0,
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf()
            .set(opt)
            .from(wrapper)
            .save()
            .then(() => document.body.removeChild(wrapper));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading resume editor...</p>
            </div>
        );
    }

    return (
        <div className="containerm">
            {/* Header */}
            <header className="header">
                <div className="header-container">
                    <div className="logo">Role Alchemy</div>
                    <button
                        className={`hamburger ${menuOpen ? "active" : ""}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <nav className={`nav ${menuOpen ? "active" : ""}`}>
                        <a href="#" onClick={toggleMenu}>Profile</a>
                        <a href="#" onClick={toggleMenu}>Subscriptions</a>
                        <a href="#" onClick={toggleMenu}>Jobs WhatsApp Group</a>
                        <a href="#" onClick={toggleMenu}>Account</a>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Job Description Input */}
                <div className="job-description card">
                    <h2>📋 Job Description</h2>
                    <div className="textarea-container">
                        <textarea
                            value={jobDescription}
                            onChange={(e) => {
                                if (e.target.value.length <= maxChars) {
                                    setJobDescription(e.target.value);
                                }
                            }}
                            placeholder="Paste the job description here..."
                        />
                        <button
                            className="clear-button btn-primary"
                            onClick={handleClear}
                            disabled={!jobDescription}
                            title="Clear job description"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="char-count">
                        {charCount}/{maxChars} characters
                    </div>
                    <button
                        onClick={handleGenerateResume}
                        disabled={!jobDescription.trim()}
                        className="generate-button btn-primary"
                    >
                        Generate Resume
                    </button>
                </div>

                {/* Resume Editor */}
                <div className="resume-editor card">
                    <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={initialContent}
                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                        init={{
                            height: 600,
                            menubar: false,
                            plugins: ["lists", "link", "table", "autolink", "paste", "wordcount"],
                            toolbar: "undo redo | bold italic underline | bullist numlist | link table | fontsizeselect",
                            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                            content_style: "body { font-family: var(--font-family-base); font-size: 12pt; }",
                        }}
                    />
                    <div className="button-group">
                        <button
                            onClick={handleSave}
                            className="save-button btn-primary"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="download-button btn-primary"
                        >
                            Download as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}