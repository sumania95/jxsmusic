export async function runInBatches<T>(
  items: T[],
  batchSize: number,
  handler: (item: T) => Promise<void>
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await Promise.all(batch.map(handler))
  }
}
export const downloadControllers = new Map<string, AbortController>()
