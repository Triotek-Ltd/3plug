import re

def format_duration_default(raw_default):
    if isinstance(raw_default, int) or (isinstance(raw_default, str) and raw_default.isdigit()):
        # Treat as seconds
        seconds = int(raw_default)
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f'"{hours}:{minutes:02}:{seconds:02}"'  # Proper HH:MM:SS format
    elif isinstance(raw_default, str):
        # Check if string matches HH:MM:SS or similar
        hh_mm_ss_pattern = re.compile(r'^\d{1,2}:\d{1,2}:\d{1,2}$')
        if hh_mm_ss_pattern.match(raw_default.strip()):
            return f'"{raw_default.strip()}"'  # Already correct format
        # Handle "Xh Ym Zs" format e.g., "1h 30m"
        time_parts = re.findall(r'(\d+)([hms])', raw_default.lower())
        total_seconds = 0
        for value, unit in time_parts:
            if unit == 'h':
                total_seconds += int(value) * 3600
            elif unit == 'm':
                total_seconds += int(value) * 60
            elif unit == 's':
                total_seconds += int(value)
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f'"{hours}:{minutes:02}:{seconds:02}"'
    return None  # Invalid or empty, skip default
