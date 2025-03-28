export type ToolCall = {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
};

export type Message = {
  role: string;
  content?: string;
  base64_image?: string;
  tool_calls?: ToolCall[];
  name?: string;
  tool_call_id?: string;
};

export interface MessageGroup {
  id: number;
  role: string;
  messages: Message[];
}
