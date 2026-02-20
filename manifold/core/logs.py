import logging

logger = logging.getLogger(__name__)


def log_user_action(user, action, document=None):
    if document:
        logger.info(
            f"User {user.username} performed '{action}' on document '{document.title}'"
        )
    else:
        logger.info(f"User {user.username} performed '{action}'")
