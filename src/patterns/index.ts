import React from 'react';
import { LLDPattern } from './types';

// Interactive Sandboxes
import { SingletonDemo } from './Singleton/SingletonDemo';
import { ObserverDemo } from './Observer/ObserverDemo';
import { PubSubDemo } from './PubSub/PubSubDemo';

// Code Snippets
import { singletonCode } from './Singleton/code';
import { observerCode } from './Observer/code';
import { pubSubCode } from './PubSub/code';

export const LLD_PATTERNS_REGISTRY: LLDPattern[] = [
  {
    id: 'singleton-pattern',
    title: 'Singleton Pattern',
    description: 'Guarantees a class has only one single active instance and provides a global access method to it.',
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
    demoComponent: React.createElement(SingletonDemo),
    codeFiles: [
      { filename: 'singleton.ts', code: singletonCode, language: 'typescript' }
    ]
  },
  {
    id: 'observer-pattern',
    title: 'Observer Pattern',
    description: 'Establishes a publisher-subscriber model where state updates notify all subscribed listeners automatically.',
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
    demoComponent: React.createElement(ObserverDemo),
    codeFiles: [
      { filename: 'observer.ts', code: observerCode, language: 'typescript' }
    ]
  },
  {
    id: 'pub-sub-pattern',
    title: 'Publish-Subscribe',
    description: 'Decoupled communication model routing events from publishers to subscribers through a central broker channel.',
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
    demoComponent: React.createElement(PubSubDemo),
    codeFiles: [
      { filename: 'pubsub.ts', code: pubSubCode, language: 'typescript' }
    ]
  }
];
