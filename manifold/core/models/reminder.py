# from django.conf import settings
# from django.db import models
# from django.utils import timezone

# class Reminder(models.Model):
#     FREQUENCY_CHOICES = [
#         ('minutes', 'Minutes'),
#         ('hours', 'Hours'),
#         ('days', 'Days'),
#         ('weeks', 'Weeks'),
#         ('months', 'Months'),
#         ('years', 'Years'),
#     ]

#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     message = models.TextField()
#     email = models.EmailField(null=True, blank=True)
#     phone_number = models.CharField(max_length=15, null=True, blank=True)
#     next_run = models.DateTimeField()
#     interval_value = models.PositiveIntegerField(default=1)  # To specify the number of units
#     interval_type = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default='days')

#     def __str__(self):
#         return f'Reminder for {self.user} - {self.message[:20]}'

#     def calculate_next_run(self):
#         if self.interval_type == 'minutes':
#             self.next_run += timezone.timedelta(minutes=self.interval_value)
#         elif self.interval_type == 'hours':
#             self.next_run += timezone.timedelta(hours=self.interval_value)
#         elif self.interval_type == 'days':
#             self.next_run += timezone.timedelta(days=self.interval_value)
#         elif self.interval_type == 'weeks':
#             self.next_run += timezone.timedelta(weeks=self.interval_value)
#         elif self.interval_type == 'months':
#             self.next_run = self._add_months(self.next_run, self.interval_value)
#         elif self.interval_type == 'years':
#             self.next_run = self._add_years(self.next_run, self.interval_value)

#         self.save()

#     def _add_months(self, date, months):
#         month = date.month - 1 + months
#         year = date.year + month // 12
#         month = month % 12 + 1
#         day = min(date.day, [31,
#             29 if year % 4 == 0 and not year % 400 == 0 else 28,
#             31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
#         return date.replace(year=year, month=month, day=day)

#     def _add_years(self, date, years):
#         try:
#             return date.replace(year=date.year + years)
#         except ValueError:
#             # For leap years, set to 28th Feb if original date was 29th Feb
#             return date.replace(year=date.year + years, month=2, day=28)
