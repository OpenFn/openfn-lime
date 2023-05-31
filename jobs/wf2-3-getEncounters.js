// Define the cursor
fn(state => {
  const manualCursor = '2023-05-23T00:00:00.000';

  const cursor =
    state.lastRunDateTime != null && state.lastRunDateTime != ''
      ? state.lastRunDateTime
      : manualCursor;

  return { ...state, cursor };
});

// Fetch encounters from the date of cursor
getEncounters({ q: 'Patient', v: 'full', fromdate: state => state.cursor });

// Update cursor and return encounters
fn(state => {
  const { body } = state.data;
  const encounters = body.results;
  const lastRunDateTime = new Date().toISOString();

  console.log('Next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], lastRunDateTime, encounters };
});
