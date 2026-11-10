"""Minimal example: run the google-trends-scraper Actor and print the results.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
    "searchTerms": ["ChatGPT", "Claude AI", "Gemini AI"],
    "geo": "US",
    "timeRange": "today 12-m",
    "interestOverTime": True,
    "relatedQueries": True,
}

run = client.actor("bibian/google-trends-scraper").call(run_input=run_input)

count = 0
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    count += 1
    if count <= 10:
        label = item.get("date") or item.get("query") or item.get("topic") or ""
        print(f"{item.get('searchTerm')} | {label} | {item.get('value', '')}")
print(f"{count} rows")
