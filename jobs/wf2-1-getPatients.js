// here we define the date cursor
fn(state => {
  const manualCursor = '2023-06-08T12:30:00.000+0000';

  const cursor =
    state.lastRunDateTime != null && state.lastRunDateTime != ''
      ? state.lastRunDateTime
      : manualCursor;

  console.log(
    'Date cursor to filter & get only recent OMRS records ::',
    cursor
  );

  return { ...state, cursor };
});

searchPatient({ q: 'Patient', v: 'full' });
//Query all patients (q=all) not supported on demo OpenMRS; needs to be configured
//...so we query all Patients with name "Patient" instead

fn(state => {
  const { body } = state.data;
  console.log(JSON.stringify(state.data, null, 2));
  console.log('Filtering patients to only sync most recent records...');

  const patients = body.results.filter(
    patient =>
      (patient.auditInfo.dateChanged === null
        ? patient.auditInfo.dateCreated
        : patient.auditInfo.dateChanged) > state.cursor
  );
  console.log('# of new patients to sync to dhis2 ::', patients.length);
  // console.log(JSON.stringify(patients, null, 2));

  const lastRunDateTime = new Date().toISOString();
  console.log('Updating cursor; next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], patients, lastRunDateTime };
});
