from uuid import uuid4

from django.db import models
from django.http import HttpRequest


class BaseManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(deleted=False)


class BaseModel(models.Model):
    uuid = models.UUIDField(default=uuid4, unique=True, db_index=True)
    deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BaseManager()

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.deleted = True
        self.save()

    @staticmethod
    def has_create_permission(request: HttpRequest):
        return True

    @staticmethod
    def has_read_permission(request: HttpRequest):
        return True

    def has_object_read_permission(self, request: HttpRequest):
        return True

    def has_object_update_permission(self, request: HttpRequest):
        return True

    @staticmethod
    def has_delete_permission(request: HttpRequest):
        return True
