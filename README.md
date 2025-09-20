# AweFullApp-MVP-BinnacleGenerator
MVP v1.0 of the AweFull People app. Simplified version for binnacle creation without AI APIs or integrations.

-------


# Awe Binnacle MVP

A simple web app to capture moments of awe, generating AI-enhanced text binacles for reflection and sharing. Inspired by Thomas Berry's vision of interconnectedness.

## Setup
- Clone repo
- npm install
- Develop locally, push to GitHub for Vercel deploy

## Files
- index.html: UI structure
- styles.css: Layout
- script.js: Frontend logic
- api/generate-binnacle.js: Backend function

## How Files Connect

These files connect like this: index.html loads styles.css for looks and script.js for behavior. script.js will later send data to /api/generate-binnacle (handled by Vercel). The APIs act like "librarians"—OpenStreetMap provides place details (coords/description), Wikipedia facts, Quotable quotes, and Hugging Face weaves in reflective insights, all to enrich the user's input into a meaningful narrative.


## Debug Tip

If something breaks (e.g., file not found), use console.log('Test') in script.js, refresh the page, and check browser console (F12 > Console).
