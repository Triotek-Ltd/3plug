import logging
import random
import string
import subprocess

# Set up logging
logger = logging.getLogger(__name__)


def run_subprocess(command):
    """
    Run a subprocess command and return the output.

    :param command: The command to run as a string.
    :return: Output of the command.
    """
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True, check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        logger.error(f"Error running command: {command}")
        logger.error(e.stderr)
        return None


def log_user_action(user_id, action):
    """
    Log a user action to the logging system.

    :param user_id: ID of the user performing the action.
    :param action: Description of the action.
    """
    logger.info(f"User {user_id} performed action: {action}")


def generate_simple_password():
    uppercase_letter = random.choice(string.ascii_uppercase)
    lowercase_letter = random.choice(string.ascii_lowercase)
    special_character = random.choice("!@#$%^&*()")
    digits = "".join(random.choices(string.digits, k=3))

    # Combine the characters
    password_list = [uppercase_letter, lowercase_letter, special_character] + list(
        digits
    )

    # Shuffle to ensure random order
    random.shuffle(password_list)

    # Convert list to string
    password = "".join(password_list)

    return password
