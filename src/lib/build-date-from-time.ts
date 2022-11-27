export function buildDateFromTime(date: Date): (time: string) => Date {
  return (time: string) => {
    const [ hours, minutes ] = time.split(":").map(s => parseInt(s, 10))
    const result = new Date(date)
    result.setHours(hours)
    result.setMinutes(minutes)
    return result
  }
}
