export function formatDateTime(scheduledAt: Date, hourStart: string, hourEnd: string) {
  const localStartDateTime = new Date(`${scheduledAt}T${hourStart}:00`);
  const localEndDateTime = new Date(`${scheduledAt}T${hourEnd}:00`);

  const startDateTimeUTC = new Date(
    localStartDateTime.getTime() - localStartDateTime.getTimezoneOffset() * 60000
  );
  const endDateTimeUTC = new Date(
    localEndDateTime.getTime() - localEndDateTime.getTimezoneOffset() * 60000
  );

  const startDateTimeISO = startDateTimeUTC.toISOString();
  const endDateTimeISO = endDateTimeUTC.toISOString();

  return {
    startDateTime: startDateTimeISO,
    endDateTime: endDateTimeISO,
  };
}
