// Fetch encounters from the date of cursor
// OpenMRS demo instance does not support querying ALL records (q=all)
// getEncounters({ q: 'Patient', v: 'full', limit: 100 });
getEncounters({
  q: 'Aisha',
  v: 'full',
  limit: 1,
  encounterType: '95d68645-1b72-4290-be0b-ec1fb64bc067',
});

// Update cursor and return encounters
fn(state => {
  const { cursor, data } = state;
  console.log('cursor datetime::', cursor);

  console.log('Filtering encounters to only get recent records...');
  // console.log(
  //   'Encounters returned before we filter for most recent ::',
  //   JSON.stringify(data, null, 2)
  // );
  const encounters = data.results.filter(
    encounter => encounter.encounterDatetime >= cursor
  );
  console.log('# of new encounters to sync to dhis2 ::', encounters.length);

  return { ...state, data: {}, references: [], encounters };
});
