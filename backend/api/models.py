from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('lawyer', 'Lawyer'),
        ('client', 'Client'),
    ]

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    address = models.TextField(blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    sex = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"



class Appointment(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service_needed = models.CharField(max_length=255)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.service_needed}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"

# Case Summary Model
class CaseSummary(models.Model):
    case_number = models.CharField(max_length=50, unique=True)  # Case number like "LF-2025-0342"
    case_type = models.CharField(max_length=100)  # e.g., "Personal Injury"
    filed_date = models.DateField()  # The date the case was filed
    status = models.CharField(
        max_length=50, 
        choices=[
            ('active', 'Active'),
            ('closed', 'Closed'),
            ('settled', 'Settled'),
            ('pending', 'Pending'),
        ], 
        default='active'  # The status of the case
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Linking case summary to a user

    def __str__(self):
        return f"Case {self.case_number} - {self.case_type}"

# Case Update Model
class CaseUpdate(models.Model):
    case_summary = models.ForeignKey(
        CaseSummary,
        on_delete=models.CASCADE,
        related_name='updates'  # Added related_name here
    )
    title = models.CharField(max_length=255)  # Title of the case update
    details = models.TextField()  # Details of the case update
    updated_at = models.DateTimeField(auto_now=True)  # Auto timestamp of when the case update was made

    def __str__(self):
        return self.title

class Document(models.Model):
    NAME_CHOICES = [
        ('Medical Records', 'Medical Records'),
        ('Employment Records', 'Employment Records'),
        ('Insurance Information', 'Insurance Information'),
        ('Signed Affidavit', 'Signed Affidavit'),
        ('Photo Evidence', 'Photo Evidence'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    case_summary = models.ForeignKey(CaseSummary, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255, choices=NAME_CHOICES)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - Case {self.case_summary.case_number} ({self.user.first_name} {self.user.last_name})"
