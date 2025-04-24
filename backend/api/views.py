from rest_framework import generics, status, permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Document, CaseSummary, CaseUpdate, Appointment, ContactMessage
from .serializers import (
    RegisterSerializer, UserSerializer, AppointmentSerializer,
    ContactMessageSerializer, DocumentSerializer, CaseSummarySerializer, CaseUpdateSerializer
)


# ---------------------------
# Registration & Authentication
# ---------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# ---------------------------
# Appointment ViewSet
# ---------------------------
class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(user=user)

    def perform_create(self, serializer):
        # print(serializer.validated_data)
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role != 'admin' and serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to update this appointment.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to delete this appointment.")
        instance.delete()

# ---------------------------
# Contact Message ViewSet
# ---------------------------
class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return ContactMessage.objects.all()
        return ContactMessage.objects.none()

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Only admins can update contact messages.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Only admins can delete contact messages.")
        instance.delete()

# ---------------------------
# Document ViewSet
# ---------------------------
class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        case_summary_id = self.kwargs.get('case_summary_id')  # Get the case_summary_id from the URL kwargs
        
        # Start with all documents (default to all documents for admin)
        queryset = Document.objects.all()

        # If the user is an admin, they can view all documents
        if user.role == 'admin':
            queryset = Document.objects.all()

        # If the user is a lawyer, filter documents based on the lawyer's role
        elif user.role == 'lawyer':
            # Lawyers can access their own documents based on user field
            queryset = Document.objects.filter(user=user)

        # If the user is a regular user, filter documents based on the user
        else:
            queryset = Document.objects.filter(user=user)

        # # Apply additional filtering if 'case_summary_id' is provided
        # if case_summary_id:
        #     queryset = queryset.filter(case_summary_id=case_summary_id)

        return queryset


    def perform_create(self, serializer):
        # Retrieve the case_summary_id from the URL and set it explicitly
        case_summary_id = self.kwargs['case_summary_id']
        case_summary = CaseSummary.objects.get(id=case_summary_id)
        
        # Ensure the user is linked to the current authenticated user
        serializer.save(user=self.request.user, case_summary=case_summary)

    def perform_update(self, serializer):
        if self.request.user.role != 'admin' and serializer.instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to update this document.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this document.")
        instance.delete()

# ---------------------------
# Case Summary ViewSet
# ---------------------------
class CaseSummaryViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return CaseSummary.objects.all()
        elif user.role == 'lawyer':
            return CaseSummary.objects.filter(lawyer=user)
        else:
            return CaseSummary.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.role != 'admin' and serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to update this case summary.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to delete this case summary.")
        instance.delete()



# ---------------------------
# Case Update ViewSet
# ---------------------------
class CaseUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = CaseUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        case_summary_id = self.kwargs.get('case_summary_id')  # Get case_summary_id from the URL parameters
        
        if case_summary_id:
            # If case_summary_id is provided in the URL, filter updates for the specific case summary
            queryset = CaseUpdate.objects.filter(case_summary_id=case_summary_id)
        else:
            # Default to returning all updates if no case_summary_id is provided
            queryset = CaseUpdate.objects.all()
        
        # If the user is an admin, return all case updates
        if user.role == 'admin':
            return queryset
        # Otherwise, filter updates based on the case summary user
        return queryset.filter(case_summary__user=user)

    def perform_create(self, serializer):
        # Ensure the user is allowed to create updates for this case summary
        if self.request.user.role != 'admin' and serializer.validated_data['case_summary'].user != self.request.user:
            raise PermissionDenied("You do not have permission to add updates to this case.")
        serializer.save()

    def perform_update(self, serializer):
        # Ensure the user is allowed to update this case update
        if self.request.user.role != 'admin' and serializer.instance.case_summary.user != self.request.user:
            raise PermissionDenied("You do not have permission to update this case update.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure the user is allowed to delete this case update
        if self.request.user.role != 'admin' and instance.case_summary.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this case update.")
        instance.delete()
