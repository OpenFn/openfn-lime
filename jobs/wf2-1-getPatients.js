searchPatient({ q: 'Test', v: 'full' });
//Query all patients (q=all) not supported on demo OpenMRS; needs to be configured
//...so we query all Patients with name "Patient" instead

fn(state => {
  const { body } = state.data;
  return { ...state, data: {}, references: [], patients: body.results };
});