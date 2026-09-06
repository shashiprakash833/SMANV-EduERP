from django.urls import path
from .views import FeeRecordsListView, FeeCollectView, FeeDefaultersView

urlpatterns = [
    path('records/', FeeRecordsListView.as_view(), name='fee-records'),
    path('collect/', FeeCollectView.as_view(), name='fee-collect'),
    path('defaulters/', FeeDefaultersView.as_view(), name='fee-defaulters'),
]
