from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = "core"
    verbose_name = "Core Application"

    def ready(self):
        import core.signals
        # import core.utils.user_signal
