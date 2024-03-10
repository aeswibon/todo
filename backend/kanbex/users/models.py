from typing import Any
from uuid import uuid4

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUserManager(UserManager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(deleted=False)

    def create_superuser(
        self,
        username: str,
        email: str | None,
        password: str | None,
        **extra_fields: Any
    ) -> Any:
        extra_fields["phone"] = "+919696969696"
        extra_fields["is_verified"] = True
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    uuid = models.UUIDField(default=uuid4, unique=True, db_index=True)
    phone = models.CharField(max_length=15, blank=False)
    is_verified = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

    objects = CustomUserManager()

    def __str__(self):
        return self.get_full_name() or self.username

    def delete(self, *args: Any, **kwargs: Any) -> None:
        self.deleted = True
        self.save()
