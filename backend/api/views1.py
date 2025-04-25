from rest_framework import generics, status, permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

from .models import User, Document, CaseSummary, CaseUpdate, Appointment, ContactMessage
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    AppointmentSerializer,
    ContactMessageSerializer,
    DocumentSerializer,
    CaseSummarySerializer,
    CaseUpdateSerializer,
    LawyerSerializer,
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
        return Response(
            {
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        role = self.request.query_params.get("role")
        if role:
            return self.queryset.filter(role=role)
        return self.queryset


# ---------------------------
# Appointment ViewSet
# ---------------------------
from rest_framework import viewsets, permissions
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action == "create":
            # Allow anyone to create
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all().order_by('-created_at') 
        

        # Allow filtering by lawyer ID from query params
        lawyer_id = self.request.query_params.get("lawyer")
        if lawyer_id:
            queryset = queryset.filter(
                lawyer_id=lawyer_id
            )  # Correctly filter by lawyer_id

        # Limit non-admins to only their appointments
        if not user.is_authenticated or user.role != "admin":
            queryset = queryset.filter(
                lawyer=user
            )  # For authenticated users (non-admin), filter by lawyer (user)

        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()  # for anonymous booking (make sure `user` is nullable)

    def perform_update(self, serializer):
        if (
            self.request.user.role != "admin"
            and serializer.instance.lawyer != self.request.user
        ):
            raise permissions.PermissionDenied(
                "You do not have permission to update this appointment."
            )
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != "admin" and instance.user != self.request.user:
            raise permissions.PermissionDenied(
                "You do not have permission to delete this appointment."
            )
        instance.delete()


# ---------------------------
# Contact Message ViewSet
# ---------------------------
class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == "admin":
            return ContactMessage.objects.all()
        return ContactMessage.objects.none()

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role != "admin":
            raise permissions.PermissionDenied(
                "Only admins can update contact messages."
            )
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != "admin":
            raise permissions.PermissionDenied(
                "Only admins can delete contact messages."
            )
        instance.delete()


# ---------------------------
# Document ViewSet
# ---------------------------
class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        case_summary_id = self.kwargs.get("case_summary_id")

        queryset = Document.objects.all()

        if user.role == "admin":
            queryset = Document.objects.all()

        elif user.role == "lawyer":
            queryset = Document.objects.filter(user=user)

        else:
            queryset = Document.objects.filter(user=user)

        if case_summary_id:
            queryset = queryset.filter(case_summary_id=case_summary_id)

        return queryset

    def perform_create(self, serializer):
        case_summary_id = self.kwargs["case_summary_id"]
        case_summary = CaseSummary.objects.get(id=case_summary_id)

        serializer.save(user=self.request.user, case_summary=case_summary)

    def perform_update(self, serializer):
        if (
            self.request.user.role != "admin"
            and serializer.instance.user != self.request.user
        ):
            raise PermissionDenied(
                "You do not have permission to update this document."
            )
        serializer.save()

    def perform_destroy(self, instance):
        print(instance.case_summary.lawyer, self.request.user)
        if self.request.user.role != "admin" and instance.case_summary.lawyer != self.request.user and instance.case_summary.user != self.request.user :
            raise PermissionDenied(
                "You do not have permission to delete this document."
            )
        instance.delete()


# ---------------------------
# Case Summary ViewSet
# ---------------------------
class CaseSummaryViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return CaseSummary.objects.all()
        elif user.role == "lawyer":
            return CaseSummary.objects.filter(lawyer=user)
        else:
            return CaseSummary.objects.none()

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        if (
            self.request.user.role != "admin"
            and serializer.instance.user != self.request.user
        ):
            raise permissions.PermissionDenied(
                "You do not have permission to update this case summary."
            )
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != "admin" and instance.user != self.request.user:
            raise permissions.PermissionDenied(
                "You do not have permission to delete this case summary."
            )
        instance.delete()


# ---------------------------
# Case Update ViewSet
# ---------------------------
class CaseUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = CaseUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        case_summary_id = self.kwargs.get("case_summary_id")

        queryset = CaseUpdate.objects.all()
        if case_summary_id:
            queryset = queryset.filter(case_summary_id=case_summary_id)

        if user.role == "admin":
            return queryset

        elif user.role == "lawyer":
            return queryset.filter(case_summary__lawyer=user)

        elif user.role == "client":
            return queryset.filter(case_summary__user=user)

        # Default to empty queryset for unknown roles
        return CaseUpdate.objects.none()

    def perform_create(self, serializer):

        if (
            self.request.user.role != "admin"
            and serializer.validated_data["case_summary"].lawyer != self.request.user
        ):
            raise PermissionDenied(
                "You do not have permission to add updates to this case."
            )
        serializer.save()

    def perform_update(self, serializer):

        if (
            self.request.user.role != "admin"
            and serializer.instance.case_summary.lawyer != self.request.user
        ):
            raise PermissionDenied(
                "You do not have permission to update this case update."
            )
        serializer.save()

    def perform_destroy(self, instance):

        if (
            self.request.user.role != "admin"
            and instance.case_summary.lawyer != self.request.user
        ):
            raise PermissionDenied(
                "You do not have permission to delete this case update."
            )
        instance.delete()


class LawyerListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        lawyers = User.objects.filter(role="lawyer")
        serializer = LawyerSerializer(lawyers, many=True)
        return Response(serializer.data)


class UserByEmailView(APIView):
    def get(self, request):
        email = request.query_params.get("email")

        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
