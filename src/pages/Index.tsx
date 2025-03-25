
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to project detail page instead of just "/"
  return <Navigate to="/dashboard/temp-humidity" replace />;
};

export default Index;
