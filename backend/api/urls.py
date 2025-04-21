from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    UserDetailView,
    AppointmentViewSet,
    ContactMessageView,
    DocumentUploadViewSet,
    CaseUpdateViewSet,
    CaseSummaryViewSet
)

# Set up the router for the ViewSets
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')  # Fixed: added to router
router.register(r'documents', DocumentUploadViewSet, basename='document')
router.register(r'case-updates', CaseUpdateViewSet, basename='case-update')
router.register(r'case-summaries', CaseSummaryViewSet, basename='case-summary')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),  # Fixed .as_view()
    path('user/', UserDetailView.as_view(), name='user_detail'),  # Fixed .as_view()
    path('contact/', ContactMessageView.as_view(), name='contact-message'),  # Fixed .as_view()

    # Include the ViewSet routes
    path('', include(router.urls)),
]
