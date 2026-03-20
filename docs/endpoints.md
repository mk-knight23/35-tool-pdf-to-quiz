# API Documentation

## Overview

- Base URL: Varies by deployment
- Format: JSON

## Endpoints

### GET /
Returns the main application.

Response: HTML SPA

### GET /api/health
Health check endpoint.

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}

## Error Handling

- 200: Success
- 404: Not Found
- 500: Server Error
