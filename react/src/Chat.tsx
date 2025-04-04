import React, { useState } from "react";
import { EAgentState, Message, MessageGroup, ToolCall } from "./types/types";
import { Button } from "./components/ui/button";
import { SendIcon, SquareIcon, StopCircleIcon } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Textarea } from "./components/ui/textarea";

const FOOTER_HEIGHT = 170; // Adjust this value as needed

const ChatInterface = ({
  messages: exampleMessages,
  currentStep,
  maxStep,
  totalTokens,
  agentState,
}: {
  messages: Message[];
  currentStep: number;
  maxStep: number;
  totalTokens: number;
  agentState: EAgentState;
}) => {
  const [prompt, setPrompt] = useState("");
  const [disableStop, setDisableStop] = useState(false);
  // Process messages to handle consecutive roles appropriately
  const processMessages = (messages: Message[]) => {
    const processed: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message, index) => {
      // Special handling for assistant and tool messages
      if (message.role === "assistant" || message.role === "tool") {
        if (currentGroup && currentGroup.role === "assistant") {
          // Add to existing assistant group
          currentGroup.messages.push(message);
        } else {
          // Start a new assistant group
          if (currentGroup) {
            processed.push(currentGroup);
          }
          currentGroup = {
            id: index,
            role: "assistant", // Both assistant and tool are grouped under assistant
            messages: [message],
          };
        }
      } else {
        // For user messages, create individual groups
        if (currentGroup) {
          processed.push(currentGroup);
        }
        currentGroup = {
          id: index,
          role: message.role,
          messages: [message],
        };
      }
    });

    // Add the last group
    if (currentGroup) {
      processed.push(currentGroup);
    }

    return processed;
  };

  const processedMessages = processMessages(exampleMessages);
  const onSendPrompt = () => {
    if (agentState == EAgentState.RUNNING) {
      return;
    }
    setPrompt("");
    fetch("/api/prompt", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    }).then((resp) => resp.json());
  };
  // Component to render tool call tag
  const ToolCallTag = ({ toolCall }: { toolCall: ToolCall }) => {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    return (
      <div className="bg-gray-200 dark:bg-gray-800 rounded px-2 py-1 text-xs font-mono mt-2 inline-block">
        <span className="font-semibold">{name}</span>
        {Object.entries(parsedArgs).map(([key, value], i) => (
          <span key={i} className="ml-1">
            <span className="text-purple-600 dark:text-purple-400">{key}</span>=
            <span className="text-green-600 dark:text-green-400">
              {String(value)}
            </span>
          </span>
        ))}
      </div>
    );
  };

  // Function to truncate long content
  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Chat header */}
      {/* <header className="p-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100"></h1>
      </header> */}

      {/* Chat messages */}
      <div
        className="flex-1 p-4 overflow-y-auto"
        style={{ paddingBottom: FOOTER_HEIGHT }}
      >
        <div className="space-y-6 max-w-3xl mx-auto">
          {processedMessages.map((group) => (
            <div
              key={group.id}
              className={`flex flex-col space-y-2 ${
                group.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Role label */}
              {/* <div
                className={`flex items-center space-x-2`}
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {group.role === "user" ? "You" : "Assistant"}
                </span>
              </div> */}

              {/* Messages */}
              <div
                className={`${
                  group.role === "user" ? "ml-10 items-end" : "items-start"
                } space-y-3 flex flex-col ${
                  group.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {group.messages.map((message, idx) => (
                  <div
                    key={`${group.id}-${idx}`}
                    className={`${
                      group.role === "user" ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    {/* Regular message content */}
                    {message.content && (
                      <div
                        className={`break-all ${
                          group.role === "user"
                            ? "bg-primary text-primary-foreground rounded-2xl p-3 text-left"
                            : "text-gray-800 dark:text-gray-200 text-left"
                        }`}
                      >
                        {message.content}
                      </div>
                    )}

                    {/* Tool calls */}
                    {message.tool_calls && message.tool_calls.length > 0 && (
                      <div className="flex flex-col items-start">
                        {message.tool_calls.map((toolCall, i) => (
                          <ToolCallTag key={i} toolCall={toolCall} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div
        className="flex flex-col absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-950 p-4 gap-2"
        style={{ height: FOOTER_HEIGHT }}
      >
        {/* Agent Status */}
        <div className="flex w-full max-w-3xl mx-auto gap-2">
          <Badge variant={"secondary"} style={{ fontSize: "0.9rem" }}>
            {agentState == EAgentState.RUNNING && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-zinc-500"></div>
              </div>
            )}

            {currentStep !== 0 && (
              <p>
                {agentState == EAgentState.RUNNING ? "Running" : "Finished"}{" "}
                Step: {currentStep}/{maxStep}
              </p>
            )}
          </Badge>
        </div>

        {/* Input area */}
        <div className="flex flex-grow w-full items-center space-x-2 max-w-3xl mx-auto">
          <Textarea
            className="flex flex-1 flex-grow h-full"
            placeholder="What do you want to do?"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevents adding a new line
                onSendPrompt();
              }
            }}
          />
          <Button
            onClick={onSendPrompt}
            disabled={agentState == EAgentState.RUNNING}
          >
            <SendIcon />
          </Button>
          {agentState == EAgentState.RUNNING && (
            <Button
              disabled={disableStop}
              onClick={() => {
                fetch("/api/cancel");
                setDisableStop(true);
                setTimeout(() => {
                  setDisableStop(false);
                }, 6000);
              }}
            >
              <StopCircleIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
