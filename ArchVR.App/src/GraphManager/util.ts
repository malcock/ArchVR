export function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let lastTime = 0;

  return function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const now = new Date().getTime();
    if (now - lastTime >= wait) {
      lastTime = now;
      return func.apply(this, args);
    }
  } as T;
}

type Input = ClassicPreset.Input<Socket>;
type Output = ClassicPreset.Output<Socket>;

export function getConnectionSockets(
  editor: NodeEditor<Schemes>,
  connection: Schemes["Connection"]
) {
  const source = editor.getNode(connection.source);
  const target = editor.getNode(connection.target);

  const output =
    source &&
    (source.outputs as Record<string, Input>)[connection.sourceOutput];
  const input =
    target &&
    (target.inputs as unknown as Record<string, Output>)[
      connection.targetInput
    ];

  return {
    source: output?.socket,
    target: input?.socket,
  };
}
