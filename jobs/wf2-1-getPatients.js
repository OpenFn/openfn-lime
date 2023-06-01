searchPatient({ q: 'Patient', v: 'full' });

fn(state => {
  const { body } = state.data;
  return { ...state, data: {}, references: [], patients: body.results };
});
