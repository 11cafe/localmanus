import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { MoonIcon, SettingsIcon, SunIcon } from "lucide-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Settings from "./Settings";
import { EAgentState, Message } from "./types/types";
import ChatInterface from "./Chat";
import { exampleMessages } from "./exampleMessages";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/components/theme-provider";

function Home() {
  const [agentState, setAgentState] = useState(EAgentState.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  const webSocketRef = useRef<WebSocket | null>(null);
  const { setTheme, theme } = useTheme();

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
      const data = JSON.parse(event.data);
      const filteredMessages = data.messages.map((message: Message) => ({
        ...message,
        base64_image: "fake_ba64_xyz",
      }));
      console.log("Received message:", filteredMessages);
      setMessages(data.messages);
      setAgentState(data.agent_state);
      setCurrentStep(data.current_step);
      setMaxSteps(data.max_steps);
      setTotalTokens(data.total_tokens);
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
      <div className="flex">
        <div className="flex-1 flex-grow">
          <ChatInterface
            messages={messages}
            totalTokens={totalTokens}
            currentStep={currentStep}
            maxStep={maxSteps}
            agentState={agentState}
          />
        </div>
        <div className="w-[400px] bg-sidebar h-screen">
          <h1>Workspace</h1>
        </div>
      </div>
      <div className="fixed top-5 left-8 flex gap-1">
        <Link to="/settings">
          <Button size={"icon"}>
            <SettingsIcon size={30} />
          </Button>
        </Link>
        <Button
          size={"icon"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon size={30} /> : <MoonIcon size={30} />}
        </Button>
      </div>
    </div>
  );
}

function App() {
  const { theme } = useTheme();
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
