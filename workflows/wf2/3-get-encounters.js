// Fetch encounters from the date of cursor
// OpenMRS demo instance does not support querying ALL records (q=all)
// getEncounters({ q: 'Patient', v: 'full', limit: 100 });
getEncounters({ q: 'Katrina', v: 'full' });

// Update cursor and return encounters
fn(state => {
  const { cursor, data } = state;

  console.log('cursor datetime::', cursor);
  console.log('Filtering encounters to only get recent records...');
  // console.log(
  //   'Encounters returned before we filter for most recent ::',
  //   JSON.stringify(encountersFound, null, 2)
  // );
  state.formUuids = [
    '82db23a1-4eb1-3f3c-bb65-b7ebfe95b19b',
    '6a3e1e0e-dd13-3465-b8f5-ee2d42691fe5',
  ];

  const encountersFound = state.formUuids.map(formUuid =>
    data.results.filter(
      encounter =>
        encounter.encounterDatetime >= cursor && encounter.form.uuid == formUuid
    )
  );

  state.encounters = encountersFound
    .map(encounters => encounters[0])
    .filter(e => e);

  console.log(
    '# of new encounters found in OMRS ::',
    encountersFound.flat().length
  );

  console.log(
    '# of new encounters to sync to dhis2 ::',
    state.encounters.length
  );

  return { ...state, data: {}, response: {}, references: [] };
});
