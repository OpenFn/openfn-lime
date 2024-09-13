fn(state => {
  // const manualCursor = '2023-06-20T17:00:00.00';
  state.cursor = state.manualCursor || state.lastRunDateTime;
  console.log('Date cursor to filter TEI extract ::', state.cursor);

  return state;
});

// Get trackedEntityInstances that are "active" in the target program
get(
  'tracker/trackedEntities',
  {
    orgUnit: 'OPjuJMZFLop',
    program: 'w9MSPn5oSqp',
    programStatus: 'ACTIVE',
  },
  {},
  state => {
    const trackedEntityInstances = state.data.instances
      .filter(tei => tei.createdAt > state.cursor)
      .slice(0, 1);
    const offset = 2; // GMT+2 (Geneva time)
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + offset);

    const lastRunDateTime = currentDateTime.toISOString().replace('Z', '');

    console.log('# of TEIs extracted ::', trackedEntityInstances.length);
    // console.log(
    //   'trackedEntityInstance IDs ::',
    //   trackedEntityInstances.map(tei => tei.trackedEntityInstance)
    // );

    console.log('Next sync start date:', lastRunDateTime);
    return {
      ...state,
      // data: {},
      references: [],
      trackedEntityInstances,
      lastRunDateTime,
    };
  }
);
