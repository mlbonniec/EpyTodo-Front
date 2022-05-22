export function getAPIURL(path: string): string {
  const base: string = String(process.env.NEXT_PUBLIC_API_BASE_URL);
  const url: URL = new URL(path, base);

  return url.toString();
}
