export function getWeekDaysShort() {
  const formatter = new Intl.DateTimeFormat('ja-JP', { weekday: 'short' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
