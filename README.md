# Satbara AI Analyzer

A React-based application for instantly analyzing and simplifying Maharashtra Land Records (7/12, 8A, Property Card).

## How It Works

This application operates as a **Client-Side AI Tool**, meaning your documents are processed securely in your browser session without being stored on a backend server.

### The Analysis Pipeline
1.  **Input**: You upload a PDF or Image.
2.  **Preprocessing**: The app converts the file into a format suitable for Large Language Models (LLMs).
3.  **AI Processing**:
    *   The file is sent to the selected AI provider (Google Gemini or Mistral) via their secure API.
    *   The AI performs **OCR (Optical Character Recognition)** to read the Marathi text.
    *   It **Classifies** the document type (e.g., distinguishing a 7/12 form from an 8A holding sheet).
    *   It **Extracts** structured data: Owner names, areas (converted to Acres/Sq.Ft), loan liabilities, and crop details.
4.  **Valuation Engine**: A secondary AI call analyzes the location details (Village, Taluka) to estimate current market rates.
5.  **Visualization**: The raw JSON data is rendered into a clean, modern UI for easy reading and printing.

## Project Structure
The application has been refactored into a modular architecture for better maintainability:

-   `src/components`: UI elements (Upload, Results, Charts)
-   `src/services`: AI integration logic and API interaction
-   `src/utils`: Helper functions for data formatting and calculations
-   `src/types`: TypeScript definitions for strongly typed data models
-   `src/styles`: Shared style constants and animations

## Tech Stack
-   **Frontend**: React (TypeScript), Vite
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **AI Integration**: `@google/genai` (Gemini), `@mistralai/mistralai`

## Privacy & Security
-   **Zero Persistence**: No database. No storage.
-   **Encrypted Transport**: All API calls use TLS 1.3.
-   **Local Session**: Refreshing the page clears all sensitive data instantly.
