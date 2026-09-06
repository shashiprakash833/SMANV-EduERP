from django.urls import path
from .views import (
    StudentListCreateView,
    StudentDetailView,
    AdmissionApplicationListCreateView,
)

urlpatterns = [
    path('', StudentListCreateView.as_view(), name='student-list-create'),
    path('<uuid:pk>/', StudentDetailView.as_view(), name='student-detail'),
    path('admissions/', AdmissionApplicationListCreateView.as_view(), name='admissions-list-create'),
]
