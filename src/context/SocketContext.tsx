import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext<
  { socket: Socket; setSocket: (socket: Socket) => void } | undefined
>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    function initSocket() {
      if (!socket) {
        setSocket(io(`ws://localhost:${import.meta.env.SOCKET_PORT || 5000}`));
      }
    }

    initSocket();

    return () => {
      socket?.close();
    };
  }, [socket, setSocket]);

  return (
    <SocketContext.Provider value={{ socket: socket!, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw Error("useSocket can only be used  within a SocketProvider");
  }

  return context;
};
