# react-redux-amplitude

Amplitude analytics integration for redux

## Installation

```
npm install --save react-redux-amplitude
```

### Create and apply the tracker

```
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk'

import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers/index';
import history from '../utils/myHistory';

import amplitudeMiddleware from 'react-redux-amplitude';    // import tracker...

const middlewareHistory = routerMiddleware(history);


const configureStore = (browserHistory, initialState) => {
    const middlewares = [middlewareHistory, thunk];
    middlewares.push(routerMiddleware(history));
    middlewares.push(amplitudeMiddleware());                //apply the middleware
    return createStore(rootReducer, initialState, applyMiddleware(...middlewares));
};
export default configureStore;
```

## Usage

### EventTypes

* `EventTypes.identify`: To track User properties
* `EventTypes.track`: To track Event properties

### In your redux action just tell the middleware what you need to track

```
import { EventTypes } from 'react-redux-amplitude';

function resetAuthed() {
    return {
        type: types.RESET_AUTHED,
        meta: {
            amplitude: {
                eventType: EventTypes.track,
                eventPayload: {
                    eventName: 'LOGOUT',
                },
            },
        },
    };
}

//Can pass multiple tracking in single action
function receiveAuthedUser(user) {
    const {
        userId, emailId, ...rest
    } = user;
    return {
        type: types.RECEIVE_AUTHED_USER,
        user,
        meta: {
            amplitude: [
                {
                    eventType: EventTypes.identify,
                    eventPayload: {
                        userId,
                        ...rest,
                    },
                },
                {
                    eventType: EventTypes.track,
                    eventPayload: {
                        eventName: 'LOGIN',
                        userId,
                        ...rest,
                    },
                },
            ],
        },
    };
}
```

## Inspiration

* [redux-segment](https://github.com/rangle/redux-segment)
* [redux-amplitude](https://github.com/restorando/redux-amplitude)
