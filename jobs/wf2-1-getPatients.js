// here we define the date cursor
fn(state => {
  const manualCursor = '2023-05-18T20:16:37.000+0000';

  const cursor =
    state.lastRunDateTime != null && state.lastRunDateTime != ''
      ? state.lastRunDateTime
      : manualCursor;

  console.log('Date cursor to filter & get only new encounters ::', cursor);

  return { ...state, cursor };
});

searchPatient({ q: '1000FAU', v: 'full' });
//Query all patients (q=all) not supported on demo OpenMRS; needs to be configured
//...so we query all Patients with name "Patient" instead

fn(state => {
  const { body } = state.data;
  console.log('Filtering patients to only sync most recent...'); 
  const patients = body.results.filter(
    patient => patient.auditInfo.dateCreated > state.cursor
  );
  console.log('# of new patients to sync to dhis2 ::', patients.length); 

  const lastRunDateTime = new Date().toISOString();
  console.log('Updating cursor; next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], patients, lastRunDateTime };
});
