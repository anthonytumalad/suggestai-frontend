import "./src/css/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./admin/auth/login.jsx";
import FeedbackForm from "./student/feedback-form.jsx";
import Layout from "./src/components/Layout.jsx";
import Dashboard from "./admin/dashboard.jsx";
import FeedBackList from "./admin/feedbacklist.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/feedback-form" element={<FeedbackForm />} />
     
      <Route element={<Layout />}>
        <Route path="/feedback_list" element={<FeedBackList />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);