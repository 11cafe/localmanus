import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, MessageGroup, ToolCall } from "./types/types";

const ChatInterface = ({
  messages: exampleMessages,
}: {
  messages: Message[];
}) => {
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
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chat header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Chat
        </h1>
      </header>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {processedMessages.map((group) => (
            <div
              key={group.id}
              className={`flex flex-col space-y-2 ${
                group.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Role label */}
              <div
                className={`flex items-center ${
                  group.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                } space-x-2`}
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-sm">
                  {group.role === "user" ? "👤" : "🤖"}
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {group.role === "user" ? "You" : "Assistant"}
                </span>
              </div>

              {/* Messages */}
              <div
                className={`${
                  group.role === "user"
                    ? "mr-10 items-end"
                    : "ml-10 items-start"
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
                        className={`${
                          group.role === "user"
                            ? "bg-blue-100 dark:bg-blue-900 dark:text-gray-100 rounded-2xl p-3 max-w-[90%] text-right"
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
      </ScrollArea>

      {/* Chat input */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <div className="flex items-end space-x-2 max-w-3xl mx-auto">
          <textarea
            className="flex-1 min-h-[60px] max-h-[200px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            rows={2}
          />
          <button className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
