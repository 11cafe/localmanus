export const exampleMessages = [
  {
    role: "user",
    content: "aapl stock trends this year",
  },
  {
    role: "user",
    content:
      '\nWhat should I do next to achieve my goal?\n\nWhen you see [Current state starts here], focus on the following:\n- Current URL and page title\n- Available tabs\n- Interactive elements and their indices\n- Content above or below the viewport (if indicated)\n- Any action results or errors\n\nFor browser interactions:\n- To navigate: browser_use with action="go_to_url", url="..."\n- To click: browser_use with action="click_element", index=N\n- To type: browser_use with action="input_text", index=N, text="..."\n- To extract: browser_use with action="extract_content", goal="..."\n- To scroll: browser_use with action="scroll_down" or "scroll_up"\n\nConsider both what\'s visible and what might be beyond the current viewport.\nBe methodical - remember your progress and what you\'ve learned so far.\n',
  },
  {
    role: "assistant",
    content: "",
    tool_calls: [
      {
        id: "call_qfBdisSyooqpTkqeJh5K2fmi",
        type: "function",
        function: {
          name: "browser_use",
          arguments: '{"action":"web_search","query":"AAPL stock trends 2023"}',
        },
      },
    ],
  },
  {
    role: "tool",
    content:
      "Observed output of cmd `browser_use` executed:\nSearched for 'AAPL stock trends 2023' and navigated to first result: https://finance.yahoo.com/quote/AAPL/history/\nAll results:https://finance.yahoo.com/quote/AAPL/history/\nhttps://finance.yahoo.com/quote/AAPL/analysis/\nhttps://investor.apple.com/stock-price/default.aspx\nhttps://www.macrotrends.net/stocks/charts/AAPL/apple/stock-price-history\nhttps://edition.cnn.com/markets/stocks/AAPL\nhttps://www.tradingview.com/symbols/NASDAQ-AAPL/\nhttps://www.cnbc.com/2023/12/29/apple-underperformed-mega-cap-peers-in-2023-due-to-revenue-slide.html\nhttps://www.investopedia.com/watch-these-apple-stock-price-levels-as-sell-off-continues-aapl-11695277\nhttps://www.nasdaq.com/articles/after-over-a-40-rally-in-2023-will-antitrust-and-iphone-issues-hurt-apple-stock\nhttps://www.forbes.com/sites/greatspeculations/2023/11/20/up-45-since-the-beginning-of-2023-where-is-apple-stock-headed/",
    name: "browser_use",
    tool_call_id: "call_qfBdisSyooqpTkqeJh5K2fmi",
  },
  {
    role: "user",
    content: "Current browser screenshot:",
  },
  {
    role: "user",
    content:
      '\nWhat should I do next to achieve my goal?\n\nWhen you see [Current state starts here], focus on the following:\n- Current URL and page title\n   URL: https://finance.yahoo.com/quote/AAPL/history/\n   Title: Apple Inc. (AAPL) Stock Historical Prices & Data - Yahoo Finance\n- Available tabs\n   1 tab(s) available\n- Interactive elements and their indices\n- Content above or below the viewport (if indicated)\n- Any action results or errors\n\nFor browser interactions:\n- To navigate: browser_use with action="go_to_url", url="..."\n- To click: browser_use with action="click_element", index=N\n- To type: browser_use with action="input_text", index=N, text="..."\n- To extract: browser_use with action="extract_content", goal="..."\n- To scroll: browser_use with action="scroll_down" or "scroll_up"\n\nConsider both what\'s visible and what might be beyond the current viewport.\nBe methodical - remember your progress and what you\'ve learned so far.\n',
  },
  {
    role: "assistant",
    content: "",
    tool_calls: [
      {
        id: "call_EipLZDcTsPr5VrqNPtjigWsc",
        type: "function",
        function: {
          name: "browser_use",
          arguments:
            '{"action":"extract_content","goal":"AAPL stock trends for 2023"}',
        },
      },
    ],
  },
  {
    role: "tool",
    content:
      'Observed output of cmd `browser_use` executed:\nExtracted from page:\n{\n  "text": "The page content provided does not contain specific information about AAPL stock trends for 2023. It primarily includes a list of links and some historical stock data for 2024 and 2025. The page also mentions an error message \'Oops, something went wrong,\' indicating that the intended content might not have been loaded properly. For AAPL stock trends in 2023, it would be necessary to access a different source or ensure the correct page is loaded."\n}\n',
    name: "browser_use",
    tool_call_id: "call_EipLZDcTsPr5VrqNPtjigWsc",
  },
  {
    role: "user",
    content: "Current browser screenshot:",
  },
  {
    role: "user",
    content:
      '\nWhat should I do next to achieve my goal?\n\nWhen you see [Current state starts here], focus on the following:\n- Current URL and page title\n   URL: https://finance.yahoo.com/quote/AAPL/history/\n   Title: Apple Inc. (AAPL) Stock Historical Prices & Data - Yahoo Finance\n- Available tabs\n   1 tab(s) available\n- Interactive elements and their indices\n- Content above or below the viewport (if indicated)\n- Any action results or errors\n\nFor browser interactions:\n- To navigate: browser_use with action="go_to_url", url="..."\n- To click: browser_use with action="click_element", index=N\n- To type: browser_use with action="input_text", index=N, text="..."\n- To extract: browser_use with action="extract_content", goal="..."\n- To scroll: browser_use with action="scroll_down" or "scroll_up"\n\nConsider both what\'s visible and what might be beyond the current viewport.\nBe methodical - remember your progress and what you\'ve learned so far.\n',
  },
];
