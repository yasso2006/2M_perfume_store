import React, { useState, useEffect } from 'react';

/**
 * Notification Component
 * Displays toast-style notifications with different types (success, error, warning, info)
 * Automatically dismisses after a specified duration
 * Supports custom styling that matches the website's purple/pink theme
 */
function Notification({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-dismiss notification after specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 10);

    return () => clearTimeout(timer);
  }, [duration]);

  /**
   * Handles notification close with exit animation
   */
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  // Get notification styles based on type
  const getNotificationClass = () => {
    const baseClass = 'notification';
    const typeClass = `notification--${type}`;
    const animationClass = isAnimating ? 'notification--show' : '';
    return `${baseClass} ${typeClass} ${animationClass}`;
  };

  // Get appropriate icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className={getNotificationClass()}>
      <div className="notification__content">
        <span className="notification__icon">{getIcon()}</span>
        <span className="notification__message">{message}</span>
        <button 
          className="notification__close" 
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * NotificationContainer Component
 * Manages multiple notifications and their positioning
 * Provides context for displaying notifications throughout the app
 */
function NotificationList({ notifications, removeNotification }) {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

/**
 * Custom hook for managing notifications
 * Provides easy-to-use functions for showing different types of notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  /**
   * Adds a new notification to the list
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, error, warning, info)
   * @param {number} duration - How long to show the notification (ms)
   */
  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  /**
   * Removes a notification by ID
   * @param {number} id - The notification ID to remove
   */
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Convenience methods for different notification types
  const showSuccess = (message, duration) => addNotification(message, 'success', duration);
  const showError = (message, duration) => addNotification(message, 'error', duration);
  const showWarning = (message, duration) => addNotification(message, 'warning', duration);
  const showInfo = (message, duration) => addNotification(message, 'info', duration);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    NotificationContainer: () => (
      <NotificationList 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    )
  };
}

export default Notification;
