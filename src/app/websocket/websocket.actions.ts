import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WebSocketActions = createActionGroup({
  source: 'WebSocket',
  events: {
    'Connect WebSocket': emptyProps(),
    'Connect WebSocket Success': emptyProps(),
    'Connect WebSocket Failure': props<{ error: string }>(),
    'Reconnect': emptyProps(),
    'Disconnect': emptyProps(),
    'Disconnect Success': emptyProps(),
  },
});
