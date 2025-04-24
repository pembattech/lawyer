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
        fields = ('id', 'email', 'first_name', 'last_name', 'address', 'age', 'sex', 'date_joined', 'role')
        

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirmPassword = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'confirmPassword', 'first_name', 'last_name', 'address', 'age', 'sex')
        
    def validate(self, attrs):
        if attrs['password'] != attrs['confirmPassword']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
        
    def create(self, validated_data):
        # Remove confirmPassword from the data as it's not part of the User model
        validated_data.pop('confirmPassword', None)
        
        # Set a default username based on email since our User model still requires it
        validated_data['username'] = validated_data['email'].split('@')[0]
        
        user = User.objects.create_user(**validated_data)
        return user

from rest_framework import serializers
from datetime import datetime
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    # Incoming aliases (for POST/PUT)
    service = serializers.CharField(write_only=True, required=True)
    date = serializers.DateField(write_only=True, required=True)
    time = serializers.CharField(write_only=True, required=True)
    message = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # Outgoing values (for GET)
    service_needed = serializers.CharField(read_only=True)
    preferred_date = serializers.DateField(read_only=True)
    preferred_time = serializers.SerializerMethodField()
    description = serializers.CharField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'name', 'email', 'phone',
            'service', 'date', 'time', 'message',  # incoming aliases
            'service_needed', 'preferred_date', 'preferred_time', 'description'  # outgoing fields
        ]

    def get_preferred_time(self, obj):
        return obj.preferred_time.strftime('%I:%M %p') if obj.preferred_time else None

    def validate_time(self, value):
        try:
            return datetime.strptime(value.strip(), "%I:%M %p").time()
        except ValueError:
            raise serializers.ValidationError("Time format must be like '11:00 AM' or '3:30 PM'")

    def validate(self, attrs):
        # Map the incoming keys to model keys
        attrs['service_needed'] = attrs.pop('service')
        attrs['preferred_date'] = attrs.pop('date')
        attrs['preferred_time'] = attrs.pop('time')
        attrs['description'] = attrs.pop('message', '')
        return attrs

    def create(self, validated_data):
        return Appointment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'message']

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
    case_summary = serializers.PrimaryKeyRelatedField(queryset=CaseSummary.objects.all())


    class Meta:
        model = Document
        fields = ['id', 'user', 'case_summary', 'name', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
        
    

class CaseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseUpdate
        fields = ['id', 'case_summary', 'title', 'details', 'updated_at']
        read_only_fields = ['updated_at']

class CaseSummarySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    updates = CaseUpdateSerializer(many=True, read_only=True)  # thanks to related_name='updates'
    lawyer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='lawyer'),
        source='lawyer',  # maps to the actual model field
        write_only=True,
        required=False
    )
    lawyer = UserSerializer(read_only=True)  # Optional: include full lawyer details

    class Meta:
        model = CaseSummary
        fields = [
            'id', 'case_number', 'case_type', 'filed_date',
            'status', 'lawyer_id', 'lawyer', 'user', 'updates'
        ]