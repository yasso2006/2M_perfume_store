import React, { useState, useEffect, useRef } from "react";
import EmojiFlowerRain from "./flowe_animation";
import { useNotifications } from "./notification";
import axios from "axios";

/**
 * Products Component
 * Displays a grid of perfume products with overlay modal functionality
 * Features:
 * - Product grid display with hover effects
 * - Modal overlay with image carousel
 * - Touch/swipe navigation for mobile devices
 * - Add to cart functionality with notifications
 * - Responsive design for all screen sizes
 */
function Products() {
  // State management for overlay and product selection
  const [products, setProducts] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  // Swipe functionality state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Notification system
  const { showSuccess, showError, NotificationContainer } = useNotifications();

  // Reference retained if needed in future (not used for touch swipe anymore)
  const carouselRef = useRef(null);

  /**
   * Initialize cart from localStorage on component mount
   * Sets up event listeners for cart updates across components
   */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  /**
   * Save cart to localStorage whenever cart state changes
   * Dispatches custom event to notify other components of cart updates
   */
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  }, [cart]);

  /**
   * Reset image index when overlay opens with new product
   */
  useEffect(() => {
    if (overlay && selectedProduct) {
      setCurrentImageIndex(0);
    }
  }, [overlay, selectedProduct]);

  // Product data array with details for each perfume
  async function addProducts() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    addProducts();
  }, []);

  /**
   * Add product to cart with success notification
   * @param {Object} product - Product object to add to cart
   */
  function addCart(product) {
    setCart((prev) => [...prev, product]);
    showSuccess(`${product.name} added to cart successfully! 🛒`, 3000);
  }

  /**
   * Buy now functionality - adds to cart and redirects to checkout
   * @param {Object} product - Product object to purchase
   */
  function buyNow(product) {
    setCart((prev) => [...prev, product]);
    showSuccess(`Redirecting to checkout for ${product.name}...`, 2000);
    // Use setTimeout to ensure state update completes before navigation
    setTimeout(() => {
      window.location.href = "checkout.html";
    }, 1000);
  }

  /**
   * Get array of available images for the selected product
   * @returns {Array} Array of image paths
   */
  const resolveImageSrc = (imageRef) => {
    if (!imageRef) return "";
    const isAbsoluteUrl = /^https?:\/\//i.test(imageRef);
    return isAbsoluteUrl ? imageRef : `/images/${imageRef}.jpeg`;
  };

  const getProductImages = () => {
    if (!selectedProduct) return [];
    const images = [
      selectedProduct.image1,
      selectedProduct.image2,
      selectedProduct.image3,
    ]
      .filter(Boolean)
      .map((img) => resolveImageSrc(img));
    return images;
  };

  /**
   * Navigate to next image in carousel
   */
  const nextImage = () => {
    const images = getProductImages();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  /**
   * Navigate to previous image in carousel
   */
  const prevImage = () => {
    const images = getProductImages();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch swipe disabled on mobile as requested

  /**
   * Handle keyboard navigation in overlay
   * @param {KeyboardEvent} e - Keyboard event object
   */
  const handleKeyDown = (e) => {
    if (!overlay) return;

    switch (e.key) {
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "Escape":
        setOverlay(false);
        break;
      default:
        break;
    }
  };

  /**
   * Set up keyboard event listeners when overlay is open
   */
  useEffect(() => {
    if (overlay) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [overlay, currentImageIndex]);

  /**
   * Page component that renders the product overlay modal
   * Features image carousel with touch/swipe support and product details
   */
  const Page = () => {
    if (!overlay || !selectedProduct) return null;

    const images = getProductImages();

    return (
      <div className="overlay">
        <div className="overlay-box">
          <EmojiFlowerRain />
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setOverlay(false)}
          ></button>

          <div
            className="carousel slide"
            ref={carouselRef}
          >
            <div className="carousel-inner">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-item ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                >
                  <img
                    src={image}
                    className="overlay__img"
                    alt={`${selectedProduct.name} - Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <button
              className="carousel-control-prev"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Previous image"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Next image"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>

            {/* Image counter indicator */}
            <div className="swipe-indicator">
              {currentImageIndex + 1}/{images.length}
            </div>
          </div>

          <div className="details-section">
            <h1>{selectedProduct.name}</h1>
            <p>A delicate floral fragrance with notes of rose and jasmine</p>
            <h2>{selectedProduct.price} L.E</h2>
            <button onClick={() => addCart(selectedProduct)}>
              Add to cart
            </button>
            <button onClick={() => buyNow(selectedProduct)}>Buy now</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* Notification container for displaying toast messages */}
      <NotificationContainer />

      <div className="page__header">
        <h1>Our Premium Collection</h1>
        <p>Discover our exquisite range of luxury perfumes</p>
      </div>

      <div className="products__grid__full">
        {products.map((product, index) => (
          <div key={index}>
            <Page />
            <div className="product__card">
              <div className="product__image">
                <img
                  src={resolveImageSrc(product.image1)}
                  alt={product.name}
                  className="product__img"
                />
                <div className="product__overlay">
                  <button
                    className="quick__view"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOverlay(true);
                    }}
                  >
                    Quick View
                  </button>
                </div>
              </div>
              <div className="product__content">
                <h3>{product.name}</h3>
                <p className="product__description">{product.descreption}</p>
                <p className="product__price">{product.price} L.E</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
