// NOTE: This should not be exported at the top level

export function omitBy(
  obj: Record<string, unknown>,
  fn: (unknown, string) => unknown,
): Record<string, unknown> {
  return (
    Object.keys(obj)
      .filter((key) => !fn(obj[key], key))
      // eslint-disable-next-line no-return-assign -- it's fine
      .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})
  )
}

export function groupBy(): void {}
