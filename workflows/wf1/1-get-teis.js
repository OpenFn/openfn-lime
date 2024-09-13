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
      .filter(tei => tei.updatedAt >= state.cursor) //for testing
      //.filter(tei => tei.createdAt > state.cursor) //for prod
      //.slice(0, 1); //to limit 1 for testing
    const offset = 2; // GMT+2 (Geneva time)
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + offset);

    const lastRunDateTime = currentDateTime.toISOString().replace('Z', '');
    //console.log('TEI payload found before filter ::', JSON.stringify(state.data.instances, null, 2));
    console.log('# of TEIs found before filter ::', state.data.instances.length);
    //console.log('lastUpdated of TEI eWXRNHtmHB0 :: ', JSON.stringify(state.data.instances.filter(tei => tei.trackedEntity == 'eWXRNHtmHB0'), null, 2)); 
    console.log('# of TEIs to migrate to OMRS ::', trackedEntityInstances.length);
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
