import re
from datetime import datetime, timedelta

import pytz  # To handle different timezones
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from multiselectfield import MultiSelectField

from .auth import User
from .core import BaseModel


def correct_timezone_conversion(naive_datetime, tz_name):
    tz_name = str(tz_name)
    try:
        # Handle special case for Etc/GMT timezones (reverse offset)
        if tz_name.startswith("Etc/GMT"):
            # Extract the offset value and reverse the sign
            offset_str = tz_name.replace("Etc/GMT", "")
            offset_parts = offset_str.split(":") if ":" in offset_str else [offset_str]

            # Handle fractional offsets (e.g., 5:30, 3:45, etc.)
            if len(offset_parts) == 2:
                offset_hours = int(offset_parts[0])  # Extract hours part
                offset_minutes = int(offset_parts[1])  # Extract minutes part
                offset_in_minutes = offset_hours * 60 + offset_minutes
            else:
                offset_hours = int(offset_parts[0])  # Extract whole hours part
                offset_in_minutes = offset_hours * 60  # Convert to minutes

            # Adjust datetime based on the offset direction
            if offset_in_minutes > 0:
                corrected_datetime = naive_datetime - timedelta(
                    minutes=offset_in_minutes
                )  # UTC-<offset>
            else:
                corrected_datetime = naive_datetime + timedelta(
                    minutes=abs(offset_in_minutes)
                )  # UTC+<offset>

        else:
            tz = pytz.timezone(tz_name)
            local_datetime = tz.localize(naive_datetime)

        # Convert to UTC
        utc_datetime = corrected_datetime.replace(tzinfo=pytz.UTC)

        return utc_datetime

    except pytz.UnknownTimeZoneError:
        return naive_datetime.replace(tzinfo=pytz.UTC)


class ReminderManager(models.Manager):
    def get_queryset(self):
        queryset = super().get_queryset()

        # Auto-update `next_run` before fetching results
        for reminder in queryset:
            reminder.ensure_next_run_is_valid()

        return queryset


