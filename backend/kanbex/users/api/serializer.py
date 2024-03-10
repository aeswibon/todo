from django.contrib.auth.hashers import make_password
from kanbex.users.models import User
from rest_framework import exceptions, serializers


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("uuid", "username", "email", "password")

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "password" in validated_data:
            validated_data["password"] = make_password(validated_data["password"])
        if "email" in validated_data:
            if User.objects.filter(email=validated_data["email"]).exists():
                raise exceptions.ValidationError(
                    {"email": "User with this email already exists."}
                )

        if "username" in validated_data:
            if User.objects.filter(username=validated_data["username"]).exists():
                raise exceptions.ValidationError(
                    {"username": "User with this username already exists."}
                )

        return super().update(instance, validated_data)


class UserBareMinimumSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("uuid", "username", "email")
        read_only_fields = ("uuid", "username", "email")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
