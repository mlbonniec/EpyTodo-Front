export default function formatSQLDate(date: string) {
  return date.slice(0, 19).replace('T', ' ');
}
