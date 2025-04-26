from django.contrib import admin
from .models import User, Appointment, ContactMessage, CaseSummary, CaseUpdate, Document
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

# Custom User Admin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'lawyer_type', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': (
                'address',
                'age',
                'sex',
                'date_of_birth',
                'phone_number',
                'role',
                'lawyer_type',
            )
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'classes': ('wide',),
            'fields': (
                'address',
                'age',
                'sex',
                'date_of_birth',
                'phone_number',
                'role',
                'lawyer_type',
            ),
        }),
    )

# Appointment Admin
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'service_needed', 'preferred_date', 'preferred_time', 'created_at')
    search_fields = ('name', 'email', 'service_needed')
    list_filter = ('preferred_date',)

# ContactMessage Admin
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)

# CaseSummary Admin
@admin.register(CaseSummary)
class CaseSummaryAdmin(admin.ModelAdmin):
    list_display = ('case_number', 'case_type', 'filed_date', 'status', 'user')
    search_fields = ('case_number', 'case_type')
    list_filter = ('status', 'filed_date')

# CaseUpdate Admin
@admin.register(CaseUpdate)
class CaseUpdateAdmin(admin.ModelAdmin):
    list_display = ('case_summary', 'title', 'updated_at')
    search_fields = ('title', 'case_summary__case_number')
    list_filter = ('updated_at',)

# Document Admin
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'file', 'uploaded_at')
    search_fields = ('user__email', 'name')
    list_filter = ('uploaded_at',)

    def file_link(self, obj):
        if obj.file:
            return format_html("<a href='{}' target='_blank'>View File</a>", obj.file.url)
        return "No file"
    file_link.short_description = "File"
