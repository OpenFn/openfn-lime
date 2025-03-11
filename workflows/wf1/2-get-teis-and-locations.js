const findDuplicatePatient = teis => {
  const seen = new Map();
  const duplicates = new Set();

  teis.forEach(tei => {
    const patientNumber = tei.attributes.find(
      attr => attr.code === 'patient_number'
    )?.value;

    if (seen.get(patientNumber)) {
      duplicates.add(patientNumber);
    } else {
      seen.set(patientNumber, tei);
    }
  });

  return duplicates;
};
// Get teis that are "active" in the target program
get('tracker/trackedEntities', {
  orgUnit: $.orgUnit, //'OPjuJMZFLop',
  program: $.program, //'w9MSPn5oSqp',
  programStatus: 'ACTIVE',
  updatedAfter: $.cursor,
  skipPaging: true,
});

fn(state => {
  console.log('# of TEIs found before filter ::', state.data.instances.length);
  const uniqueTeis = [];
  const duplicatePatients = [];
  const missingPatientNumber = [];

  const filteredTeis = state.data.instances.filter(
    tei => tei.updatedAt >= state.cursor
  );

  console.log('Filtered TEIs ::', filteredTeis.length);
  const duplicateIds = findDuplicatePatient(filteredTeis);

  filteredTeis.forEach(tei => {
    const patientNumber = tei.attributes.find(
      attr => attr.code === 'patient_number'
    )?.value;

    if (!patientNumber) {
      missingPatientNumber.push(tei);
    } else if (duplicateIds.has(patientNumber)) {
      duplicatePatients.push(tei);
    } else {
      uniqueTeis.push(tei);
    }
  });

  console.log('# of Unique TEIs to migrate to OMRS ::', uniqueTeis.length);
  // return { uniqueTeis, duplicatePatients, filteredTeis, missingPatientNumber };
  return {
    ...state,
    data: {},
    references: [],
    uniqueTeis,
    duplicatePatients,
    missingPatientNumber,
  };
});

get('optionGroups/kdef7pUey9f', {
  fields: 'id,displayName,options[id,displayName,code]',
});

fn(({ data, ...state }) => {
  state.locations = data;
  return state;
});
