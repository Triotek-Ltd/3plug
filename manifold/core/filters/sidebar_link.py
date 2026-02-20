import django_filters as filters
from core.models.sidebar_link import SidebarLink

class SidebarLinkFilter(filters.FilterSet):
    id = filters.NumberFilter(label='ID')

    class Meta:
        model = SidebarLink
        fields = ['id']

