import {useEffect, useState} from "react";

/**
 * Cart Component
 * Displays a cart icon with item counter in the navigation bar
 * Features:
 * - Real-time cart item count display
 * - Responsive design for mobile and desktop
 * - Event-driven updates when cart changes
 * - Links to checkout page
 * - Accessibility features with proper ARIA labels
 */
function Cart() {
    // State to track cart items for counter display
    const [cart, setCart] = useState([]);
  
    /**
     * Load cart data from localStorage
     * Handles JSON parsing errors gracefully and ensures cart is always an array
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
            }
        } else {
            setCart([]);
        }
    };

    /**
     * Set up cart loading and event listeners on component mount
     * Listens for 'cartUpdated' events from other components to keep count in sync
     */
    useEffect(() => {
        // Load cart on component mount
        loadCartFromStorage();

        // Listen for custom cart update events from other components
        const handleCartUpdate = () => {
            loadCartFromStorage();
        };

        // Add event listener for cart updates
        window.addEventListener("cartUpdated", handleCartUpdate);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);

    return (
        <div className="nav__btns">
            {/* Cart link with accessibility features */}
            <a 
                href="checkout.html" 
                className="cart__link"
                aria-label={`Shopping cart with ${cart.length} items`}
                title={`View cart (${cart.length} items)`}
            >
                {/* Cart icon using Remix Icons */}
                <i className="ri-shopping-cart-line" aria-hidden="true"></i>
                
                {/* Cart counter badge - only shows if cart has items */}
                {cart.length > 0 && (
                    <span 
                        className="cart__counter" 
                        id="cart-counter"
                        aria-label={`${cart.length} items in cart`}
                    >
                        {cart.length}
                    </span>
                )}
            </a>
        </div>
    );
}

export default Cart;
