from django_filters import rest_framework as filters
from drf_spectacular.utils import extend_schema
from kanbex.tasks.api.serializer import TaskSerializer
from kanbex.tasks.models import Status, Task
from rest_framework import filters as drf_filters
from rest_framework import permissions, viewsets


class TaskFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")
    status = filters.MultipleChoiceFilter(choices=Status.choices())
    due_date = filters.DateFromToRangeFilter(
        field_name="due_date", label="Due Date"
    )


@extend_schema(tags=["tasks"])
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-created_at")
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    lookup_field = "uuid"
    search_fields = ["title", "status", "due_date"]

    filterset_class = TaskFilter
    filter_backends = [drf_filters.SearchFilter, filters.DjangoFilterBackend]

    def get_queryset(self):
        if not self.request.user.is_superuser:
            return Task.objects.filter(created_by=self.request.user)
        return self.queryset
