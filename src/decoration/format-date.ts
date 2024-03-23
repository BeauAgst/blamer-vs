const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const nth = (day: number) => {
  if (day > 3 && day < 21) {
    return "th";
  }
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

export const formatDate = (dateString?: string) => {
  if (!dateString) {
    return undefined;
  }

  const date = new Date(dateString);
  const day = date.getDate();
  const dayIndex = date.getDay();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${days[dayIndex]} ${day}${nth(day)} ${months[monthIndex]} ${year}`;
};
