// here we define the date cursor
fn(state => {
  //manualCursor at beggining of the project 2023-05-20T06:01:24.000+0000
  const manualCursor = '2023-07-27T07:16:24.544Z';

  state.cursor = state.lastRunDateTime || manualCursor;

  console.log(
    'Date cursor to filter & get only recent OMRS records ::',
    state.cursor
  );

  return state;
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

  console.log('Filtering patients to only sync most recent records...');

  state.patients = results.filter(
    patient =>
      (patient.auditInfo.dateChanged === null
        ? patient.auditInfo.dateCreated
        : patient.auditInfo.dateChanged) > state.cursor
  );
  console.log('# of patients to sync to dhis2 ::', state.patients.length);
  console.log(
    'uuids of patients to sync to dhis2 ::',
    state.patients.map(p => p.uuid)
  );

  state.lastRunDateTime = new Date().toISOString();
  console.log('Updating cursor; next sync start date:', state.lastRunDateTime);

  state.data = {};
  state.response = {};
  state.references = [];
  return state;
});
