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

searchPatient({ q: '1000EJC', v: 'full' });
//Query all patients (q=all) not supported on demo OpenMRS; needs to be configured
//...so we query all Patients with name "Patient" instead

fn(state => {
  const { body } = state.data;
  const patients = body.results.filter(
    patient => patient.auditInfo.dateCreated > state.cursor
  );

  const lastRunDateTime = new Date().toISOString();
  console.log('Next sync start date:', lastRunDateTime);

  return { ...state, data: {}, references: [], patients, lastRunDateTime };
});
