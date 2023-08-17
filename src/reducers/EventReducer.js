export default (state = '', action) => {
  switch (action.type) {
    case 'EVENT/SELECT_EVENT':
      console.log('event reducer', action.payload);
      return action.payload;
    default:
      return state;
  }
};
