type PrexitSignal =
  | "beforeExit"
  | "uncaughtException"
  | "SIGTSTP"
  | "SIGQUIT"
  | "SIGHUP"
  | "SIGTERM"
  | "SIGINT";

declare module "prexit" {
  export let code: number;
  export function ondone(): void;
  export function last(
    callback?: (signal: PrexitSignal, code_or_err: Error | number) => void
  ): void;
  export function exit(signal?: PrexitSignal, code?: number): void;
  export function exit(code: number): void;
  export default function (
    callback?: (signal: PrexitSignal, code_or_err: Error | number) => unknown | Promise<unknown>
  ): void;
  export default function (
    event: string | string[],
    callback?: (signal: PrexitSignal, code_or_err: Error | number) => unknown | Promise<unknown>
  ): void;
}
