// Get trackedEntityInstances from DHIS2
// TODO: How to filter based on inactive?
get(
  'trackedEntityInstances',
  {
    ou: 'l22DQq4iV3G',
    program: 'uGHvY5HFoLG',
  },
  state => {
    const { trackedEntityInstances } = state;
    return { ...state, trackedEntityInstances };
  }
);