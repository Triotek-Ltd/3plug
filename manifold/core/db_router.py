from django.core.cache import cache


class MultiTenantRouter:
    def db_for_read(self, model, **hints):
        """Direct read queries to the correct tenant database."""
        tenant_db = cache.get("tenant_db")

        if not tenant_db:
            tenant_name = hints.get("tenant_name", None)
            if tenant_name:
                tenant_db = cache.get(f"tenant_db")

        if tenant_db:
            return tenant_db

        return "default"

    def db_for_write(self, model, **hints):
        """Direct write queries to the correct tenant database."""
        tenant_db = cache.get("tenant_db")

        if not tenant_db:
            tenant_name = hints.get("tenant_name", None)
            if tenant_name:
                tenant_db = cache.get(f"tenant_db")

        if tenant_db:
            return tenant_db

        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        """Allow relations if both objects are in the same database."""
        db_obj1 = cache.get("tenant_db")
        db_obj2 = cache.get("tenant_db")

        if db_obj1 and db_obj2:
            return db_obj1 == db_obj2
        return True
