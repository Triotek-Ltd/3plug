import importlib
from django.http import HttpResponseBadRequest, HttpResponseNotFound
from rest_framework.viewsets import ViewSetMixin

# Map HTTP methods to common ViewSet actions
DEFAULT_ACTIONS = {
    'GET': 'list',
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'partial_update',
    'DELETE': 'destroy'
}

def dynamic_forward_view(request, target_path):
    """
    Dynamically resolve and forward the request to the specified function/class.
    Supports DRF ViewSets, APIViews, CBVs, FBVs.
    Accepts both dot-separated and slash-separated paths.
    """
    try:
        # Convert slashes to dots to allow flexible path formats
        normalized_path = target_path.replace('/', '.')
        
        module_path, func_name = normalized_path.rsplit('.', 1)
        module = importlib.import_module(module_path)
        target = getattr(module, func_name)

        if callable(target):
            if isinstance(target, type) and issubclass(target, ViewSetMixin):
                http_method = request.method.upper()
                action = DEFAULT_ACTIONS.get(http_method)

                if action is None:
                    return HttpResponseBadRequest(f"HTTP method '{http_method}' not supported for ViewSet.")

                view_func = target.as_view({http_method.lower(): action})
                return view_func(request)

            elif isinstance(target, type) and hasattr(target, 'as_view'):
                view_func = target.as_view()
                return view_func(request)

            else:
                return target(request)

        return HttpResponseBadRequest("Target is not callable.")

    except (ImportError, AttributeError, ValueError) as e:
        return HttpResponseNotFound(f"Function not found: {e}")
