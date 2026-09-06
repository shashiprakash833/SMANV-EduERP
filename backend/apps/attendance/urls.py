from django.urls import path
from .views import AttendanceSummaryView, AttendanceBatchMarkView, AttendanceHistoryView

urlpatterns = [
    path('summary/', AttendanceSummaryView.as_view(), name='attendance-summary'),
    path('mark-batch/', AttendanceBatchMarkView.as_view(), name='attendance-mark-batch'),
    path('history/', AttendanceHistoryView.as_view(), name='attendance-history'),
]
