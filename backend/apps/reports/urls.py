from django.urls import path
from .views import ExecutiveSummaryView, ExportPdfView, ExportExcelView

urlpatterns = [
    path('executive-summary/', ExecutiveSummaryView.as_view(), name='reports-executive-summary'),
    path('export/pdf/', ExportPdfView.as_view(), name='reports-export-pdf'),
    path('export/excel/', ExportExcelView.as_view(), name='reports-export-excel'),
]
