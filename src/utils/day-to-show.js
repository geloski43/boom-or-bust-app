export const parseDate = (input) => {
  return new Date(input);
};

export const dayToShow = (date) => {
  const day = parseDate(date).getDate();
  const month = parseDate(date).getMonth() + 1;
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return day === today && month === currentMonth
    ? 'Today'
    : day === today + 1 && month === currentMonth
      ? 'Tomorrow'
      : day === today - 1 && month === currentMonth
        ? 'Yesterday'
        : days[parseDate(date).getDay()];
};
