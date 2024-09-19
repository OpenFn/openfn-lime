const clear = (state, keys) => {
  if (keys?.length > 0) {
    keys.forEach(key => {
      delete state[key];
    });
  }

  return state;
};
//Here we define the date cursor
//$.cursor at beggining of the project 2023-05-20T06:01:24.000+0000
cursor($.lastRunDateTime || $.manualCursor || '2023-05-20T06:01:24.000+0000');
// Update the lastRunDateTime for the next run
cursor('today', {
  key: 'lastRunDateTime',
  format: c => dateFns.format(new Date(c), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
});

searchPatient({ q: 'Katrina', v: 'full', limit: '100' });
//Query all patients (q=all) not supported on demo OpenMRS; needs to be configured
//...so we query all Patients with name "Patient" instead

fn(state => {
  const { results } = state.data;

  const getPatientByUuid = uuid =>
    results.find(patient => patient.uuid === uuid).auditInfo.dateCreated;

  //console.log('dateCreated for patient uuid ...2c6dbfc5acc8',getPatientByUuid("31b4d9c8-f7cc-4c26-ae61-2c6dbfc5acc8"))
  //console.log(JSON.stringify(state.data, null, 2));

  console.log('Filtering patients since:', state.cursor);

  state.patients = results.filter(({ auditInfo }) => {
    const lastModified = auditInfo?.dateChanged || auditInfo?.dateCreated;
    return lastModified > state.cursor;
  });
  console.log('# of patients to sync to dhis2 ::', state.patients.length);
  console.log(
    'uuids of patients to sync to dhis2 ::',
    state.patients.map(p => p.uuid)
  );

  state.lastRunDateTime = new Date().toISOString();
  console.log('Updating cursor; next sync start date:', state.lastRunDateTime);

  return clear(state, ['data', 'response', 'references']);
});
