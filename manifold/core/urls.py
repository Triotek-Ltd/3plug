from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from rest_framework.routers import DefaultRouter

from .dynamic_api import dynamic_forward_view
from .views import (
    AppViewSet,
    BranchViewSet,
    BulkDeleteAPIView,
    ChangeLogViewSet,
    CreateAppAPIView,
    CreateDocumentAPIView,
    CreateModuleAPIView,
    CreatePrintFormatAPIView,
    DataImportAPIView,
    DocumentViewSet,
    FileUploadView,
    GroupViewSet,
    LoginView,
    LogoutView,
    MigrateAPIView,
    ModuleViewSet,
    OTPActivationView,
    PermissionViewSet,
    PrintFormatViewSet,
    ProfileView,
    ReminderViewSet,
    ResendOTPView,
    RoleViewSet,
    SendEmailView,
    SendSmsView,
    SidebarLinkViewSet,
    UserGetViewSet,
    UserGroupPermissions,
    UserIPAddressViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register(r"app", AppViewSet, basename="app")
router.register(r"module", ModuleViewSet, basename="module")
router.register(r"document", DocumentViewSet, basename="document")
router.register(r"print_format", PrintFormatViewSet, basename="print_format")
router.register(r"print_formats", PrintFormatViewSet, basename="print_formats")
router.register(r"apps", AppViewSet, basename="apps")
router.register(r"modules", ModuleViewSet, basename="modules")
router.register(r"documents", DocumentViewSet, basename="documents")
router.register(r"changelogs", ChangeLogViewSet, basename="changelogs")
router.register(r"users", UserViewSet, basename="users")
router.register(r"core/user", UserViewSet, basename="core_user")
router.register(r"core/reminder", ReminderViewSet, basename="core_reminder")
router.register(r"core/role_type", RoleViewSet, basename="core_role_type")
router.register(r"core/branch", BranchViewSet, basename="core_branch")
router.register(r"core/rolegroup", GroupViewSet, basename="core_rolegroup")
router.register(r"core/sidebar_link", SidebarLinkViewSet, basename="core_sidebarlink")
router.register(r"core/group", GroupViewSet, basename="core_group")
router.register(r"core/permission", PermissionViewSet, basename="core_permission")
router.register(
    r"user-ip-addresses", UserIPAddressViewSet, basename="user_ip_addresses"
)


static_urlpatterns = [
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
]

urlpatterns = [
    path("", include(router.urls)),
    path("new-module/", CreateModuleAPIView.as_view(), name="create-module"),
    path("newapp/", CreateAppAPIView.as_view(), name="create-app"),
    path("newdoc/", CreateDocumentAPIView.as_view(), name="create-document"),
    path(
        "newprintformat/",
        CreatePrintFormatAPIView.as_view(),
        name="create-print-format",
    ),
    path("migrate/", MigrateAPIView.as_view(), name="migrate"),
    path("login/", LoginView.as_view(), name="login"),
    path("getuser/", UserGetViewSet.as_view(), name="getuser"),
    path("otp/activate/", OTPActivationView.as_view(), name="otp_activate"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend_otp"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("roles/", UserGroupPermissions.as_view(), name="roles"),
    path("sendsms/", SendSmsView.as_view(), name="sms"),
    path("dataimport/", DataImportAPIView.as_view(), name="dataimport"),
    path("bulkdelete/", BulkDeleteAPIView.as_view(), name="bulkdelete"), 
    path("sendemail/", SendEmailView.as_view(), name="email"),
    path("upload-file/", FileUploadView.as_view(), name="upload-file"),
    path("admin/", admin.site.urls),
    path("", include(static_urlpatterns)),
    path('method/<path:target_path>/', dynamic_forward_view, name='dynamic_forward'),

]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [    path('frappe/', include('frappe_app.urls')),]
urlpatterns += [    path('shop/', include('shop_app.urls')),]
