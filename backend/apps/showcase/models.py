from django.db import models
from apps.core.models import TimeStampedModel


class TeamMember(TimeStampedModel):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='showcase/team/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.designation})"


class Partner(TimeStampedModel):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='showcase/partners/')
    website_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Partner'
        verbose_name_plural = 'Partners'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Client(TimeStampedModel):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='showcase/clients/')
    website_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
