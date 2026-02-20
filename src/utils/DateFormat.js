import { format, formatDistanceToNow } from "date-fns";

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th"; // covers 11th to 20th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const timeAgo = (date) => {
  // Format the date to include a short month name
  const day = format(date, "d");
  const ordinalSuffix = getOrdinalSuffix(Number(day));
  const formattedDate = format(
    date,
    `EEE, d'${ordinalSuffix}' MMM yyyy 'at' HH:mm`
  );

  // Get the relative time (e.g., "7d ago")
  const distance = formatDistanceToNow(date, { addSuffix: false });
  const match = distance.match(/(\d+)\s(\w+)/);
  let timeAgoString = distance;

  if (match) {
    const [, value, unit] = match;

    const shortUnits = {
      second: "s",
      seconds: "s",
      minute: "m",
      minutes: "m",
      hour: "h",
      hours: "h",
      day: "d",
      days: "d",
      month: "mo",
      months: "mo",
      year: "y",
      years: "y",
    };

    timeAgoString = `${value}${shortUnits[unit] || unit}`;
  }

  // return `${formattedDate} (${timeAgoString})`;
  return `(${timeAgoString})`;
};

export const formatDateByDash = (date) => date.toISOString().split("T")[0];

export const formatDate = (dateString) => {
  if (!dateString) return "";
  return format(new Date(dateString), "PP"); // Format as: Sep 8, 2024
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  return format(new Date(dateTimeString), "PPpp"); // Format as: Sep 8, 2024, 1:30 PM
};
