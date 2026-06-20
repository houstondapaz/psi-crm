export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function mergeClassName<T>(
  base: string,
  className?: string | ((state: T) => string | undefined),
): string | ((state: T) => string | undefined) {
  if (typeof className === "function") {
    return (state: T) => cn(base, className(state));
  }

  return cn(base, className);
}
