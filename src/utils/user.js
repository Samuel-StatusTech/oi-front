import { loadUserData, selectEvent, loadEvents } from '../action/index';
export const removeUserData = () => {
  loadUserData({});
  selectEvent({});
  loadEvents({});
  localStorage.removeItem('token');
  localStorage.removeItem('GROUP_SAVED');
};
