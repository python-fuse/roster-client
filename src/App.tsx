import { RouterProvider } from "react-router-dom";
import router from "./router";
import type { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

function App({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <RouterProvider router={router} />
          {children}
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
