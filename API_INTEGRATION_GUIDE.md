
# API Integration Guide

This document outlines how to integrate your CyberXpert frontend with a backend API.

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Optional: Enable mock data fallback during development
VITE_ENABLE_MOCK_DATA=false

# App version
VITE_APP_VERSION=1.0.0
```

## Backend API Requirements

Your backend API should implement the following endpoints:

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh authentication token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Security Analysis Endpoints

- `POST /api/security/analyze` - Start security analysis
- `GET /api/security/analyze/:id/status` - Get analysis status
- `GET /api/security/tests` - Get user's test history
- `GET /api/security/tests/:id` - Get specific test details
- `GET /api/security/reports` - Get user's security reports
- `GET /api/security/reports/:id` - Get specific report details
- `GET /api/security/analytics` - Get analytics data
- `POST /api/security/tests/:id/solve` - Solve vulnerabilities
- `POST /api/security/tests/:id/report` - Generate detailed report

### Admin Endpoints

- `GET /api/admin/users` - Get all users (Admin only)
- `POST /api/admin/users` - Create new user (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend returns user data and JWT tokens
3. Frontend stores tokens in localStorage
4. All subsequent API calls include `Authorization: Bearer <token>` header
5. Token refresh is handled automatically when tokens expire

## Data Models

The frontend expects the following data structures from your API:

### User Model
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "Dev";
  status: "active" | "suspended";
  avatarUrl?: string;
  createdAt: string;
}
```

### Test History Model
```typescript
interface TestHistoryItem {
  id: string;
  date: string;
  time: string;
  status: "completed" | "failed" | "pending";
  createdBy?: {
    id: string;
    username: string;
  };
  details: {
    duration: string;
    components: number;
    vulnerabilities: number;
    score: number;
    vulnerabilityDetails?: VulnerabilityDetail[];
    mitigationApplied?: boolean;
    mitigationSuccess?: boolean;
  };
}
```

### Report Model
```typescript
interface ReportItem {
  id: string;
  date: string;
  time: string;
  read: boolean;
  createdBy?: {
    id: string;
    username: string;
  };
  securityPosture: {
    score: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    details: string;
  };
}
```

## Error Handling

The API should return consistent error responses:

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Development vs Production

- Set `VITE_API_BASE_URL` to your backend URL
- For development: `http://localhost:3001/api`
- For production: `https://your-api-domain.com/api`

## Security Considerations

1. Use HTTPS in production
2. Implement proper CORS policies
3. Validate JWT tokens on every request
4. Implement rate limiting
5. Sanitize all user inputs
6. Use secure password hashing (bcrypt)

## Testing the Integration

1. Start your backend API server
2. Update the `VITE_API_BASE_URL` in your `.env` file
3. Run the frontend with `npm run dev`
4. Test login/signup functionality
5. Verify that security analysis works end-to-end

## Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are set correctly in production
4. Configure your reverse proxy/CDN to route API calls to your backend
