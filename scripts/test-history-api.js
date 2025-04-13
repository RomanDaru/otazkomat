// This is a simple script to test the enhanced history API
// Run it with: node scripts/test-history-api.js

async function testHistoryAPI() {
  try {
    console.log("Testing history API...");

    // Get history with default parameters (page 1, pageSize 10, sort by recent)
    const response1 = await fetch("http://localhost:3000/api/history");
    const data1 = await response1.json();

    console.log("\n=== Default Parameters ===");
    console.log("Status:", response1.status);
    console.log("Pagination:", data1.pagination);
    console.log("Questions count:", data1.questions?.length || 0);

    if (data1.questions?.length > 0) {
      console.log("First question:", {
        id: data1.questions[0].id,
        content: data1.questions[0].content.substring(0, 30) + "...",
        voteSummary: data1.questions[0].voteSummary,
      });
    }

    // Get history with custom parameters (page 1, pageSize 5, sort by popular)
    const response2 = await fetch(
      "http://localhost:3000/api/history?page=1&pageSize=5&sortBy=popular"
    );
    const data2 = await response2.json();

    console.log("\n=== Custom Parameters (Popular) ===");
    console.log("Status:", response2.status);
    console.log("Pagination:", data2.pagination);
    console.log("Questions count:", data2.questions?.length || 0);

    if (data2.questions?.length > 0) {
      console.log("First question:", {
        id: data2.questions[0].id,
        content: data2.questions[0].content.substring(0, 30) + "...",
        askCount: data2.questions[0].askCount,
        voteSummary: data2.questions[0].voteSummary,
      });
    }

    console.log("\nAPI test completed");
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testHistoryAPI();
