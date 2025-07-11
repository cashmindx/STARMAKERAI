#!/bin/bash

echo "Installing Genkit dependencies..."

# Install npm dependencies
npm install @genkit-ai/ai @genkit-ai/core @genkit-ai/flow @genkit-ai/googleai genkit

# Install dev dependencies
npm install --save-dev @types/node typescript

echo "Dependencies installed successfully!"
echo "You may also need to set up your Google AI API key:"
echo "export GOOGLE_GENAI_API_KEY=your_api_key_here"