export const singletonCode = `/**
 * Singleton Pattern - Core Implementation
 * Ensures a class has only one instance and provides a global point of access to it.
 */
export class LoggerSingleton {
  private static instance: LoggerSingleton | null = null;
  private logs: string[] = [];

  // 1. Private constructor blocks direct instantiation (new LoggerSingleton() fails)
  private constructor() {}

  // 2. Static method controls access to the singleton instance
  public static getInstance(): LoggerSingleton {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = new LoggerSingleton();
    }
    return LoggerSingleton.instance;
  }

  // 3. Business logic methods operate on the single shared state
  public log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(\`[\${timestamp}] \${message}\`);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
  }
}
`;
