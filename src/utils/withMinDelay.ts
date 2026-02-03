export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export async function withMinDelay<T>(
  promise: Promise<T>,
  minMs = 300
): Promise<T> {
  const start = Date.now()

  const result = await promise

  const elapsed = Date.now() - start
  const remaining = minMs - elapsed

  if (remaining > 0) {
    await sleep(remaining)
  }

  return result
}
