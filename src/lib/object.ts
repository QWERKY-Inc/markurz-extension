export function resolveObjectPath<
  U,
  T extends Record<string, unknown> = Record<string, unknown>
>(path: string, obj: T): U {
  return path.split(".").reduce<unknown>(function (prev, curr) {
    return (prev as { [key: string]: unknown })?.[curr] ?? null;
  }, obj) as U;
}