class Reminder(BaseModel):
    name = models.CharField(verbose_name="Name", null=True, blank=True, max_length=255)

    # Frequency Choices
    CHOICES_FREQUENCY = [
        ("Once", "Once"),
        ("Daily", "Daily"),
        ("Weekly", "Weekly"),
        ("Monthly", "Monthly"),
        ("Yearly", "Yearly"),
        ("Custom", "Custom"),
    ]
    frequency = models.CharField(
        verbose_name="Frequency",
        null=True,
        blank=True,
        max_length=255,
        choices=CHOICES_FREQUENCY,
    )

    # Date and Time Fields
    date = models.DateField(verbose_name="Date", null=True, blank=True)
    time = models.TimeField(verbose_name="Time", null=True, blank=True)
    timezone = models.CharField(
        verbose_name="Timezone",
        max_length=50,
        null=True,
        blank=True,
        default="UTC",  # Default to UTC
        help_text="Timezone for the reminder",
    )

    # Days Choices for Weekly/Custom Frequency
    CHOICES_DAYS = [
        ("Mon", "Mon"),
        ("Tue", "Tue"),
        ("Wed", "Wed"),
        ("Thur", "Thur"),
        ("Fri", "Fri"),
        ("Sat", "Sat"),
        ("Sun", "Sun"),
    ]
    days = MultiSelectField(
        verbose_name="Days", null=True, blank=True, choices=CHOICES_DAYS
    )

    # Day Choices for Monthly Frequency
    CHOICES_DAY = [(str(i).zfill(2), str(i).zfill(2)) for i in range(1, 32)]
    day = models.CharField(
        verbose_name="Day", null=True, blank=True, max_length=255, choices=CHOICES_DAY
    )

    # ManyToMany relationship with Users
    users = models.ManyToManyField(
        User, verbose_name="Users", related_name="reminders", blank=True
    )

    # Enable/Disable Reminder
    enabled = models.BooleanField(
        default=False, help_text="Check this box if the feature is enabled"
    )

    # Pre-reminder settings
    prereminder_ran = models.BooleanField(
        default=False, help_text="Has the pre-reminder been sent?"
    )
    pre_reminder_enabled = models.BooleanField(default=False)
    pre_reminder_duration = models.DurationField(
        verbose_name="Pre-reminder Duration",
        null=True,
        blank=True,
        help_text="Duration before the reminder to send a pre-reminder (e.g., 1 day, 2 hours).",
    )

    # Reminder message
    message = models.TextField(verbose_name="Message", null=True, blank=True)

    # Next Run DateTime
    next_run = models.DateTimeField(
        verbose_name="Next Run Date and Time",
        null=True,
        blank=True,
        help_text="The next scheduled datetime when the reminder will run.",
    )

    # Custom Repeat Settings
    custom_interval_days = models.PositiveIntegerField(blank=True, null=True)
    repeat_count = models.PositiveIntegerField(blank=True, null=True)
    repeat_until = models.DateTimeField(blank=True, null=True)

    def __init__(self, *args, **kwargs):
        """Ensure `next_run` is valid when an instance is initialized."""
        super().__init__(*args, **kwargs)
        self.ensure_next_run_is_valid()  # Run validation once on object initialization

    def get_timezone(self):
        """Returns the timezone object based on the `timezone` field from given options."""
        try:
            if self.timezone is None:
                return pytz.UTC
            tz_name = self.timezone.strip() or "UTC"

            # Handle UTC offsets
            if re.match(r"UTC[+-]\d+$", tz_name):
                return pytz.timezone(f'Etc/{tz_name.replace("UTC", "GMT")}')

            # Handle GMT offsets
            if re.match(r"GMT[+-]\d+$", tz_name):
                return pytz.timezone(f"Etc/{tz_name}")

            # Default to UTC if not found
            return pytz.timezone(tz_name or "UTC")

        except pytz.UnknownTimeZoneError:
            return pytz.UTC

    def ensure_next_run_is_valid(self):
        """Ensures `next_run` is valid and updates if necessary."""
        if not self.enabled:
            return  # Skip disabled reminders

        current_time = timezone.now()

        if (
            not self.next_run
            or self.next_run < current_time
            or self.next_run > current_time + timedelta(days=365)
        ):
            self.update_next_run()

    def update_next_run(self):
        """Sets `next_run` to the calculated next run time."""
        next_run = self.calculate_next_run()
        if next_run != self.next_run:
            self.next_run = next_run
            self.prereminder_ran = False

    def calculate_next_run(self):
        """Calculates the next run datetime based on frequency and settings."""
        if not self.enabled:
            return None

        tz = self.get_timezone()

        current_date = (
            self.date.replace(year=timezone.now().year)
            if self.date
            else timezone.now().date()
        )
        current_time = self.time or timezone.now().time()
        current_datetime = datetime.combine(current_date, current_time)

        if self.frequency == "Once":
            return current_datetime if current_datetime > timezone.now() else None

        if self.frequency == "Daily":
            next_datetime = tz.localize(
                datetime.combine(timezone.now().date(), current_time)
            ) + timedelta(days=1)

        elif self.frequency == "Weekly":
            today = current_datetime.weekday()  # Monday = 0, Sunday = 6
            days_list = [
                ("Mon", 0),
                ("Tue", 1),
                ("Wed", 2),
                ("Thur", 3),
                ("Fri", 4),
                ("Sat", 5),
                ("Sun", 6),
            ]
            selected_days = sorted([d[1] for d in days_list if d[0] in self.days])

            if selected_days:
                for d in selected_days:
                    if d > today:
                        next_datetime = current_datetime + timedelta(days=(d - today))
                        break
                else:
                    next_datetime = current_datetime + timedelta(
                        days=(7 - today + selected_days[0])
                    )
            else:
                return None

        elif self.frequency == "Monthly":
            if self.day:
                next_month = (current_datetime.month % 12) + 1
                next_year = (
                    current_datetime.year
                    if next_month > 1
                    else current_datetime.year + 1
                )
                try:
                    next_datetime = tz.localize(
                        datetime(
                            next_year,
                            next_month,
                            int(self.day),
                            current_datetime.hour,
                            current_datetime.minute,
                        )
                    )
                except ValueError:
                    return None  # Invalid day (e.g., Feb 30)
            else:
                return None
        elif self.frequency == "Yearly":
            now = timezone.now()
            if current_datetime.tzinfo != now.tzinfo:
                current_datetime = current_datetime.astimezone(now.tzinfo)
            if current_datetime <= now:
                next_datetime = tz.localize(
                    datetime(
                        current_datetime.year + 1,
                        current_datetime.month,
                        current_datetime.day,
                        current_datetime.hour,
                        current_datetime.minute,
                    )
                )
            else:
                next_datetime = tz.localize(
                    datetime(
                        current_datetime.year,
                        current_datetime.month,
                        current_datetime.day,
                        current_datetime.hour,
                        current_datetime.minute,
                    )
                )

        elif self.frequency == "Custom" and self.custom_interval_days:
            next_datetime = current_datetime + timedelta(days=self.custom_interval_days)

        else:
            return None

        # return correct_timezone_conversion(next_datetime, tz) if self.time else next_datetime
        return next_datetime

    def get_pre_reminder_datetime(self):
        """Calculates when the pre-reminder should be triggered."""
        if self.pre_reminder_enabled and self.pre_reminder_duration and self.next_run:
            return self.next_run - self.pre_reminder_duration
        return None

    def __str__(self):
        return f"{self.name or 'Reminder'} - Next Run: {self.next_run}"
