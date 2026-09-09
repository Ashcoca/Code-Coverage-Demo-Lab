import { defineConfig } from 'vitest/config';

// Test coverage configuration.
// The thresholds below are the gate the GitHub Actions pipeline enforces.
// this single place is where you raise or lower the bar, but don't do that! No cheating!

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/lib/**'],
      // Here are the global thresholds
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
