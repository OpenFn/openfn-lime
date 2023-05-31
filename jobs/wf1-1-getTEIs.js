// Get trackedEntityInstances that are "active" in the target program
get(
  'trackedEntityInstances',
  {
    ou: 'l22DQq4iV3G',
    program: 'uGHvY5HFoLG',
    programStatus: 'ACTIVE'
  },
  state => {
    const { trackedEntityInstances } = state;
    console.log('# of TEIs extracted ::', trackedEntityInstances.length)
    return { ...state, trackedEntityInstances };
  }
);