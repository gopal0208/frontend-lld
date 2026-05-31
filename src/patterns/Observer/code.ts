export const observerCode = `/**
 * Observer Design Pattern - Core Implementation
 * Defines a one-to-many dependency relationship so that when one object changes state,
 * all its dependents are notified automatically.
 */

export interface Observer {
  update(data: any): void;
}

export class Subject {
  private observers: Set<Observer> = new Set();
  private state: number = 0;

  // 1. Register an observer
  public attach(observer: Observer): void {
    this.observers.add(observer);
  }

  // 2. Remove an observer
  public detach(observer: Observer): void {
    this.observers.delete(observer);
  }

  // 3. Notify all registered observers of updates
  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state);
    }
  }

  // 4. State updates trigger the notification process
  public setState(newState: number): void {
    this.state = newState;
    this.notify();
  }

  public getState(): number {
    return this.state;
  }
}
`;
