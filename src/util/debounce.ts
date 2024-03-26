export const debounce = <F extends (...args: any[]) => void>(
  fn: F,
  ms = 200
): F => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function (this: any, ...args: any[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn.bind(this, ...args), ms);
  } as F;
};
