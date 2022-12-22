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
    callback?: (signal: PrexitSignal, code: number, error?: Error) => void
  ): void;
  export function exit(signal?: PrexitSignal, code?: number): void;
  export function exit(code: number): void;
  export default function (
    callback?: (signal: PrexitSignal, code: number, error?: Error) => unknown | Promise<unknown>
  ): void;
  export default function (
    event: string | string[],
    callback?: (signal: PrexitSignal, code: number, error?: Error) => unknown | Promise<unknown>
  ): void;
}
