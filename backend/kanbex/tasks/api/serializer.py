from kanbex.tasks.models import Status, Task
from rest_framework import serializers


class TaskSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Status.choices())

    class Meta:
        model = Task
        fields = "__all__"

    def create(self, validated_data):
        task = Task.objects.filter(
            title=validated_data["title"],
            created_by=self.context["request"].user,
        )

        if task.exists():
            raise serializers.ValidationError(
                {
                    "title": "Task with this title already exists.",
                }
            )
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if instance.created_by != self.context["request"].user:
            raise serializers.ValidationError(
                {"detail": "You are not allowed to update this task."}
            )
        if instance.status == Status.DONE:
            raise serializers.ValidationError(
                {
                    "status": "You are not allowed to update a task that is already done."
                }
            )
        return super().update(instance, validated_data)
