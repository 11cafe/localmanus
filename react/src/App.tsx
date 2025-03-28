import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { SettingsIcon } from "lucide-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Settings from "./Settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

type ToolCall = {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
};

type Message = {
  role: string;
  content?: string;
  base64_image?: string;
  tool_calls?: ToolCall[];
  name?: string;
  tool_call_id?: string;
};

function Home() {
  const [agentState, setAgentState] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

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
      <div>
        <p>Current Step: {currentStep}</p>
        <p>Max Steps: {maxSteps}</p>
        <p>Total Tokens: {totalTokens}</p>
      </div>
      <div>
        {messages.map((message, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{message.role}</CardTitle>
            </CardHeader>
            <CardContent>{message.content}</CardContent>
            {message.tool_calls && (
              <CardFooter>
                <CardDescription>
                  {message.tool_calls
                    .map((toolCall) => toolCall.function.name)
                    .join(", ")}
                </CardDescription>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
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
