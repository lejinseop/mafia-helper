import { createMachine, assign, Event, EventObject } from 'xstate';
import { uniq } from 'lodash';

export const users = [
  '김규식',
  '김순철',
  '류진영',
  '민홍기',
  '박제훈',
  '박찬민',
  '염서연',
  '오평',
  '이상진',
  '이장춘',
  '임정목',
  '현태수',
];

const MAFIA_LIMIT_COUNT = 3;
const PICKPOCKET_LIMIT_COUNT = 1;
const POLICE_LIMIT_COUNT = 1;
const DOCTOR_LIMIT_COUNT = 1;
const PRIEST_LIMIT_COUNT = 1;

export const steps = {
  READY: 'READY',
  INGAME: 'INGAME',
  INGAME_MORNING: 'INGAME_MORNING',
  INGAME_NIGHT: 'INGAME_NIGHT',
  END: 'END',
} as const;

export const jobs = {
  mafia: 'mafia',
  pickpocket: 'pickpocket',
  police: 'police',
  doctor: 'doctor',
  priest: 'priest',
} as const;

export type Jobs = keyof typeof jobs;

export function isJob(context: MachineContext, name: string, target: Jobs) {
  return context[target].includes(name);
}

export function isAssigned(context: MachineContext, name: string) {
  const assignedUsers = [
    ...context.mafia,
    ...context.pickpocket,
    ...context.police,
    ...context.doctor,
    ...context.priest,
  ];
  return uniq(assignedUsers).includes(name);
}

export function isDied(context: MachineContext, name: string) {
  return context.died.includes(name);
}

export interface MachineContext {
  mafia: string[];
  pickpocket: string[];
  police: string[];
  doctor: string[];
  priest: string[];
  died: string[];
  jobless: string[];
}

const machine = createMachine<MachineContext>(
  {
    id: 'mafia-helper',
    initial: steps.READY,
    context: {
      mafia: [],
      pickpocket: [],
      police: [],
      doctor: [],
      priest: [],
      died: [],
      jobless: [],
    },
    states: {
      [steps.READY]: {
        on: {
          ASSIGN_MAFIA: {
            actions: assign((context, event) => {
              const { mafia, ...other } = context;

              if (mafia.length >= MAFIA_LIMIT_COUNT) {
                return context;
              }

              if (context.mafia.includes(event.name)) {
                return {
                  ...other,
                  mafia: mafia.filter((name) => name !== event.name),
                };
              }

              return {
                ...other,
                mafia: uniq([...mafia, event.name]),
              };
            }),
          },
          ASSIGN_PICKPOCKET: {
            actions: assign((context, event) => {
              const { pickpocket, ...other } = context;

              if (pickpocket.length >= PICKPOCKET_LIMIT_COUNT) {
                return context;
              }

              if (context.pickpocket.includes(event.name)) {
                return {
                  ...other,
                  pickpocket: pickpocket.filter((name) => name !== event.name),
                };
              }

              return {
                ...other,
                pickpocket: uniq([...pickpocket, event.name]),
              };
            }),
          },
          ASSIGN_POLICE: {
            actions: assign((context, event) => {
              const { police, ...other } = context;

              if (police.length >= POLICE_LIMIT_COUNT) {
                return context;
              }

              if (context.police.includes(event.name)) {
                return {
                  ...other,
                  police: police.filter((name) => name !== event.name),
                };
              }

              return {
                ...other,
                police: uniq([...police, event.name]),
              };
            }),
          },
          ASSIGN_DOCTOR: {
            actions: assign((context, event) => {
              const { doctor, ...other } = context;

              if (doctor.length >= DOCTOR_LIMIT_COUNT) {
                return context;
              }

              if (context.doctor.includes(event.name)) {
                return {
                  ...other,
                  doctor: doctor.filter((name) => name !== event.name),
                };
              }

              return {
                ...other,
                doctor: uniq([...doctor, event.name]),
              };
            }),
          },
          ASSIGN_PRIEST: {
            actions: assign((context, event) => {
              const { priest, ...other } = context;

              if (priest.length >= PRIEST_LIMIT_COUNT) {
                return context;
              }

              if (context.priest.includes(event.name)) {
                return {
                  ...other,
                  priest: priest.filter((name) => name !== event.name),
                };
              }

              return {
                ...other,
                priest: uniq([...priest, event.name]),
              };
            }),
          },
          COMPLETE: {
            target: steps.INGAME,
            actions: assign((context) => {
              const { jobless, ...other } = context;
              const { mafia, pickpocket, police, doctor, priest } = other;
              const worker = uniq([
                ...mafia,
                ...pickpocket,
                ...police,
                ...doctor,
                ...priest,
              ]);

              return {
                ...other,
                jobless: users.filter((name) => !worker.includes(name)),
              };
            }),
          },
          RESTART: {
            target: steps.READY,
            actions: ['reset'],
          },
        },
      },
      [steps.INGAME]: {
        on: {
          START: steps.INGAME_NIGHT,
          COMPLETE: steps.END,
          RESTART: {
            target: steps.READY,
            actions: ['reset'],
          },
        },
      },
      [steps.INGAME_MORNING]: {
        on: {
          END: steps.INGAME_NIGHT,
          VOTE: {
            actions: assign((context, event) => {
              const { died } = context;
              return {
                ...context,
                died: [...died, event.name],
              };
            }),
          },
          RESTART: {
            target: steps.READY,
            actions: ['reset'],
          },
        },
      },
      [steps.INGAME_NIGHT]: {
        on: {
          END: steps.INGAME_MORNING,
          ACTION_MAFIA: {
            actions: assign((context, event) => {
              const { died } = context;
              return {
                ...context,
                died: [...died, event.name],
              };
            }),
          },
          ACTION_DOCTORL: {
            actions: assign((context, event) => {
              const { died } = context;
              return {
                ...context,
                died: died.filter((name) => name !== event.name),
              };
            }),
          },
          RESTART: {
            target: steps.READY,
            actions: ['reset'],
          },
        },
      },
      [steps.END]: {
        on: {
          RESTART: {
            target: steps.READY,
            actions: ['reset'],
          },
        },
      },
    },
  },
  {
    actions: {
      reset: assign({
        mafia: () => [] as string[],
        pickpocket: () => [] as string[],
        police: () => [] as string[],
        doctor: () => [] as string[],
        priest: () => [] as string[],
        jobless: () => [] as string[],
        died: () => [] as string[],
      }),
    },
  },
);

export default machine;
