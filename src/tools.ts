import { z } from "zod";
import axios from "axios";
import { tool } from "ai";

// Type definitions for common API parameters
const tickerParam = z.string().describe("The ticker symbol of the company");
const periodParam = z
  .enum(["annual", "quarterly", "ttm"])
  .describe("The time period of the financial statements");
const limitParam = z
  .number()
  .nullable()
  .describe("The maximum number of results to return");
const cikParam = z
  .string()
  .nullable()
  .describe("The Central Index Key (CIK) of the company");

/**
 * Create financial data API tools for the Vercel AI SDK
 * @param apiKey - Your Financial Datasets API key
 * @param baseUrl - API base URL (defaults to production URL)
 * @returns An object containing all the API tools
 */
export function createFinancialDataTools(
  apiKey: string,
  baseUrl = "https://api.financialdatasets.ai"
) {
  // Create axios instance with common config
  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json"
    }
  });

  // Generic error handler for API requests
  const handleApiError = (error: any) => {
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx range
      return {
        error: error.response.data.error || "API Error",
        message: error.response.data.message || error.response.statusText,
        status: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        error: "No Response",
        message: "The API request timed out or received no response"
      };
    } else {
      // Something happened in setting up the request
      return {
        error: "Request Error",
        message: error.message
      };
    }
  };

  // Create a collection of tools based on the API spec
  return {
    // === Financial Statements Tools ===
    getIncomeStatements: tool({
      description: "Get income statements for a company ticker",
      parameters: z.object({
        ticker: tickerParam,
        period: periodParam,
        limit: limitParam,
        cik: cikParam
      }),
      execute: async ({ ticker, period, limit, cik }) => {
        try {
          const params: Record<string, any> = { ticker, period };
          if (limit) params.limit = limit;
          if (cik) params.cik = cik;

          const response = await api.get("/financials/income-statements", {
            params
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getBalanceSheets: tool({
      description: "Get balance sheets for a company ticker",
      parameters: z.object({
        ticker: tickerParam,
        period: periodParam,
        limit: limitParam,
        cik: cikParam
      }),
      execute: async ({ ticker, period, limit, cik }) => {
        try {
          const params: Record<string, any> = { ticker, period };
          if (limit) params.limit = limit;
          if (cik) params.cik = cik;

          const response = await api.get("/financials/balance-sheets", {
            params
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getCashFlowStatements: tool({
      description: "Get cash flow statements for a company ticker",
      parameters: z.object({
        ticker: tickerParam,
        period: periodParam,
        limit: limitParam,
        cik: cikParam
      }),
      execute: async ({ ticker, period, limit, cik }) => {
        try {
          const params: Record<string, any> = { ticker, period };
          if (limit) params.limit = limit;
          if (cik) params.cik = cik;

          const response = await api.get("/financials/cash-flow-statements", {
            params
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getAllFinancialStatements: tool({
      description:
        "Get all financial statements (income, balance sheets, cash flow) for a company ticker",
      parameters: z.object({
        ticker: tickerParam,
        period: periodParam,
        limit: limitParam,
        cik: cikParam
      }),
      execute: async ({ ticker, period, limit, cik }) => {
        try {
          const params: Record<string, any> = { ticker, period };
          if (limit) params.limit = limit;
          if (cik) params.cik = cik;

          const response = await api.get("/financials", { params });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getSegmentedRevenues: tool({
      description: "Get detailed, segmented revenue data for a company",
      parameters: z.object({
        ticker: tickerParam,
        period: z
          .enum(["annual", "quarterly"])
          .describe("The time period of revenue data"),
        limit: limitParam,
        cik: cikParam
      }),
      execute: async ({ ticker, period, limit, cik }) => {
        try {
          const params: Record<string, any> = { ticker, period };
          if (limit) params.limit = limit;
          if (cik) params.cik = cik;

          const response = await api.get("/financials/segmented-revenues", {
            params
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    searchFinancials: tool({
      description: "Search financial statements using filters",
      parameters: z.object({
        filters: z
          .array(
            z.object({
              field: z.string().describe("The criteria to filter on"),
              operator: z
                .enum(["gt", "lt", "gte", "lte", "eq", "in"])
                .describe("The comparison operator"),
              value: z
                .union([z.number(), z.array(z.string())])
                .describe("The value to compare against")
            })
          )
          .describe("An array of filter objects to apply to the search"),
        period: z
          .enum(["annual", "quarterly", "ttm"])
          .nullable()
          .describe("The time period for the financial data"),
        limit: z
          .number()
          .nullable()
          .describe("The maximum number of results to return"),
        order_by: z
          .enum(["ticker", "-ticker", "report_period", "-report_period"])
          .nullable()
          .describe("The field to order the results by"),
        currency: z
          .enum(["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "SEK"])
          .nullable()
          .describe("The currency of the financial data")
      }),
      execute: async ({ filters, period, limit, order_by, currency }) => {
        try {
          const requestBody: Record<string, any> = { filters };
          if (period) requestBody.period = period;
          if (limit) requestBody.limit = limit;
          if (order_by) requestBody.order_by = order_by;
          if (currency) requestBody.currency = currency;

          const response = await api.post("/financials/search", requestBody);
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    searchLineItems: tool({
      description: "Search for specific financial metrics across statements",
      parameters: z.object({
        line_items: z
          .array(z.string())
          .describe("Financial metrics to search for"),
        tickers: z
          .array(z.string())
          .describe("Array of ticker symbols to search"),
        period: z
          .enum(["annual", "quarterly", "ttm"])
          .nullable()
          .describe("The time period for the financial data"),
        limit: z
          .number()
          .nullable()
          .describe("The maximum number of results per ticker to return")
      }),
      execute: async ({ line_items, tickers, period, limit }) => {
        try {
          const requestBody: Record<string, any> = { line_items, tickers };
          if (period) requestBody.period = period;
          if (limit) requestBody.limit = limit;

          const response = await api.post(
            "/financials/search/line-items",
            requestBody
          );
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    // === Market Data Tools ===
    getPriceSnapshot: tool({
      description: "Get the real-time price snapshot for a ticker",
      parameters: z.object({
        ticker: tickerParam
      }),
      execute: async ({ ticker }) => {
        try {
          const response = await api.get("/prices/snapshot", {
            params: { ticker }
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getPrices: tool({
      description: "Get historical price data for a ticker",
      parameters: z.object({
        ticker: tickerParam,
        interval: z
          .enum(["second", "minute", "day", "week", "month", "quarter", "year"])
          .describe("The time interval for the price data"),
        interval_multiplier: z
          .number()
          .describe("The multiplier for the interval"),
        start_date: z
          .string()
          .describe("The start date for the price data (format: YYYY-MM-DD)"),
        end_date: z
          .string()
          .describe("The end date for the price data (format: YYYY-MM-DD)"),
        limit: z
          .number()
          .nullable()
          .describe(
            "The maximum number of price records to return (default: 5000, max: 5000)"
          )
      }),
      execute: async ({
        ticker,
        interval,
        interval_multiplier,
        start_date,
        end_date,
        limit
      }) => {
        try {
          const params = {
            ticker,
            interval,
            interval_multiplier,
            start_date,
            end_date,
            limit
          };
          const response = await api.get("/prices", { params });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    // === Company Information Tools ===
    getCompanyFacts: tool({
      description: "Get company facts and details for a ticker",
      parameters: z.object({
        ticker: tickerParam
      }),
      execute: async ({ ticker }) => {
        try {
          const response = await api.get("/company/facts", {
            params: { ticker }
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getFilings: tool({
      description: "Get SEC filings for a company",
      parameters: z
        .object({
          ticker: z.string().nullable().describe("The ticker symbol"),
          cik: z
            .string()
            .nullable()
            .describe("The Central Index Key (CIK) of the company")
        })
        .refine((data) => data.ticker || data.cik, {
          message: "Either ticker or cik must be provided"
        }),
      execute: async ({ ticker, cik }) => {
        try {
          const params: Record<string, any> = {};
          if (ticker) params.ticker = ticker;
          if (cik) params.cik = cik;

          const response = await api.get("/filings", { params });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    getInsiderTransactions: tool({
      description:
        "Get insider trades like purchases, sales, and holdings for a ticker",
      parameters: z.object({
        ticker: tickerParam,
        limit: z
          .number()
          .nullable()
          .describe(
            "The maximum number of transactions to return (default: 10)"
          )
      }),
      execute: async ({ ticker, limit }) => {
        try {
          const params: Record<string, any> = { ticker };
          if (limit) params.limit = limit;

          const response = await api.get("/insider-transactions", { params });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    // === Options Tools ===
    getOptionsChain: tool({
      description:
        "Get real-time options chain data for actively traded equities",
      parameters: z.object({
        ticker: tickerParam,
        strike_price: z
          .number()
          .nullable()
          .describe("The strike price of the options contract"),
        option_type: z
          .enum(["call", "put"])
          .nullable()
          .describe("The type of option contract (call or put)"),
        expiration_date: z
          .string()
          .nullable()
          .describe("The expiration date of the options contract (YYYY-MM-DD)")
      }),
      execute: async ({
        ticker,
        strike_price,
        option_type,
        expiration_date
      }) => {
        try {
          const params: Record<string, any> = { ticker };
          if (strike_price) params.strike_price = strike_price;
          if (option_type) params.option_type = option_type;
          if (expiration_date) params.expiration_date = expiration_date;

          const response = await api.get("/options/chain", { params });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    }),

    // === Financial Metrics Tools ===
    getFinancialMetricsSnapshot: tool({
      description:
        "Get a real-time snapshot of key financial metrics and ratios for a ticker",
      parameters: z.object({
        ticker: tickerParam
      }),
      execute: async ({ ticker }) => {
        try {
          const response = await api.get("/financial-metrics/snapshot", {
            params: { ticker }
          });
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
    })
  };
}
