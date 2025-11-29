FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Install Playwright browsers
RUN npx playwright install

# Create directory for test results
RUN mkdir -p test-results playwright-report

# Set environment variables for CI
ENV CI=true
ENV PLAYWRIGHT_HEADLESS=true

# Run tests
CMD ["npm", "test"]