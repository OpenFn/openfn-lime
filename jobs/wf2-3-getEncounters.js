// here we define the date cursor
fn(state => {
  const manualCursor = '2023-06-01T07:50:00.000';

  const cursor =
    state.lastRunDateTime != null && state.lastRunDateTime != ''
      ? state.lastRunDateTime
      : manualCursor;
      
  console.log('Date cursor to filter & get only new encounters ::', cursor); 

  return { ...state, cursor };
});

// Fetch encounters from the date of cursor
//getEncounters({ q: 'Patient', v: 'full' }); //Query patients with name like 'Patient'
// OpenMRS demo instance does not support querying ALL records (q=all)
getEncounters({ q: '1000FAU', v: 'full' });

// Update cursor and return encounters
fn(state => {
  const { cursor, data } = state;
  console.log('Filtering encounters to only get recent records...');
  const encounters = data.body.results.filter(
    encounter => encounter.encounterDatetime >= cursor
  );
  console.log('# of new encounters to sync to dhis2 ::', encounters.length);

  const lastRunDateTime = new Date().toISOString();

  console.log('Next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], lastRunDateTime, encounters };
});