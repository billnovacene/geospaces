
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to damp-mold dashboard page
  return <Navigate to="/dashboard/damp-mold" replace />;
};

export default Index;
