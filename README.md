# Financial Datasets SDK / LLM Tool

A TypeScript SDK providing easy access to the Financial Datasets API, with built-in integrations for LLMs via the Vercel AI SDK.

![Example usage of tool](./docs/demo.gif)

## Features

- Complete TypeScript definitions for all Financial Datasets API endpoints
- Built-in integration with the Vercel AI SDK for LLM function calling
- Comprehensive error handling and request validation
- Clean, declarative API with proper parameter typing and documentation

## Installation

```bash
# Using npm
npm install financialdatasets-sdk

# Using Yarn
yarn add financialdatasets-sdk

# Using Bun
bun add financialdatasets-sdk
```

## Basic Usage

```typescript
import { createFinancialDataTools } from "financialdatasets-sdk";

// Initialize the tools with your API key
const financialTools = createFinancialDataTools("your-api-key-here");

// Use the tools directly
async function getAppleIncomeStatements() {
  const result = await financialTools.getIncomeStatements.execute({
    ticker: "AAPL",
    period: "annual",
    limit: 3
  });

  console.log(result);
}
```

## Using with LLMs (Vercel AI SDK)

The SDK is designed to work seamlessly with Large Language Models through the Vercel AI SDK's function calling capabilities.

### With Next.js App Router

```typescript
// app/api/chat/route.ts
import { StreamingTextResponse, ChatCompletionCreateParams } from "ai";
import { createFinancialDataTools } from "financialdatasets-sdk";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize financial tools
const financialTools = createFinancialDataTools(
  process.env.FINANCIAL_DATASETS_API_KEY!
);

// Define the tools we want to expose to the model
const tools: ChatCompletionCreateParams.Function[] = [
  financialTools.getIncomeStatements,
  financialTools.getBalanceSheets,
  financialTools.getPriceSnapshot,
  financialTools.getCompanyFacts
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages,
    tools,
    stream: true
  });

  return new StreamingTextResponse(response.body);
}
```

### With Anthropic's Claude

```typescript
// app/api/chat/route.ts
import { StreamingTextResponse } from "ai";
import { createFinancialDataTools } from "financialdatasets-sdk";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Initialize financial tools
const financialTools = createFinancialDataTools(
  process.env.FINANCIAL_DATASETS_API_KEY!
);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    messages,
    tools: [
      financialTools.getIncomeStatements,
      financialTools.getBalanceSheets,
      financialTools.getPriceSnapshot,
      financialTools.getCompanyFacts
    ],
    stream: true
  });

  return new StreamingTextResponse(response);
}
```

## Tool Reference

The SDK provides access to the following tools:

### Financial Statements

| Tool                        | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `getIncomeStatements`       | Get income statements for a company ticker              |
| `getBalanceSheets`          | Get balance sheets for a company ticker                 |
| `getCashFlowStatements`     | Get cash flow statements for a company ticker           |
| `getAllFinancialStatements` | Get all financial statements for a company ticker       |
| `getSegmentedRevenues`      | Get detailed, segmented revenue data for a company      |
| `searchFinancials`          | Search financial statements using filters               |
| `searchLineItems`           | Search for specific financial metrics across statements |

### Market Data

| Tool               | Description                                   |
| ------------------ | --------------------------------------------- |
| `getPriceSnapshot` | Get the real-time price snapshot for a ticker |
| `getPrices`        | Get historical price data for a ticker        |

### Company Information

| Tool                     | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `getCompanyFacts`        | Get company facts and details for a ticker                          |
| `getFilings`             | Get SEC filings for a company                                       |
| `getInsiderTransactions` | Get insider trades like purchases, sales, and holdings for a ticker |

### Options

| Tool              | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `getOptionsChain` | Get real-time options chain data for actively traded equities |

### Financial Metrics

| Tool                          | Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| `getFinancialMetricsSnapshot` | Get a real-time snapshot of key financial metrics and ratios for a ticker |

## Example LLM Prompts

When using the tools with LLMs, you can provide context about what the tools can do. Here are some example prompts:

### For Analysis Using Multiple Tools

```
You have access to financial data tools for accessing market and company data.
Please analyze Apple (AAPL) using the available tools:
1. Get the company facts
2. Check the latest stock price
3. Analyze the annual income statements for the last 3 years
4. Identify key trends in revenue, profit margins, and growth
```

### For Financial Comparisons

```
Please compare the financial performance of Tesla (TSLA) and Ford (F) over the last 2 years.
Use the financial tools to retrieve:
- Income statements (annual)
- Key financial metrics
- Current market valuation

Then provide an analysis of which company is performing better in terms of growth,
profitability, and financial health.
```

### For Technical Data Analysis

```
I'm considering investing in Microsoft (MSFT). Can you:
1. Get the historical price data for the past 3 months (daily interval)
2. Analyze the price trend
3. Check the most recent income statement
4. Look at the financial metrics snapshot
5. Recommend whether this seems like a good investment based on fundamentals and recent price action
```

## Advanced Configuration

### Custom Base URL

If you need to use a different API endpoint:

```typescript
const financialTools = createFinancialDataTools(
  "your-api-key-here",
  "https://custom-api-endpoint.com"
);
```

### Error Handling

All tools include built-in error handling:

```typescript
const result = await financialTools.getIncomeStatements.execute({
  ticker: "INVALID_TICKER",
  period: "annual"
});

if ("error" in result) {
  console.error(`Error: ${result.error} - ${result.message}`);
} else {
  // Process successful result
  console.log(result.income_statements);
}
```

## Development

### Building the SDK

```bash
# Install dependencies
bun install

# Build the SDK
bun run build

# Generate API client from OpenAPI spec
bun run generate
```

## License

MIT
