import React from "react";

// Context Providers
import AuthProvider from "./Context/AuthContext";
import { DashboardProvider } from "./Context/DashboardContext";
import { ShortenProvider } from "./Context/ShortenContext";

const Store = ({ children }) => {
  return (
    <AuthProvider>
      {/* Auth should wrap everything so token/user is globally available */}

{/* Short link creation + listing + operations */}
      <ShortenProvider>
        <DashboardProvider>
          {/* Dashboard data such as stats, clicks, analytics */}
          {children}
        </DashboardProvider>
      </ShortenProvider>
    </AuthProvider>
  );
};

export default Store;
