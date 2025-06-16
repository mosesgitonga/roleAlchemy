// TinyMCE Resume Editor in React with Dummy HTML from Backend
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
// import "./ResumeEditor.css";

export default function ResumeEditor() {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [initialContent, setInitialContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const dummyResumeHTML = `
      <div class="resume-wrapper">
        <h1 class="resume-name">John Doe</h1>
        <p class="resume-contact">Email: johndoe@example.com | Phone: (123) 456-7890</p>
        <hr class="resume-divider">

        <h2 class="resume-section-title">Professional Summary</h2>
        <p class="resume-paragraph">Experienced software engineer with 5+ years of experience in developing scalable web applications. Skilled in JavaScript, Python, and cloud technologies.</p>

        <h2 class="resume-section-title">Work Experience</h2>
        <p class="resume-role"><strong>Senior Developer</strong> – TechCorp Inc. (2020–Present)</p>
        <ul>
          <li>Developed and maintained web applications using React and Node.js.</li>
          <li>Led a team of 5 developers in agile sprints.</li>
        </ul>

        <p class="resume-role"><strong>Software Engineer</strong> – Webify Labs (2017–2020)</p>
        <ul>
          <li>Built RESTful APIs and integrated third-party services.</li>
          <li>Optimized database performance and implemented CI/CD pipelines.</li>
        </ul>

        <h2 class="resume-section-title">Education</h2>
        <p><strong>BSc in Computer Science</strong> – University of Tech, 2013–2017</p>

        <h2 class="resume-section-title">Skills</h2>
        <ul class="resume-skills">
          <li>JavaScript</li>
          <li>Python</li>
          <li>React</li>
          <li>Node.js</li>
          <li>SQL</li>
          <li>Docker</li>
          <li>AWS</li>
          <li>Git</li>
        </ul>
      </div>
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
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-700">Resume Builder</h1>
        <div className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Subscriptions</a>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 px-4 py-10 items-start justify-center">
        <div className="w-full max-w-md bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">📋 Paste Job Description</h2>
          <textarea
            className="w-full border border-gray-300 rounded p-2 h-80"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <div className="resume-container">
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
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
