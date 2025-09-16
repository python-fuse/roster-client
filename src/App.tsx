import { RouterProvider } from "react-router-dom";
import router from "./router";
import type { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";

function App({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        {children}
      </AuthProvider>
    </>
  );
}

export default App;
