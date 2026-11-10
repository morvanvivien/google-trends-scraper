# How to Scrape Google Trends: Interest Over Time, by Region, Related Queries and Topics

> **Run it now, no code: [google-trends-scraper on the Apify Store](https://apify.com/bibian/google-trends-scraper)** &nbsp;|&nbsp; $2.00 per 1,000 rows &nbsp;|&nbsp; no login, no captcha, no browser

Google Trends has no official public API for third parties. This guide shows how to get its own data as clean structured rows: interest over time, interest by region, related queries, related topics, and the daily trending-searches feed for any country, with a free Apify Actor, from the console or from code.

Searches this page answers: google trends scraper, google trends API, trends data export, trending searches by country, related queries scraper.

## What you get from the Google Trends scraper

- Interest over time for up to 25 search terms (compared 5 at a time, Google's own limit), any region and time range.
- Interest by region: the same term broken down by country or sub-region.
- Related queries and related topics: the "top" and "rising" searches and topics Google itself associates with a term.
- Trending now: today's trending searches for any country, with approximate traffic and the news stories behind each trend.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five rows from a live run) is in [`sample-output.json`](sample-output.json).

## Output fields

One record per data point; the shape depends on which kind of row it is.

| Field | What it is |
|---|---|
| `searchTerm`, `geo`, `timeRange` | What was measured, where, and over what period |
| `date`, `value`, `isPartial` | Interest-over-time row: the date, the 0-100 interest value, and whether Google still considers it provisional |
| `region`, `regionValue` | Interest-by-region row: a country or sub-region and its 0-100 value |
| `query` / `topic`, `relatedValue`, `type` | Related-queries/topics row: the related search or topic, its relative value, and `top` or `rising` |
| `trendingQuery`, `trafficLabel`, `relatedNews` | Trending-now row: today's trending search, its approximate traffic, and the news articles driving it |

## Use cases

- **Track a term's interest over time.** Weekly or daily search-interest values for any term, country and time range, ready for a dashboard or a report.
- **Compare up to 5 terms at once.** Google's own comparison mode, normalized on the same 0-100 scale, in one call.
- **Find related queries and topics.** The exact "top" and "rising" searches and topics Google shows on its own site for a term.
- **Watch what is trending right now.** Today's trending searches for any country, with the news stories driving each trend — a daily feed, not a one-off lookup.

## Input

| Field | What it does |
|---|---|
| `searchTerms` | 1 to 25 terms to compare. More than 5 are split into separate batches that do not share a scale. |
| `geo` | Empty for worldwide, a country code (`US`, `FR`), or a sub-region (`US-CA`, `GB-LON`). |
| `timeRange` | A Google Trends range (`now 7-d`, `today 12-m`, `today 5-y`, `all`...) or two ISO dates for a custom range. |
| `interestOverTime` / `interestByRegion` / `relatedQueries` / `relatedTopics` | Which outputs to fetch. At least one is required when search terms are given. |
| `trendingNow`, `trendingGeo` | A separate mode: today's trending searches for one country, with or without search terms. |

Example input:

```json
{
  "searchTerms": [
    "ChatGPT",
    "Claude AI",
    "Gemini AI"
  ],
  "geo": "US",
  "timeRange": "today 12-m",
  "interestOverTime": true,
  "relatedQueries": true
}
```

## Four ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/google-trends-scraper) and click **Try for free** (a free Apify account is enough).
2. Fill in the input form (search terms, region, time range) and click **Start**.
3. When the run finishes, open the **Output** tab, check the table, then **Export** as CSV, Excel or JSON.
4. For a daily trending-searches feed, open **Schedules**, create a daily schedule with `trendingNow` turned on.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/google-trends-scraper').call({
    "searchTerms": ["ChatGPT", "Claude AI", "Gemini AI"],
    "geo": "US",
    "timeRange": "today 12-m",
    "interestOverTime": true,
    "relatedQueries": true
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const item of items.slice(0, 10)) {
    console.log(`${item.searchTerm} | ${item.date ?? item.query ?? item.topic ?? ''} | ${item.value ?? ''}`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later).

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/google-trends-scraper").call(run_input={
    "searchTerms": ["ChatGPT", "Claude AI", "Gemini AI"],
    "geo": "US",
    "timeRange": "today 12-m",
    "interestOverTime": True,
    "relatedQueries": True,
})

for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"{item.get('searchTerm')} | {item.get('date') or item.get('query') or item.get('topic') or ''} | {item.get('value', '')}")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

### 4. Daily trending searches, scheduled

Set `trendingNow` to `true` with a `trendingGeo` country code and no search terms, then add an Apify **Schedule** to run it once a day. Each run delivers that day's trending searches for the country you chose, with the news stories behind each trend.

## Pricing

Pay per result: **$2.00 per 1,000 rows** (that is $0.002 per row), plus a tiny start fee per run. You pay only for the rows saved to the dataset. Apify's free plan includes monthly credits, enough to try it on a few hundred rows. Prices are those shown on the [Store page](https://apify.com/bibian/google-trends-scraper) when this guide was written; the Store page is the reference.

## Limits and honest notes

- Comparing 2 to 5 terms in the same call drops the related-topics output entirely: Google itself only returns related topics when a single term is queried alone.
- This Actor reads Google Trends' own data endpoints directly; no login, no captcha and no browser are involved, so runs are fast and cheap.
- This is an unofficial tool, not affiliated with Google. Check the site terms that apply to your use.

## FAQ

**Does it need a browser or a proxy?**  
No. The Actor reads Google Trends' own API endpoints directly.

**Can I compare more than 5 terms?**  
Yes, give up to 25: they are split into separate batches of 5 that do not share a 0-100 scale with each other.

**Can I get a daily trending-searches feed?**  
Yes. Set `trendingNow` to `true`, pick a `trendingGeo` country, and schedule the Actor once a day.

**Can I get the data in Excel or Google Sheets?**  
Yes. Export the dataset as CSV, Excel or JSON from the Apify console, or connect the Apify Google Sheets integration.

## Try it

**[Open google-trends-scraper on the Apify Store](https://apify.com/bibian/google-trends-scraper)**

The code in `examples/` is released under the MIT license (see [LICENSE](LICENSE)). The data belongs to its original publisher, Google.
