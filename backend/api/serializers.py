from rest_framework import serializers
from datetime import datetime
from .models import User
from .models import Appointment
from .models import ContactMessage
from .models import Document
from .models import CaseUpdate
from .models import CaseSummary
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "address",
            "age",
            "sex",
            "date_joined",
            "role",
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirmPassword = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "confirmPassword",
            "first_name",
            "last_name",
            "address",
            "age",
            "sex",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        # Remove confirmPassword from the data as it's not part of the User model
        validated_data.pop("confirmPassword", None)

        # Set a default username based on email since our User model still requires it
        validated_data["username"] = validated_data["email"].split("@")[0]

        user = User.objects.create_user(**validated_data)
        return user


from rest_framework import serializers
from datetime import datetime
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id",
            "lawyer",
            "name",
            "email",
            "phone",
            "service_needed",
            "preferred_date",
            "preferred_time",
            "description",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "message"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be blank.")
        return value

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message cannot be blank.")
        return value


class DocumentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    case_summary = serializers.PrimaryKeyRelatedField(
        queryset=CaseSummary.objects.all()
    )

    class Meta:
        model = Document
        fields = ["id", "user", "case_summary", "name", "file", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]


class CaseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseUpdate
        fields = ["id", "case_summary", "title", "details", "updated_at"]
        read_only_fields = ["updated_at"]


class CaseSummarySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    updates = CaseUpdateSerializer(many=True, read_only=True)
    lawyer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="lawyer"),
        source="lawyer",
        write_only=True,
        required=False,
    )
    lawyer = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="client"),
        source="user",
        write_only=True,
        required=True,
    )

    class Meta:
        model = CaseSummary
        fields = [
            "id",
            "case_number",
            "case_type",
            "filed_date",
            "status",
            "lawyer_id",
            "lawyer",
            "user",
            "user_id",
            "updates",
        ]

    # def validate_user_id(self, value):
    #     # Ensure the user ID corresponds to a client
    #     if not User.objects.filter(id=value, role="client").exists():
    #         raise serializers.ValidationError(
    #             "The selected user is not a valid client."
    #         )
    #     return value


class LawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "username"]
