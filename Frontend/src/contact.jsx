import React from "react";
import ReactDOM from "react-dom/client";
import Contact from "./components/contact_input";
import Cart from "./components/cart";
import Footer from "./components/footer";

// Debug: Test if React is working
console.log("Contact.jsx is loading");

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("Root element:", document.getElementById("root"));

try {
  root.render(<Contact />);
  console.log("Contact component rendered successfully");
} catch (error) {
  console.error("Error rendering Contact component:", error);
}

const cart = ReactDOM.createRoot(document.getElementById("cart"));
cart.render(<Cart />);

const footer = ReactDOM.createRoot(document.getElementById("footer"));
footer.render(<Footer />);
