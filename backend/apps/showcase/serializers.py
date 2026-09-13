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


# ==========================================================
# Staff-only Admin Showcase Serializers
# ==========================================================

class AdminTeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            'id',
            'name',
            'designation',
            'photo',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class AdminPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'logo',
            'website_url',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class AdminClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id',
            'name',
            'logo',
            'website_url',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
