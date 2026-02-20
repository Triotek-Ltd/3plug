from rest_framework import viewsets
from core.views.template import GenericViewSet
from core.models.sidebar_link import SidebarLink
from core.filters.sidebar_link import SidebarLinkFilter
from core.serializers.sidebar_link import SidebarLinkSerializer
from core.permissions import HasGroupPermission

from core.views.template import GenericViewSet
from core.models.sidebar_link import SidebarLink
from core.filters.sidebar_link import SidebarLinkFilter
from core.serializers.sidebar_link import SidebarLinkSerializer
from core.permissions import HasGroupPermission

from rest_framework.permissions import AllowAny

class SidebarLinkViewSet(GenericViewSet):
    queryset = SidebarLink.objects.all()
    filterset_class = SidebarLinkFilter
    permission_classes = [HasGroupPermission]
    serializer_class = SidebarLinkSerializer

