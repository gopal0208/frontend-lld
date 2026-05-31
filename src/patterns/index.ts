import { LLDPattern } from './types';

const singletonCode = `class LoggerSingleton {
  private static instance: LoggerSingleton | null = null;
  private logs: string[] = [];

  private constructor() {} // Prevents direct instantiation

  public static getInstance(): LoggerSingleton {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = new LoggerSingleton();
    }
    return LoggerSingleton.instance;
  }

  public log(message: string): void {
    this.logs.push(message);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

export default LoggerSingleton;`;

const observerCode = `interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Set<Observer> = new Set();
  private state: number = 0;

  public attach(observer: Observer): void {
    this.observers.add(observer);
  }

  public detach(observer: Observer): void {
    this.observers.delete(observer);
  }

  public setState(state: number): void {
    this.state = state;
    this.notify();
  }

  public getState(): number {
    return this.state;
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state);
    }
  }
}

export { Subject, type Observer };`;

const pubSubCode = `type Callback = (data: any) => void;

class PubSub {
  private channels: Map<string, Set<Callback>> = new Map();

  public subscribe(channel: string, callback: Callback): () => void {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.channels.get(channel);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.channels.delete(channel);
        }
      }
    };
  }

  public publish(channel: string, data: any): void {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      for (const callback of subscribers) {
        callback(data);
      }
    }
  }
}

export default PubSub;`;

export const LLD_PATTERNS_REGISTRY: LLDPattern[] = [
  {
    id: 'singleton-pattern',
    title: 'Singleton Pattern',
    description: "Analogy: The Earth's Moon. No matter where you stand in the world, there is only one Moon, and everyone refers to the same single object. Similarly, a Singleton guarantees a class has exactly one shared instance globally.",
    frameworks: ['React', 'Vanilla'],
    diagram: `
+-----------------------------------------------------------+
|                    SINGLETON UML CLASS                    |
+-----------------------------------------------------------+

   +---------------------------------------------+
   |               LoggerSingleton               |
   +---------------------------------------------+
   |  - private static instance: LoggerSingleton |
   |  - private logsList: string[]               |
   +---------------------------------------------+
   |  - private constructor()                    | <--- BLOCKS "new Logger()"
   |  + public static getInstance(): Logger      | <--- Static accessor
   |  + public log(message: string): void        |
   |  + public getLogs(): string[]               |
   +---------------------------------------------+
`,
    theory: {
      intent: 'Restricts the instantiation of a class to one single object and provides a synchronized entrypoint to it across the entire environment.',
      whenToUse: [
        'Global state management stores (like redux/zustand caches).',
        'Database connections pool managers.',
        'Unified system configuration caches.',
        'Central event loggers or network trackers.'
      ],
      prosAndCons: {
        pros: [
          'Controlled access to a single instance.',
          'Conserves memory by avoiding duplicate heap allocations.',
          'Avoids race conditions on shared files or resources.'
        ],
        cons: [
          'Introduces global state into the application, which makes unit testing difficult due to persistent mock values.',
          'Can mask bad design (spaghetti code) where components are tightly coupled to global variables.'
        ]
      }
    },
    codeFiles: [
      { filename: 'singleton.ts', code: singletonCode, language: 'typescript' }
    ]
  },
  {
    id: 'observer-pattern',
    title: 'Observer Pattern',
    description: 'Establishes a publisher-subscriber model where state updates notify all subscribed listeners automatically.',
    frameworks: ['React', 'Vanilla'],
    diagram: `
+-----------------------------------------------------------+
|                   OBSERVER DESIGN PATTERN                 |
+-----------------------------------------------------------+

       +---------------------------------------------+
       |               Subject (Publisher)           |
       +---------------------------------------------+
       |  - observers: Set<Observer>                 |
       |  - state: number                            |
       +---------------------------------------------+
       |  + attach(observer: Observer): void         |
       |  + detach(observer: Observer): void         |
       |  + notify(): void                           | <--- Loop & trigger updates
       +---------------------------------------------+
                             |
                       (Many-to-One Link)
                             v
       +---------------------------------------------+
       |             Observer (Subscriber)           |
       +---------------------------------------------+
       |  + update(data: any): void                  | <--- Receives BROADCASTS
       +---------------------------------------------+
`,
    theory: {
      intent: 'Defines a one-to-many relationship between objects so that when the subject changes state, all of its subscribed observers are notified and updated automatically.',
      whenToUse: [
        'Syncing multiple visual components when active configurations or themes shift.',
        'Listening to user keyboard inputs, mouse movements, or clicks in visual canvas boards.',
        'Dispatching push alerts based on background network status updates.'
      ],
      prosAndCons: {
        pros: [
          'Supports the Open/Closed Principle — add new subscribers without changing the publisher.',
          'Establishes clean event-driven coupling between modules.'
        ],
        cons: [
          'Subscribers are notified in random order.',
          'If unsubscribe actions are forgotten, unused memory stays occupied, leading to memory leaks (Lapsed Listener Problem).'
        ]
      }
    },
    codeFiles: [
      { filename: 'observer.ts', code: observerCode, language: 'typescript' }
    ]
  },
  {
    id: 'pub-sub-pattern',
    title: 'Publish-Subscribe',
    description: 'Decoupled communication model routing events from publishers to subscribers through a central broker channel.',
    frameworks: ['React', 'Vanilla'],
    diagram: `
+-----------------------------------------------------------+
|                PUBLISH-SUBSCRIBE EVENT FLOW               |
+-----------------------------------------------------------+

 [ Publisher ]                 [ Event Broker ]               [ Subscribers ]
       |                              |                              |
       v  (Publishes "tech" topic)    |                              |
  [ "MacBook M4" ] -----------------> |                              |
                                      | -- (Finds subscribers) ----> |
                                      |                              +---> Subscriber A (tech)
                                      |                              +---> Subscriber C (tech)
                                      |                              |
                                      |                              |
                                      |                              |
                                      |                              x--- Subscriber B (stocks)
                                                                           (Remains Silent!)
`,
    theory: {
      intent: 'Decouples publishers and subscribers entirely through an intermediate Broker channels registry. Senders publish to named topics without needing to know who is listening.',
      whenToUse: [
        'Inter-component communications in massive frontend micro-frontends architectures.',
        'Central event buses handling routing globally across isolated modules.',
        'WebSockets stream handlers routing distinct message types to separate views.'
      ],
      prosAndCons: {
        pros: [
          'Extreme decoupling — publishers and subscribers have zero mutual references.',
          'High scalability — add new topics and listeners at any point in the cycle.'
        ],
        cons: [
          'Harder to debug — because communication is fully decoupled, tracing message flows can be tedious.',
          'No assurance of receipt — messages could be sent into empty channels with zero listeners.'
        ]
      }
    },
    codeFiles: [
      { filename: 'pubsub.ts', code: pubSubCode, language: 'typescript' }
    ]
  }
];
