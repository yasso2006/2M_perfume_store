import React, { useEffect, useState } from 'react';

/**
 * EmojiFlowerRain Component
 * Creates a beautiful falling flower animation effect using emoji
 * Used in product overlay modals to enhance user experience
 * Features:
 * - Random flower emoji generation (🌸, 🌼, 💮, 🌺)
 * - Randomized positioning, size, and animation duration
 * - Automatic cleanup to prevent memory leaks
 * - CSS-based falling animation with rotation
 * - Performance optimized with limited generation time
 */
function EmojiFlowerRain() {
  // State to track active flower animations
  const [flowers, setFlowers] = useState([]);

  /**
   * Set up flower generation and animation lifecycle
   * Creates new flowers at regular intervals with random properties
   */
  useEffect(() => {
    // Generate new flowers every 300ms
    const interval = setInterval(() => {
      // Create unique ID for each flower using timestamp and random number
      const id = Date.now() + Math.random();
      
      // Create new flower object with random properties
      const newFlower = {
        id,
        left: Math.random() * 100, // Random horizontal position (0-100%)
        size: 20 + Math.random() * 20, // Random size between 20-40px
        duration: 5 + Math.random() * 5, // Random fall duration 5-10 seconds
        emoji: ['🌸', '🌼', '💮', '🌺'][Math.floor(Math.random() * 4)], // Random flower emoji
      };

      // Add new flower to active flowers array
      setFlowers((prev) => [...prev, newFlower]);

      // Remove flower after animation completes to prevent memory leaks
      setTimeout(() => {
        setFlowers((prev) => prev.filter((f) => f.id !== id));
      }, (newFlower.duration + 1) * 1000); // Add 1 second buffer for cleanup
    }, 300); // Generate new flower every 300ms

    // Stop generating new flowers after 5 seconds to prevent overwhelming effect
    setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="emoji-rain-container">
      {/* Render each active flower with its unique properties */}
      {flowers.map((flower) => (
        <span
          key={flower.id}
          className="emoji-flower"
          style={{
            left: `${flower.left}%`, // Horizontal position
            fontSize: `${flower.size}px`, // Size of emoji
            animationDuration: `${flower.duration}s`, // Fall animation duration
          }}
          aria-hidden="true" // Hide from screen readers as decorative
        >
          {flower.emoji}
        </span>
      ))}
    </div>
  );
}

export default EmojiFlowerRain;
