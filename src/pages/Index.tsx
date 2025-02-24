
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import { SubjectPage } from "@/components/SubjectPage";

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/subject/:id" element={<SubjectPage />} />
    </Routes>
  );
};

export default Index;
