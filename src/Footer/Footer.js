import React from "react";
import logo from "../images/careerfastlogofinal.png";
import { useNavigate } from "react-router-dom";
export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
                src={logo}
                alt="Logo"
                className="main-logo"
              />
            </div>
            <p className="footer-description">
              Crafting digital excellence for tomorrow's visionaries.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav">
            <div>
              <h4 className="footer-menu-title">Company</h4>
              <ul className="footer-menu-list">
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/blogs")}
                    className="footer-menu-link"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-menu-title">Apply</h4>
              <ul className="footer-menu-list">
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    Jobs
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    Internship
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    Scholarship
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-menu-title">Resources</h4>
              <ul className="footer-menu-list">
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    API Docs
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/job-filter")}
                    className="footer-menu-link"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-newsletter">
            <h4 className="newsletter-title">Stay Updated</h4>
            <p className="newsletter-description">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 careerfast.in. All rights reserved.
          </p>

          <div className="footer-legal">
            <a href="/privacy" className="footer-legal-link">
              Privacy Policy
            </a>
            <a href="/terms" className="footer-legal-link">
              Terms of Service
            </a>
            <a href="/cookies" className="footer-legal-link">
              Cookies
            </a>
          </div>

          <div className="footer-social">
            <a href="#" className="footer-social-link">
              Twitter
            </a>
            <a href="#" className="footer-social-link">
              LinkedIn
            </a>
            <a href="#" className="footer-social-link">
              GitHub
            </a>
            <a href="#" className="footer-social-link">
              Dribbble
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
