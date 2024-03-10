import enum

from django.db import models
from django.http import HttpRequest
from kanbex.users.models import User
from kanbex.utils.models.base import BaseModel


class BaseTask(BaseModel):
    class Meta:
        abstract = True


class Status(enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class Task(BaseTask):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=Status.choices(), default=Status.TODO
    )
    due_date = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title

    def has_object_read_permission(self, request: HttpRequest):
        return request.user.is_superuser or request.user == self.created_by

    def has_object_write_permission(self, request: HttpRequest):
        return request.user.is_superuser or request.user == self.created_by

    def has_object_update_permission(self, request: HttpRequest):
        return request.user.is_superuser or request.user == self.created_by

    def has_object_delete_permission(self, request: HttpRequest):
        return request.user.is_superuser or request.user == self.created_by
