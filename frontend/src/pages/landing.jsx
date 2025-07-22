import React from 'react';
import './landing.css';

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <header className="header">
        <div className="container header-container">
          <a href="/" className="logo">Role Alchemy</a>
          <nav className="nav">
            <a href="#why-alchemy">Why Alchemy</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faqs">FAQs</a>
            <a href="#get-started"  id='btn-primary' className="btn-primary">Get Started</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-text">
            <h2>Pretty Resumes Don’t Get Interviews. Tailored Ones Do.</h2>
            <p>
              Most resume tools give you templates. We give you interviews.
              Paste a job description and get a high-converting, ATS-optimized
              resume & cover letter built just for that role — in seconds.
            </p>
            <a href="#get-started" className="btn-primary large">Start in Seconds</a>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img
              src="resume-480x309-removebg-preview.png"
              alt="Resume preview"
              width="480"
              height="309"
            />
          </div>
        </div>
      </section>

      {/* VALUE PROP SECTION */}
      <section id="why-alchemy" className="features-section">
        <div className="container">
          <h3 className="section-title">Why Role Alchemy?</h3>
          <p className="section-subtitle">
            To get interviews, it’s not about having the skills or education—it’s about communicating them effectively in your resume.
          </p>
          <div className="features-grid" id='feature-grid'>
            <div className="feature-item" id='feature-item' >
              <h4>No Guesswork</h4>
              <p>
                Paste a job — we reverse-engineer what the employer wants and bake it into your resume.
              </p>
            </div>
            <div className="feature-item">
              <h4>ATS-Friendly by Default</h4>
              <p>
                We follow the rules recruiters and software demand — even when it’s not “pretty.”
              </p>
            </div>
            <div className="feature-item">
              <h4>Human-Tuned Cover Letters</h4>
              <p>
                Not robotic. Not templated. Each one speaks in your voice, with emotional clarity.
              </p>
            </div>
            <div className="feature-item">
              <h4>Made for Interviews, Not Just Screenshots</h4>
              <p>
                We’ll never let you shoot yourself in the foot with resume “design” that gets filtered out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h3 className="section-title">How It Works</h3>
          <ol className="steps-list">
            <li><strong>Build</strong> your professional profile once.</li>
            <li><strong>Paste</strong> any job description.</li>
            <li><strong>Generate</strong> an ATS-optimized resume tailored for that job.</li>
            <li><strong>Apply</strong> with confidence — and finally get noticed.</li>
          </ol>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <h3 className="section-title">What Users Are Saying</h3>
          <div className="testimonial">
            <p>
              "Role Alchemy felt like having a personal career coach whispering
              in my ear. I didn’t just apply — I stood out."
            </p>
            <cite>— Jane Doe, Product Manager</cite>
          </div>
          <div className="testimonial">
            <p>
              "I used to dread tailoring my resume. Now I paste the job, hit
              generate, and apply with total confidence. Total game changer."
            </p>
            <cite>— John Smith, Software Engineer</cite>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section id="faqs" className="faqs-section">
        <div className="container">
          <h3 className="section-title">FAQs</h3>
          <div className="faq-item">
            <h4>Is this better than using a resume template?</h4>
            <p>
              Templates don’t adapt to job descriptions. We do. Role Alchemy dynamically crafts resumes and cover letters
              that mirror the job’s own language and needs.
            </p>
          </div>
          <div className="faq-item">
            <h4>Do I need to write anything?</h4>
            <p>
              Nope. Just paste the job and upload your current resume or profile.
              We’ll write the future you.
            </p>
          </div>
          <div className="faq-item">
            <h4>Can I edit the final result?</h4>
            <p>
              Absolutely. Think of Role Alchemy as your first-class draft assistant — you’re always in control.
            </p>
          </div>
          <div className="faq-item">
            <h4>Why can’t I design my resume freely?</h4>
            <p>
              Because pretty resumes often get filtered out by ATS bots. Role Alchemy isn’t here to help you look good —
              we’re here to help you get interviews.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="cta-section">
        <div className="container cta-container">
          <h3>Pretty Doesn’t Get You Hired. Strategy Does.</h3>
          <p>Build resumes that recruiters and AI both love. Role Alchemy makes it automatic.</p>
          <a href="#" className="btn-primary large">Get Started Now</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-container">
          <p>© 2025 Role Alchemy. All rights reserved.</p>
          <nav className="footer-nav">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}