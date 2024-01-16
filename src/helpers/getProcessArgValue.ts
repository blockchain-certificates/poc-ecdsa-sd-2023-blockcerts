export default function getProcessArgValue (property: string): string {
  return process.argv
    .filter(arg => arg.startsWith(property))
    .map(arg => arg.split('=')[1])[0] ?? '';
}
