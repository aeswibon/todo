from kanbex.tasks.models import Task
from rest_framework import serializers


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class TaskBareMinimumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["title", "status"]
