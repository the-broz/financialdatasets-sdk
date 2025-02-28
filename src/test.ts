import { createFinancialDataTools } from "./tools.js";

/**
 * This test file verifies that the Financial Datasets SDK can be imported and used correctly
 */

// Check that the module can be imported and functions can be called
function testModuleImport() {
  console.log("Testing module import...");

  try {
    // Create the tools with a dummy API key
    const tools = createFinancialDataTools("test-api-key");

    // Verify that all expected tools are available
    const expectedTools = [
      "getIncomeStatements",
      "getBalanceSheets",
      "getCashFlowStatements",
      "getAllFinancialStatements",
      "getSegmentedRevenues",
      "searchFinancials",
      "searchLineItems",
      "getPriceSnapshot",
      "getPrices",
      "getCompanyFacts",
      "getFilings",
      "getInsiderTransactions",
      "getOptionsChain",
      "getFinancialMetricsSnapshot"
    ];

    const missingTools = expectedTools.filter(
      (toolName) => !(toolName in tools)
    );

    if (missingTools.length === 0) {
      console.log("✅ All expected tools are available");
    } else {
      console.error("❌ Some tools are missing:", missingTools);
      return false;
    }

    // Check that tools have the expected structure (tool with parameters schema and execute function)
    const sampleTool = tools.getIncomeStatements;

    if (!sampleTool.parameters) {
      console.error("❌ Tool is missing parameters schema");
      return false;
    }

    if (typeof sampleTool.execute !== "function") {
      console.error("❌ Tool is missing execute function");
      return false;
    }

    console.log("✅ Tool structure validation passed");

    // Test a tool's parameter schema (not actually executing the API call)
    const paramsSchema = sampleTool.parameters;
    console.log("📋 Params schema available:", !!paramsSchema);

    return true;
  } catch (error) {
    console.error("❌ Error testing module import:", error);
    return false;
  }
}

// Run the tests
(async () => {
  console.log("Running Financial Datasets SDK tests...");

  const importTestPassed = testModuleImport();

  if (importTestPassed) {
    console.log("✅ All tests passed!");
  } else {
    console.error("❌ Some tests failed");
    process.exit(1);
  }
})();
