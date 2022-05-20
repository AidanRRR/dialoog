import { createDakpan } from 'dakpan';
import { ReactNode } from 'react';

import { DialoogProps, Options, State } from './types';

let key = 0;

export const [DialoogProvider, useDialoog] = createDakpan<State>({
  dialogs: []
})({
  open: (element: (props: DialoogProps) => ReactNode, options?: Options) => (state) => ({
    ...state,
    dialogs: [
      ...state.dialogs,
      {
        id: options?.id || String(++key),
        key: String(++key),
        open: true,
        element,
        capture: options?.capture !== false,
        ...options
      }
    ]
  }),
  close: (stack?: string, key?: string) => (state) => {
    const dialogs = state.dialogs.filter((dialog) => dialog.stack === stack);

    return {
      ...state,
      dialogs: state.dialogs.map((dialog) => {
        if (key ? dialog.key !== key : dialogs.indexOf(dialog) !== dialogs.length - 1) {
          return dialog;
        }

        dialog.onClose?.();

        return {
          ...dialog,
          open: false
        };
      })
    };
  },
  remove: (key: string) => (state) => ({
    ...state,
    dialogs: state.dialogs.filter((dialog) => dialog.key !== key)
  }),
  reset: () => (state) => ({
    ...state,
    dialogs: []
  })
});

