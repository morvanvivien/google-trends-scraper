// Minimal example: run the google-trends-scraper Actor and print the results.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    "searchTerms": [
        "ChatGPT",
        "Claude AI",
        "Gemini AI"
    ],
    "geo": "US",
    "timeRange": "today 12-m",
    "interestOverTime": true,
    "relatedQueries": true
};

const run = await client.actor('bibian/google-trends-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} rows`);
for (const item of items.slice(0, 10)) {
    console.log(`${item.searchTerm} | ${item.date ?? item.query ?? item.topic ?? ''} | ${item.value ?? ''}`);
}
