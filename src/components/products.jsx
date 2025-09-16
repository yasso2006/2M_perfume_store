import React, { useState, useEffect, useRef } from "react";
import EmojiFlowerRain from "./flowe_animation";
import { useNotifications } from "./notification";

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
  const [overlay, setOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  
  // Swipe functionality state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Notification system
  const { showSuccess, showError, NotificationContainer } = useNotifications();
  
  // Reference for the carousel container
  const carouselRef = useRef(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

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
  const products = [
    {
      name: "Elegant Rose",
      price: 89,
      image1: "image.blue1",
      image2: "image.blue.2",
      image3: "image.blue3",
      quantity: 1,
    },
    {
      name: "Ocean Breeze",
      price: 100,
      image1: "image.gold1",
      image2: "image.gold2",
      image3: "image.gold3",
      quantity: 1,
    },
    {
      name: "Midnight Charm",
      price: 150,
      image1: "image.white1",
      image2: "image.white2",
      quantity: 1,
    },
    {
      name: "Urban Legend",
      price: 200,
      image1: "image.red1",
      image2: "image.red2",
      quantity: 1,
    },
  ];

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
      window.location.href = 'checkout.html';
    }, 1000);
  }

  /**
   * Get array of available images for the selected product
   * @returns {Array} Array of image paths
   */
  const getProductImages = () => {
    if (!selectedProduct) return [];
    const images = [selectedProduct.image1, selectedProduct.image2];
    if (selectedProduct.image3) {
      images.push(selectedProduct.image3);
    }
    return images;
  };

  /**
   * Navigate to next image in carousel
   */
  const nextImage = () => {
    const images = getProductImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  /**
   * Navigate to previous image in carousel
   */
  const prevImage = () => {
    const images = getProductImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  /**
   * Handle touch start event for swipe detection
   * @param {TouchEvent} e - Touch event object
   */
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  /**
   * Handle touch move event for swipe detection
   * @param {TouchEvent} e - Touch event object
   */
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  /**
   * Handle touch end event and process swipe gesture
   */
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  /**
   * Handle keyboard navigation in overlay
   * @param {KeyboardEvent} e - Keyboard event object
   */
  const handleKeyDown = (e) => {
    if (!overlay) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
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
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
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
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="carousel-inner">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`carousel-item ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <img
                    src={`/images/${image}.jpeg`}
                    className="d-block w-100"
                    alt={`${selectedProduct.name} - Image ${index + 1}`}
                    style={{
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <button
              className="carousel-control-prev"
              type="button"
              onClick={prevImage}
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
              onClick={nextImage}
              aria-label="Next image"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
            
            {/* Swipe indicator for mobile */}
            <div className="swipe-indicator">
              Swipe to navigate • {currentImageIndex + 1}/{images.length}
            </div>
          </div>

          <div className="details-section">
            <h1>{selectedProduct.name}</h1>
            <p>A delicate floral fragrance with notes of rose and jasmine</p>
            <h2>{selectedProduct.price} L.E</h2>
            <button onClick={() => addCart(selectedProduct)}>Add to cart</button>
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
                  src={`/images/${product.image1}.jpeg`}
                  alt={product.name}
                  className="d-block w-100"
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
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
                <p className="product__description">
                  A delicate floral fragrance with notes of rose and jasmine
                </p>
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
