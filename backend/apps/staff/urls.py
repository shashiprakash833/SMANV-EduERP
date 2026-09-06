from django.urls import path
from .views import StaffListCreateView, StaffDetailView

urlpatterns = [
    path('', StaffListCreateView.as_view(), name='staff-list-create'),
    path('<uuid:pk>/', StaffDetailView.as_view(), name='staff-detail'),
]
