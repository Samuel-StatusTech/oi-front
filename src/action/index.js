export const loadUserData = (data) => ({
  type: 'USER/LOAD_DATA',
  payload: data,
});

export const loadEvents = (data) => ({
  type: 'EVENT/LOAD_DATA',
  payload: data,
});

export const selectEvent = (key) => ({
  type: 'EVENT/SELECT_EVENT',
  payload: key,
});
