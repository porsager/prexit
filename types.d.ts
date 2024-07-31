type PrexitSignal =
  | "beforeExit"
  | "uncaughtException"
  | "SIGTSTP"
  | "SIGQUIT"
  | "SIGHUP"
  | "SIGTERM"
  | "SIGINT";

declare module "prexit" {
  interface Prexit {
    code: number;
    exiting: boolean;
    signals: PrexitSignal[];
    logExceptions: boolean;

    ondone(): void;
    last(
      callback?: (signal: PrexitSignal, code: number, error?: Error) => void
    ): void;
    exit(signal?: PrexitSignal, code?: number): void;
    exit(code: number): void;
    (callback?: (signal: PrexitSignal, code: number, error?: Error) => unknown | Promise<unknown>): void;
    (event: string | string[], callback?: (signal: PrexitSignal, code: number, error?: Error) => unknown | Promise<unknown>): void;
  }

  const prexit: Prexit;

  export default prexit;
}
