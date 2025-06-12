
# Django API Integration Guide

This document outlines how to integrate your CyberXpert frontend with a Django REST framework backend.

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

Your Django backend should implement the following endpoints using Django REST framework:

### Authentication Endpoints

- `GET /api/auth/csrf/` - Get CSRF token
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
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
# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://your-frontend-domain.com",  # Production frontend
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://your-frontend-domain.com",
]
```

## Authentication Flow

1. Frontend requests CSRF token from `/api/auth/csrf/`
2. User logs in via `/api/auth/login/` with CSRF token
3. Django returns user data and authentication token
4. Frontend stores token in localStorage
5. All subsequent API calls include `Authorization: Token <token>` header
6. CSRF token is included in state-changing requests

## Data Models

The frontend expects the following data structures from your Django API:

### User Model (Django)
```python
class User(AbstractUser):
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('developer', 'Developer')])
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
```

### API Response Format
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "admin|developer",
  "is_active": true,
  "avatar": "url_string",
  "date_joined": "2023-01-01T00:00:00Z"
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

## Required Django Packages

Install these packages in your Django backend:

```bash
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install djangorestframework-simplejwt  # Optional: for JWT tokens
pip install Pillow  # For image uploads
```

## Django URL Configuration

```python
# urls.py
from django.urls import path, include

urlpatterns = [
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
3. Implement proper Django permissions and authentication
4. Use Django's built-in CSRF protection
5. Validate all user inputs with Django serializers
6. Use Django's secure password hashing

## Testing the Integration

1. Start your Django development server: `python manage.py runserver`
2. Update the `VITE_API_BASE_URL` in your `.env` file
3. Run the frontend with `npm run dev`
4. Test login/signup functionality
5. Verify that security analysis works end-to-end

## Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Deploy Django backend to your server
4. Configure environment variables correctly in production
5. Set up proper domain and CORS configuration
