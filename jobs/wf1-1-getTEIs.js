// query: 'inactive:eq:true',
// filter: ['inactive:eq:true'], //option 2 - TBD which option works
// inactive: true, //option 1 to filter by inactive
get(
  'trackedEntityInstances',
  {
    ou: 'l22DQq4iV3G',
    program: 'uGHvY5HFoLG',
  },
  state => {
    // console.log('TEI data ::', JSON.stringify(state.data));
    return state;
  }
);
