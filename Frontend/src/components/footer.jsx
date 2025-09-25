import React from "react";

/**
 * Footer Component
 * Modern footer with company branding, social media links, and contact information
 * Features:
 * - Custom logo integration
 * - Social media links (Instagram, TikTok)
 * - Company information and copyright
 * - Responsive design for all devices
 * - Matches website's purple/pink theme
 * - Accessibility features with proper ARIA labels
 */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Main footer content */}
        <div className="footer-content">
          {/* Company branding section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img 
                src="/images/logo.jpeg" 
                alt="2M Perfume Store Logo" 
                className="logo-image"
              />
            </div>
            <h3 className="brand-name">2M Perfume Store</h3>
            <p className="brand-description">
              Discover our exquisite range of luxury perfumes. Quality fragrances for every occasion.
            </p>
          </div>

          {/* Quick links section */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html" aria-label="Go to home page">Home</a></li>
              <li><a href="products.html" aria-label="Browse our products">Products</a></li>
              <li><a href="contact.html" aria-label="Contact us">Contact</a></li>
              <li><a href="checkout.html" aria-label="View your cart">Cart</a></li>
            </ul>
          </div>

          {/* Contact information section */}
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <i className="ri-map-pin-line" aria-hidden="true"></i>
              <span>Alexandria, Egypt</span>
            </div>
            <div className="contact-item">
              <i className="ri-phone-line" aria-hidden="true"></i>
              <span>+20 120 548 2464</span>
            </div>
            <div className="contact-item">
              <i className="ri-mail-line" aria-hidden="true"></i>
              <span>2m_perfume@gmail.com</span>
            </div>
          </div>

          {/* Social media section */}
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a 
                href="https://www.instagram.com/2m_perfumestore?igsh=cnIyY24yN2QzY285" 
                className="social-link instagram"
                aria-label="Follow us on Instagram"
                title="Instagram"
              >
                <i className="ri-instagram-line" aria-hidden="true"></i>
              </a>
              <a 
                href="https://www.tiktok.com/@2m_perfumestore?_t=ZS-8zyOlJYEqoB&_r=1" 
                className="social-link tiktok"
                aria-label="Follow us on TikTok"
                title="TikTok"
              >
                <i className="ri-tiktok-line" aria-hidden="true"></i>
              </a>
              <a 
                href="+20 120 548 2464" 
                className="social-link whatsapp"
                aria-label="Contact us on WhatsApp"
                title="WhatsApp"
              >
                <i className="ri-whatsapp-line" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; 2025 2M Perfume Store. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" aria-label="Privacy Policy">Privacy Policy</a>
              <span className="separator">|</span>
              <a href="#" aria-label="Terms of Service">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
