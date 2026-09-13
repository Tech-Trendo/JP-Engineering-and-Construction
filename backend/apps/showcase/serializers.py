from rest_framework import serializers
from .models import TeamMember, Partner, Client


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            'id',
            'name',
            'designation',
            'photo',
            'order',
        ]


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'logo',
            'website_url',
            'order',
        ]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id',
            'name',
            'logo',
            'website_url',
            'order',
        ]
