fn(state => {
  util.throwError('DUPLICATE_PATIENT_NUMBERS', {
    description: 'Found TIEs with duplicate patient numbers',
    duplicates: state.duplicatePatients,
  });
});
