import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import Dashboard from "@/pages/Dashboard";
import WebsiteList from "@/pages/WebsiteList";
import WebsiteForm from "@/pages/WebsiteForm";
import SecurityReport from "@/pages/SecurityReport";
import CrawledLinks from "@/pages/CrawledLinks";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/websites" element={<MainLayout><WebsiteList /></MainLayout>} />
      <Route path="/websites/add" element={<MainLayout><WebsiteForm /></MainLayout>} />
      <Route path="/websites/edit/:id" element={<MainLayout><WebsiteForm /></MainLayout>} />
      <Route path="/reports" element={<MainLayout><SecurityReport /></MainLayout>} />
      <Route path="/crawled-links" element={<MainLayout><CrawledLinks /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
