from django.urls import path
from .views import ExaminationListCreateView, ExaminationResultsView

urlpatterns = [
    path('', ExaminationListCreateView.as_view(), name='exam-list-create'),
    path('results/', ExaminationResultsView.as_view(), name='exam-results'),
]
