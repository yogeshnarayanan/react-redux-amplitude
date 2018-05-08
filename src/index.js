import tap from 'redux-tap';

export const EventTypes = {
      track: 'amplitude.eventTypes.track',
      identify: 'amplitude.eventTypes.identify',
};

const filterAmplitude = ({ meta }) => meta && meta.amplitude;

const warn = (msg) => typeof console === 'object' && console.warn(msg);

export default () =>
      tap(filterAmplitude, (amplitude, action, store) => {
            const eventData = Array.isArray(amplitude) ? amplitude : [amplitude];

            if (typeof window !== 'undefined' && typeof window.amplitude === 'object') {
                  eventData.forEach((e) => {
                        const { eventType, eventPayload } = e;
                        if (eventType) {
                              const { type: actionType, meta: actionMeta, ...actionPayload } = action || {
                                    type: 'unknown',
                              };
                              const { eventName, userId, ...rest } = eventPayload || {
                                    name: actionType,
                                    ...actionPayload,
                              };
                              const name = eventName || actionType;
                              if (eventType === EventTypes.track && name) {
                                    window.amplitude.getInstance().logEvent(name, rest);
                              } else if (eventType === EventTypes.identify) {
                                    if (userId) {
                                          window.amplitude.getInstance().setUserId(userId);
                                    }
                                    if (rest) {
                                          window.amplitude.getInstance().setUserProperties(rest);
                                    }
                              }
                        } else {
                              warn(`eventType not found in ${eventData}`);
                        }
                  });
            } else {
                  warn('redux-amplitude has been executed but it seems like Amplitude snippet has not been loaded.');
            }
      });
