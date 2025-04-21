from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Document, CaseSummary, CaseUpdate, Appointment
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
# Contact Message
# ---------------------------
class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Thank you for contacting us!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# Document ViewSet
# ---------------------------
class DocumentUploadViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Document.objects.all()
        return Document.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.role != 'admin' and serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to update this document.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to delete this document.")
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
        return CaseSummary.objects.filter(user=user)

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
        if user.role == 'admin':
            return CaseUpdate.objects.all()
        return CaseUpdate.objects.filter(case_summary__user=user)

    def perform_create(self, serializer):
        if self.request.user.role != 'admin' and serializer.validated_data['case_summary'].user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to add updates to this case.")
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role != 'admin' and serializer.instance.case_summary.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to update this case update.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.case_summary.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to delete this case update.")
        instance.delete()
