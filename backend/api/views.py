from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CaseSummary
from .serializers import CaseSummarySerializer
from .serializers import RegisterSerializer, UserSerializer, AppointmentSerializer
from .models import User, Document, CaseUpdate
from .serializers import ContactMessageSerializer
from .serializers import DocumentSerializer
from .serializers import CaseUpdateSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the user
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

        
    
    
class AppointmentCreateView(APIView):
    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response({"message": "Appointment created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Thank you for contacting us!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentUploadViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only documents that belong to the currently logged-in user
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the current user to the uploaded document
        serializer.save(user=self.request.user)

class CaseSummaryViewSet(viewsets.ModelViewSet):
    queryset = CaseSummary.objects.all()
    serializer_class = CaseSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return CaseSummary.objects.filter(user=self.request.user)


class CaseUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = CaseUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # User indirectly connected via CaseSummary
        return CaseUpdate.objects.filter(case_summary__user=self.request.user)