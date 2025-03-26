import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { SettingsIcon } from "lucide-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Settings from "./Settings";

function Home() {
  const [socket, setSocket] = useState(null);

  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket("/ws");
    webSocketRef.current = socket;

    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("Connected to WebSocket server");
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Received message:", event.data);
    });

    // Connection closed
    socket.addEventListener("close", (event) => {
      console.log("Disconnected from WebSocket server");
    });

    // Connection error
    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    // Clean up on component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // Example function to send a message to the server
  const sendMessage = () => {
    const socket = webSocketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: "Hello from React client!" }));
    }
  };

  return (
    <div>
      <Link to="/settings">
        <Button size={"icon"}>
          <SettingsIcon size={30} />
        </Button>
      </Link>
      <Button
        onClick={() => {
          fetch("/api/prompt");
        }}
      >
        Prompt
      </Button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
