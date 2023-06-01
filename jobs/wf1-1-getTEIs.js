fn(state => {
  const manualCursor = '2023-06-01T08:00:00.000';

  const cursor =
    state.lastRunDateTime != null && state.lastRunDateTime != ''
      ? state.lastRunDateTime
      : manualCursor;
      
  console.log('Date cursor to filter TEI extract ::', cursor);

  return { ...state, cursor };
});

// Get trackedEntityInstances that are "active" in the target program
get(
  'trackedEntityInstances',
  {
    ou: 'l22DQq4iV3G',
    program: 'uGHvY5HFoLG',
    programStatus: 'ACTIVE',
  },
  {},
  state => {
    const trackedEntityInstances = state.data.trackedEntityInstances.filter(
      tei => tei.created > state.cursor
    );
    const lastRunDateTime = new Date().toISOString();

    console.log('# of TEIs extracted ::', trackedEntityInstances.length);

    console.log('Next sync start date:', lastRunDateTime);
    return { ...state, trackedEntityInstances, lastRunDateTime };
  }
);
