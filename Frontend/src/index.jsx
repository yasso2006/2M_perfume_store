import React from "react";
import ReactDOM from "react-dom/client";
import Products from "./components/products";
import Cart from "./components/cart";
import Footer from "./components/footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Products />);

const cart = ReactDOM.createRoot(document.getElementById("cart"));
cart.render(<Cart />);

const footer = ReactDOM.createRoot(document.getElementById("footer"));
footer.render(<Footer />);