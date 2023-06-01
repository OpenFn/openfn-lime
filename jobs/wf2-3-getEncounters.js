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
getEncounters({ q: 'Patient', v: 'full' });

// Update cursor and return encounters
fn(state => {
  const { cursor, data } = state;

  const encounters = data.body.results.filter(
    encounter => encounter.encounterDatetime >= cursor
  );

  const lastRunDateTime = new Date().toISOString();

  console.log('Next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], lastRunDateTime, encounters };
});
