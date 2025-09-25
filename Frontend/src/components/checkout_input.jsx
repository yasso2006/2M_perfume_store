import { useState, useEffect } from "react";
import axios from "axios";
import { useNotifications } from "./notification";

/**
 * Checkout Component
 * Handles the complete checkout process including billing information and order summary
 * Features:
 * - Form validation for all required fields
 * - Cart management with quantity controls
 * - Order total calculations
 * - Success/error notifications for order submission
 * - Loading states during API calls
 * - Responsive design for all devices
 * - Accessibility features with proper labels and ARIA attributes
 */
function Checkout() {
  // Cart state management
  const [cart, setCart] = useState([]);

  // Billing form state management
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [adress, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [apart, setApart] = useState("");

  // Loading state for order submission
  const [isLoading, setIsLoading] = useState(false);

  // Notification system for user feedback
  const { showSuccess, showError, showWarning, NotificationContainer } =
    useNotifications();

  /**
   * Load cart data from localStorage
   * Handles JSON parsing errors gracefully
   */
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setCart([]);
        showError("Error loading cart data. Cart has been reset.", 3000);
      }
    } else {
      setCart([]);
    }
  };

  /**
   * Save cart data to localStorage and dispatch update event
   * @param {Array} updatedCart - Updated cart array to save
   */
  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  /**
   * Initialize cart on component mount and set up event listeners
   */
  useEffect(() => {
    // Load cart on component mount
    loadCartFromStorage();

    // Listen for custom cart update events from other components
    const handleCartUpdate = () => {
      loadCartFromStorage();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  /**
   * Calculate subtotal from all cart items
   * Handles price conversion and quantity multiplication safely
   */
  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    const price = Number(cart[i].price) || 0;
    const qty = cart[i].quantity || 1;
    subtotal += price * qty;
  }

  /**
   * Remove item from cart by index
   * @param {number} index - Index of item to remove
   */
  function remove(index) {
    const updatedCart = cart.filter((_, i) => i !== index);
    saveCartToStorage(updatedCart);
    showSuccess("Item removed from cart", 2000);
  }

  /**
   * Increase quantity of cart item
   * @param {number} index - Index of item to increase
   */
  function increase(index) {
    const updatedCart = [...cart];
    updatedCart[index].quantity++;
    saveCartToStorage(updatedCart);
  }

  /**
   * Decrease quantity of cart item or remove if quantity becomes 0
   * @param {number} index - Index of item to decrease
   */
  function decrease(index) {
    const updatedCart = [...cart];
    updatedCart[index].quantity--;

    if (updatedCart[index].quantity < 1) {
      remove(index);
    } else {
      saveCartToStorage(updatedCart);
    }
  }

  /**
   * Handle first name input change
   * @param {Event} event - Input change event
   */
  function addFirstName(event) {
    setfName(event.target.value);
  }

  /**
   * Handle last name input change
   * @param {Event} event - Input change event
   */
  function addLastName(event) {
    setlName(event.target.value);
  }

  /**
   * Handle address input change
   * @param {Event} event - Input change event
   */
  function addAdress(event) {
    setAdress(event.target.value);
  }

  /**
   * Handle phone input change
   * @param {Event} event - Input change event
   */
  function addPhone(event) {
    setPhone(event.target.value);
  }

  /**
   * Handle building number input change
   * @param {Event} event - Input change event
   */
  function addBuilding(event) {
    setBuilding(event.target.value);
  }

  /**
   * Handle apartment number input change
   * @param {Event} event - Input change event
   */
  function addApart(event) {
    setApart(event.target.value);
  }

  /**
   * Validate checkout form fields before submission
   * @returns {Object} Validation result with isValid boolean and missing fields array
   */
  function validateCheckoutForm() {
    const missingFields = [];

    if (!fName.trim()) missingFields.push("First Name");
    if (!lName.trim()) missingFields.push("Last Name");
    if (!adress.trim()) missingFields.push("Address");
    if (!phone.trim()) missingFields.push("Phone Number");
    if (!building.trim()) missingFields.push("Building Number");
    if (!apart.trim()) missingFields.push("Apartment Number");

    // Phone validation (basic check for numbers)
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (phone.trim() && !phoneRegex.test(phone)) {
      return {
        isValid: false,
        error: "Please enter a valid phone number",
      };
    }

    // Check if cart is empty
    if (cart.length === 0) {
      return {
        isValid: false,
        error: "Your cart is empty. Please add items before checkout.",
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
   * Handle order submission
   * Validates form, shows loading state, and sends order data to backend
   */
  async function order() {
    // Validate form before submission
    const validation = validateCheckoutForm();

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
      // Send order data to backend
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/order`, {
        fName: fName.trim(),
        lName: lName.trim(),
        adress: adress.trim(),
        phone: phone.trim(),
        building: building.trim(),
        apart: apart.trim(),
        cart,
      });

      if (res.status === 200) {
        // Clear form fields and cart on successful order
        setfName("");
        setlName("");
        setAdress("");
        setPhone("");
        setBuilding("");
        setApart("");
        localStorage.clear();
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));

        // Show success notification
        showSuccess(
          `🎉 Order placed successfully! Thank you ${fName.trim()} ${lName.trim()}! Your order will be processed and delivered soon.`,
          6000
        );

        console.log("Order response:", res);
      } else {
        // Handle non-200 status codes
        showError(
          "There was a problem with the server. Please try again later.",
          4000
        );
      }
    } catch (error) {
      console.error("Order submission error:", error);

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
    order();
  };

  return (
    <div className="checkout__content">

      {/* Notification container for displaying toast messages */}
      <NotificationContainer />

      <div className="checkout__form">
        <div className="checkout__section">
          <h2>Billing Information</h2>
          <form className="form" onSubmit={handleSubmit}>
            {/* Name fields row */}
            <div className="form__row">
              <div className="form__group">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={fName}
                  onChange={addFirstName}
                  disabled={isLoading}
                  autoComplete="given-name"
                />
                <label htmlFor="firstName">First Name *</label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={lName}
                  onChange={addLastName}
                  disabled={isLoading}
                  autoComplete="family-name"
                />
                <label htmlFor="lastName">Last Name *</label>
              </div>
            </div>

            {/* Address field */}
            <div className="form__group">
              <input
                type="text"
                id="address"
                name="address"
                required
                value={adress}
                onChange={addAdress}
                disabled={isLoading}
                autoComplete="street-address"
              />
              <label htmlFor="address">Your Full Address *</label>
            </div>

            {/* Phone field */}
            <div className="form__group">
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={phone}
                onChange={addPhone}
                disabled={isLoading}
                autoComplete="tel"
              />
              <label htmlFor="phone">Phone Number *</label>
            </div>

            {/* Building number field */}
            <div className="form__group">
              <input
                type="text"
                id="building"
                name="building"
                required
                value={building}
                onChange={addBuilding}
                disabled={isLoading}
              />
              <label htmlFor="building">Building Number *</label>
            </div>

            {/* Apartment and city fields row */}
            <div className="form__row">
              <div className="form__group">
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  required
                  value={apart}
                  onChange={addApart}
                  disabled={isLoading}
                />
                <label htmlFor="apartment">Apartment Number *</label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value="Alexandria only"
                />
                <label htmlFor="city">City</label>
              </div>
            </div>
          </form>
        </div>

        {/* Payment information section */}
        <div className="checkout__section">
          <h2>Payment Information</h2>
          <div className="form">
            <h3>Cash Only</h3>
            <p>Payment will be collected upon delivery</p>
          </div>
        </div>
      </div>

      {/* Order summary section */}
      <div className="order__summary">
        <h2>Order Summary</h2>
        <div className="cart__items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cart.map((product, index) => (
              <div className="cart__item" key={index}>
                <div className="item__image">
                  <img src={product.image1} alt={product.name} />
                </div>
                <div className="item__details">
                  <h3>{product.name}</h3>

                  <div className="item__quantity">
                    <button
                      className="qty__btn"
                      onClick={() => decrease(index)}
                      disabled={isLoading}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="qty">{product.quantity}</span>
                    <button
                      className="qty__btn"
                      onClick={() => increase(index)}
                      disabled={isLoading}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item__price">
                  <span>{product.price} L.E</span>
                  <button
                    className="remove__btn"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                    aria-label="Remove item from cart"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order totals */}
        <div className="order__totals">
          <div className="total__row">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} L.E</span>
          </div>
          <div className="total__row">
            <span>Shipping:</span>
            <span>20.00 L.E</span>
          </div>
          <div className="total__row total__final">
            <span>Total:</span>
            <span>{(subtotal + 20).toFixed(2)} L.E</span>
          </div>
        </div>

        {/* Complete order button */}
        <button
          className={`checkout__btn ${isLoading ? "btn-loading" : ""}`}
          onClick={order}
          disabled={isLoading || cart.length === 0}
          aria-label={isLoading ? "Processing order..." : "Complete order"}
        >
          {isLoading ? "Processing..." : "Complete Order"}
        </button>

        <p className="checkout__help">
          * All fields are required. Orders are processed within 24 hours.
        </p>
      </div>
    </div>
  );
}

export default Checkout;
