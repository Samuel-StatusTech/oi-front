export default (state = {}, action) => {
  switch (action.type) {
    case 'USER/LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};
