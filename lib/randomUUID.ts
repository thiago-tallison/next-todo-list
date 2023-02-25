export default function randomUUID(): string {
  return Array.from(Math.random().toString(16).substring(2))
    .map(c => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()))
    .join('')
}
