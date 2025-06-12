
# Django API Integration Guide

This document outlines how to integrate your CyberXpert frontend with a Django REST framework backend using Django Simple JWT.

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Optional: Enable mock data fallback during development
VITE_ENABLE_MOCK_DATA=false

# App version
VITE_APP_VERSION=1.0.0
```

## Django Backend Requirements

Your Django backend should implement the following endpoints using Django REST framework with Django Simple JWT:

### Authentication Endpoints

- `GET /api/auth/csrf/` - Get CSRF token
- `POST /api/auth/token/` - JWT token obtain (login)
- `POST /api/auth/token/refresh/` - JWT token refresh
- `POST /api/auth/token/blacklist/` - JWT token blacklist (logout)
- `POST /api/auth/register/` - User registration
- `GET /api/auth/user/` - Get current user profile
- `PATCH /api/auth/user/` - Update user profile
- `POST /api/auth/upload-avatar/` - Upload user avatar

### Security Analysis Endpoints

- `POST /api/security/analyze/` - Start security analysis
- `GET /api/security/analyze/<id>/status/` - Get analysis status
- `GET /api/security/tests/` - Get user's test history
- `GET /api/security/tests/<id>/` - Get specific test details
- `GET /api/security/reports/` - Get user's security reports
- `GET /api/security/reports/<id>/` - Get specific report details
- `GET /api/security/analytics/` - Get analytics data
- `POST /api/security/tests/<id>/solve/` - Solve vulnerabilities
- `POST /api/security/tests/<id>/report/` - Generate detailed report

### Admin Endpoints

- `GET /api/admin/users/` - Get all users (Admin only)
- `POST /api/admin/users/` - Create new user (Admin only)
- `PATCH /api/admin/users/<id>/` - Update user (Admin only)
- `DELETE /api/admin/users/<id>/` - Delete user (Admin only)

## Django Settings Configuration

Your Django `settings.py` should include:

```python
from datetime import timedelta

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://your-frontend-domain.com",  # Production frontend
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Django Simple JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://your-frontend-domain.com",
]
```

## Authentication Flow

1. Frontend requests CSRF token from `/api/auth/csrf/`
2. User logs in via `/api/auth/token/` with CSRF token
3. Django returns access and refresh JWT tokens along with user data
4. Frontend stores both tokens in localStorage
5. All subsequent API calls include `Authorization: Bearer <access_token>` header
6. When access token expires (401 response), frontend automatically refreshes using refresh token
7. On logout, refresh token is blacklisted via `/api/auth/token/blacklist/`

## Data Models

The frontend expects the following data structures from your Django API:

### User Model (Django)
```python
class User(AbstractUser):
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('developer', 'Developer')])
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
```

### JWT Login Response Format
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin|developer",
    "is_active": true,
    "avatar": "url_string",
    "date_joined": "2023-01-01T00:00:00Z"
  }
}
```

### Pagination Format (Django REST Framework)
```json
{
  "count": 100,
  "next": "http://api.example.org/accounts/?page=4",
  "previous": "http://api.example.org/accounts/?page=2",
  "results": [...]
}
```

## Error Handling

Django REST framework returns consistent error responses:

```json
{
  "detail": "Error description"
}
```

For validation errors:
```json
{
  "field_name": ["Error message for field"],
  "non_field_errors": ["General error message"]
}
```

JWT specific errors:
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

## Required Django Packages

Install these packages in your Django backend:

```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install Pillow  # For image uploads
```

## Django URL Configuration

```python
# urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

urlpatterns = [
    # JWT token endpoints
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    
    # Custom auth endpoints
    path('api/auth/', include('authentication.urls')),
    path('api/security/', include('security.urls')),
    path('api/admin/', include('admin_panel.urls')),
]
```

## Development vs Production

- Development: `VITE_API_BASE_URL=http://localhost:8000/api`
- Production: `VITE_API_BASE_URL=https://your-django-api.com/api`

## Security Considerations

1. Use HTTPS in production
2. Configure CORS properly in Django settings
3. Set appropriate JWT token lifetimes
4. Use Django's built-in CSRF protection
5. Validate all user inputs with Django serializers
6. Enable JWT token blacklisting for secure logout
7. Use strong SECRET_KEY for JWT signing

## Testing the Integration

1. Start your Django development server: `python manage.py runserver`
2. Update the `VITE_API_BASE_URL` in your `.env` file
3. Run the frontend with `npm run dev`
4. Test login/signup functionality
5. Verify automatic token refresh works
6. Test logout with token blacklisting
7. Verify that security analysis works end-to-end

## Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Deploy Django backend to your server
4. Configure environment variables correctly in production
5. Set up proper domain and CORS configuration
6. Ensure JWT settings are production-ready (strong SECRET_KEY, appropriate token lifetimes)
