<xaiArtifact artifact_id="5e8d3016-b7bf-4a6b-842c-1b168d3f324a" artifact_version_id="a7eb171c-cdf8-4c07-bfa1-9b6751fa23d0" title="README.md" contentType="text/markdown">

# TECHZU Frontend Setup Guide

## Prerequisites
- Node.js (latest stable version recommended)
- npm (comes with Node.js)

## Installation
1. Install Node Version Manager (nvm) to manage Node.js versions:
   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```
   Follow the instructions to add nvm to your shell profile.
2. Install the latest Node.js version using nvm:
   ```
   nvm install node
   ```
   Verify installation with `node -v`.
3. Open a terminal in the project directory.
4. Run the following command to install the required packages:
   ```
   npm i
   ```

## Running the Application
1. After installing the packages, start the frontend by running:
   ```
   npm run dev
   ```
2. Open your browser and navigate to the provided local URL (usually `http://localhost:5173` by default).