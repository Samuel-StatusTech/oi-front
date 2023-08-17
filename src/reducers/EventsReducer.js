export default (state = [], action) => {
  switch (action.type) {
    case 'EVENT/LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};
