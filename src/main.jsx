import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import axios from "axios";
import { API_URL, BASE_URL } from "./api.js";

// Axios Global Base URL for API calls
axios.defaults.baseURL = API_URL;

// সাইটের মেইন ইউআরএল এর জন্য একটি গ্লোবাল ভেরিয়েবল সেট করুন
// এতে করে window.siteURL দিয়ে যেকোনো জায়গা থেকে কল করা যাবে
window.siteURL = BASE_URL;

window.user = JSON.parse(localStorage.getItem('user')) || {};

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);