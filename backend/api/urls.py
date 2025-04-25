from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    UserDetailView,
    UserViewSet,
    AppointmentViewSet,
    ContactMessageViewSet,
    DocumentViewSet,
    CaseUpdateViewSet,
    CaseSummaryViewSet,
    LawyerListAPIView,
    UserByEmailView
)


router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')  
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'case-updates', CaseUpdateViewSet, basename='case-update')
router.register(r'case-summaries', CaseSummaryViewSet, basename='case-summary')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')
router.register(r'case-summary/(?P<case_summary_id>\d+)/updates', CaseUpdateViewSet, basename='case-update-for-case-summary')
router.register(r'case-summary/(?P<case_summary_id>\d+)/documents', DocumentViewSet, basename='case-document-for-case-summary')
router.register(r'user-role', UserViewSet, basename='user-role')


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),  
    path('user/', UserDetailView.as_view(), name='user_detail'),  
    path('lawyers/', LawyerListAPIView.as_view(), name='lawyer-list'),
     path('user-by-email/', UserByEmailView.as_view(), name='user-by-email'),

    
    path('', include(router.urls)),
]
