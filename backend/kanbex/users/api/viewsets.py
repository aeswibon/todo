from django.contrib.auth.hashers import make_password
from django.db.models import F
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from dry_rest_permissions.generics import DRYPermissions
from kanbex.users.api.serializer import UserCreateSerializer, UserSerializer
from kanbex.users.models import User
from rest_framework import mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


@extend_schema(tags=["users"])
class UserViewSet(
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet,
):
    queryset = User.objects.filter(
        is_active=True, is_superuser=False, deleted=False
    ).order_by(F("last_login").asc(nulls_last=True))

    lookup_field = "uuid"

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, DRYPermissions]

    def get_serializer_class(self):
        if self.action == "add_user":
            return UserCreateSerializer
        return super().get_serializer_class()

    def destroy(self, request, *args, **kwargs):
        queryset = self.queryset
        username = kwargs["username"]
        if request.user.is_superuser:
            pass
        user = get_object_or_404(queryset.filter(username=username))
        if user != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN, data={"permission": "Denied"}
            )
        user.deleted = True
        user.is_active = False
        user.save(update_fields=["deleted", "is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(tags=["auth"])
    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.AllowAny],
    )
    def register(self, request):
        if request.user.is_authenticated:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Already authenticated"},
            )

        if "password" not in request.data:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "Password is required"},
            )

        password = request.data.pop("password")
        serializer = self.get_serializer_class()(
            data={
                **request.data,
                "password": make_password(password),
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    @extend_schema(tags=["users"])
    @action(detail=False, methods=["get"])
    def me(self, request):
        return Response(
            status=status.HTTP_200_OK,
            data=self.get_serializer_class()(request.user).data,
        )

    @extend_schema(tags=["users"])
    @action(detail=False, methods=["get"])
    def check_availability(self, request, username):
        """
        Checks availability of username by getting as query, returns 200 if available, and 409 otherwise.
        """
        if User.check_username_exists(username):
            return Response(status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_200_OK)
