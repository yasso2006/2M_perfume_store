import React, { useState } from "react";
import axios from "axios";
import { useNotifications } from "./notification";

/**
 * Contact Component
 * Handles customer contact form with validation and notifications
 * Features:
 * - Form validation for required fields
 * - Success/error notifications for form submission
 * - Loading states during API calls
 * - Responsive design for all devices
 * - Accessibility features with proper labels and ARIA attributes
 */
function Contact() {
  // Form state management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);

  // Notification system for user feedback
  const { showSuccess, showError, showWarning, NotificationContainer } =
    useNotifications();

  /**
   * Handle name input change
   * @param {Event} event - Input change event
   */
  function addName(event) {
    setName(event.target.value);
  }

  /**
   * Handle email input change
   * @param {Event} event - Input change event
   */
  function addEmail(event) {
    setEmail(event.target.value);
  }

  /**
   * Handle phone input change
   * @param {Event} event - Input change event
   */
  function addPhone(event) {
    setPhone(event.target.value);
  }

  /**
   * Handle message textarea change
   * @param {Event} event - Input change event
   */
  function addMessage(event) {
    setMessage(event.target.value);
  }

  /**
   * Validate form fields before submission
   * @returns {Object} Validation result with isValid boolean and missing fields array
   */
  function validateForm() {
    const missingFields = [];

    if (!name.trim()) missingFields.push("Name");
    if (!email.trim()) missingFields.push("Email");
    if (!phone.trim()) missingFields.push("Phone");
    if (!message.trim()) missingFields.push("Message");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Please enter a valid email address",
      };
    }

    // Phone validation (basic check for numbers)
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (phone.trim() && !phoneRegex.test(phone)) {
      return {
        isValid: false,
        error: "Please enter a valid phone number",
      };
    }

    if (missingFields.length > 0) {
      return {
        isValid: false,
        missingFields: missingFields,
      };
    }

    return { isValid: true };
  }

  /**
   * Handle contact form submission
   * Validates form, shows loading state, and sends data to backend
   */
  async function addContact() {
    // Validate form before submission
    const validation = validateForm();

    if (!validation.isValid) {
      if (validation.missingFields) {
        showWarning(
          `Please fill in the following required fields: ${validation.missingFields.join(
            ", "
          )}`,
          4000
        );
      } else if (validation.error) {
        showError(validation.error, 4000);
      }
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Send contact form data to backend
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      if (res.status === 200) {
        // Clear form fields on successful submission
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");

        // Show success notification
        showSuccess(
          `Thank you ${name.trim()}! Your message has been sent successfully. We'll get back to you soon! 📧`,
          5000
        );
      } else {
        // Handle non-200 status codes
        showError(
          "There was a problem with the server. Please try again later.",
          4000
        );
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        showError(
          `Server error: ${error.response.status}. Please try again later.`,
          4000
        );
      } else if (error.request) {
        // Network error
        showError(
          "Network error. Please check your internet connection and try again.",
          4000
        );
      } else {
        // Other errors
        showError("An unexpected error occurred. Please try again.", 4000);
      }
    } finally {
      // Always remove loading state
      setIsLoading(false);
    }
  }

  /**
   * Handle form submission via Enter key or form submit
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    addContact();
  };

  return (
    <div className="contact__form">
      {/* Notification container for displaying toast messages */}
      <NotificationContainer />

      <form className="form" onSubmit={handleSubmit}>
        {/* Name input field */}
        <div className="form__group">
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={addName}
            value={name}
            disabled={isLoading}
            aria-describedby="name-help"
            autoComplete="name"
          />
          <label htmlFor="name">Your Name *</label>
        </div>

        {/* Email input field */}
        <div className="form__group">
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={addEmail}
            value={email}
            disabled={isLoading}
            aria-describedby="email-help"
            autoComplete="email"
          />
          <label htmlFor="email">Your Email *</label>
        </div>

        {/* Phone input field */}
        <div className="form__group">
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            onChange={addPhone}
            value={phone}
            disabled={isLoading}
            aria-describedby="phone-help"
            autoComplete="tel"
          />
          <label htmlFor="phone">Phone Number *</label>
        </div>

        {/* Message textarea field */}
        <div className="form__group">
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            onChange={addMessage}
            value={message}
            disabled={isLoading}
            aria-describedby="message-help"
          />
          <label htmlFor="message">Your Message *</label>
        </div>

        {/* Submit button with loading state */}
        <button
          type="submit"
          className={`form__btn ${isLoading ? "btn-loading" : ""}`}
          disabled={isLoading}
          aria-label={isLoading ? "Sending message..." : "Send message"}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>

        {/* Form help text */}
        <p className="form__help">
          * Required fields. We'll respond to your message within 24 hours.
        </p>
      </form>
    </div>
  );
}

export default Contact;
