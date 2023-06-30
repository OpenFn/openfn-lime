fn(state => {
  const manualCursor = '2023-06-20T17:00:00.00';

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
    const offset = 2; // GMT+2 (Geneva time)
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + offset);

    const lastRunDateTime = currentDateTime.toISOString().replace('Z', '');

    console.log('# of TEIs extracted ::', trackedEntityInstances.length);
    console.log(
      'trackedEntityInstance IDs ::',
      trackedEntityInstances.map(tei => tei.trackedEntityInstance)
    );

    console.log('Next sync start date:', lastRunDateTime);
    return {
      ...state,
      data: {},
      references: [],
      trackedEntityInstances,
      lastRunDateTime,
    };
  }
);
