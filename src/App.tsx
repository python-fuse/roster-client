import { RouterProvider } from "react-router-dom";
import router from "./router";
import type { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";

function App({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            {children}
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
