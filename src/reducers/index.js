import { combineReducers } from 'redux';

import UserReducer from './UserReducer';
import EventsReducer from './EventsReducer';
import EventReducer from './EventReducer';

export default combineReducers({
  user: UserReducer,
  events: EventsReducer,
  event: EventReducer,
});
