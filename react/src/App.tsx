import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ComputerIcon,
  MoonIcon,
  SettingsIcon,
  SidebarCloseIcon,
  SidebarIcon,
  SidebarOpenIcon,
  SunIcon,
} from "lucide-react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Settings from "./Settings";
import { EAgentState, Message } from "./types/types";
import ChatInterface from "./Chat";
import { exampleMessages } from "./exampleMessages";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/components/theme-provider";
import WorkspaceSidebar from "./WorkspaceSidebar";

function Home() {
  const [agentState, setAgentState] = useState(EAgentState.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  const webSocketRef = useRef<WebSocket | null>(null);
  const { setTheme, theme } = useTheme();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const navigate = useNavigate();

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

    fetch("/api/config/exists")
      .then((res) => res.json())
      .then((data) => {
        if (!data.exists) {
          navigate("/settings");
        }
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
    <div className="flex">
      <div className="flex-1 flex-grow relative">
        <ChatInterface
          messages={messages}
          totalTokens={totalTokens}
          currentStep={currentStep}
          maxStep={maxSteps}
          agentState={agentState}
        />
        <div className="absolute top-5 left-8 flex gap-1">
          <Link to="/settings">
            <Button size={"sm"}>
              <SettingsIcon size={30} />
            </Button>
          </Link>
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon size={30} /> : <MoonIcon size={30} />}
          </Button>
        </div>
        <div className="absolute top-5 right-8 flex gap-1">
          <Button
            size={"sm"}
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          >
            {isRightSidebarOpen ? (
              <SidebarOpenIcon />
            ) : (
              <div className="flex">
                <ChevronLeftIcon />
                <ComputerIcon />
              </div>
            )}
          </Button>
        </div>
      </div>
      {isRightSidebarOpen && (
        <div className="w-[400px] bg-sidebar h-screen">
          <WorkspaceSidebar />
        </div>
      )}
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
