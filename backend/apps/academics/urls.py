from django.urls import path
from .views import TimetableListView, AssignmentListCreateView

urlpatterns = [
    path('timetable/', TimetableListView.as_view(), name='academics-timetable'),
    path('classes/', TimetableListView.as_view(), name='academics-classes'),
    path('assignments/', AssignmentListCreateView.as_view(), name='academics-assignments'),
]
