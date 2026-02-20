from rest_framework import serializers
from core.serializers.template import RelationshipHandlerMixin
from core.models.sidebar_link import SidebarLink

class SidebarLinkSerializer(RelationshipHandlerMixin, serializers.ModelSerializer):

    class Meta:
        model = SidebarLink
        fields = '__all__'
