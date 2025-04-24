import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./src/css/index.css";
import Login from "./admin/auth/login.jsx";
import FeedbackForm from "./student/feedback-form.jsx";
import FeedBackList from "./admin/feedbacklist.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/feedback-list" element={<FeedBackList />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);