// here we define the date cursor
fn(state => {
  const manualCursor = '2023-06-01T07:50:00.000'; //'2023-06-01T07:50:00.000'

  //Added this to replace cursor logic below for testing
  const cursor = 
    manualCursor === '' 
      ? state.lastRunDateTime
      : manualCursor; 
      
    //TODO: Update OLD CURSOR LOGIC... this never is cleared if we "clear state" in job 1
    // state.lastRunDateTime != null && state.lastRunDateTime != ''
    //   ? state.lastRunDateTime
    //   : manualCursor;
  
  //FOR TESTING: To re-set job to use manual cursor, comment in the line below 
  //const cursor = manualCursor;
      
  console.log('Date cursor to filter & get only new encounters ::', cursor); 

  return { ...state, cursor };
});

// Fetch encounters from the date of cursor
//getEncounters({ q: 'Patient', v: 'full' }); //Query patients with name like 'Patient'
// OpenMRS demo instance does not support querying ALL records (q=all)
getEncounters({ q: 'Patient', v: 'full' });

// Update cursor and return encounters
fn(state => {
  const { cursor, data } = state;
  console.log('Filtering encounters to only get recent records...');
  console.log('Encounters returned before we filter for most recent ::', JSON.stringify(data,null,2));
  const encounters = data.body.results.filter(
    encounter => encounter.encounterDatetime >= cursor
  );
  console.log('# of new encounters to sync to dhis2 ::', encounters.length);

  const lastRunDateTime = new Date().toISOString();

  console.log('Next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], lastRunDateTime, encounters };
});