fn(state => {
  const genderOptions = {
    M: 'male',
    F: 'female',
    U: 'unknown',
    O: 'prefer_not_to_answer',
  };

  const DHIS2_PATIENT_NUMBER = '8d79403a-c2cc-11de-8d13-0010c6dffd0f';
  const OPENMRS_AUTO_ID = '05a29f94-c0ed-11e2-94be-8c13b969e334';
  const patientsUpsert = [];

  const buildPatientsUpsert = (patient, isNewPatient) => {
    const dateCreated = patient.auditInfo.dateCreated.substring(0, 10);

    const { identifier } =
      patient.identifiers.find(
        i => i.identifierType.uuid === DHIS2_PATIENT_NUMBER
      ) ||
      patient.identifiers.find(i => i.identifierType.uuid === OPENMRS_AUTO_ID);

    const enrollments = [
      {
        orgUnit: 'OPjuJMZFLop',
        program: 'w9MSPn5oSqp',
        programStage: 'EZJ9FsNau7Q',
        enrollmentDate: dateCreated,
      },
    ];

    const payload = {
      query: {
        ou: 'OPjuJMZFLop',
        filter: [`AYbfTPYMNJH:Eq:${patient.uuid}`],
      },
      data: {
        program: 'w9MSPn5oSqp',
        orgUnit: 'OPjuJMZFLop',
        trackedEntityType: 'cHlzCA2MuEF',
        attributes: [
          {
            attribute: 'P4wdYGkldeG',
            value: identifier,
          },
          {
            attribute: 'AYbfTPYMNJH',
            value: patient.uuid,
          },
          {
            attribute: 'qptKDiv9uPl',
            value: genderOptions[patient.person.gender],
          },
          {
            attribute: 'T1iX2NuPyqS',
            value: patient.person.age,
          },
        ],
      },
    };

    if (isNewPatient) {
      console.log('create enrollment');
      payload.data.enrollments = enrollments;
    }

    return patientsUpsert.push(payload);
  };

  return {
    ...state,
    genderOptions,
    patientsUpsert,
    buildPatientsUpsert,
  };
});

fn(async state => {
  const { buildPatientsUpsert, patients } = state;

  const getPatient = async patient => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await get(
      'trackedEntityInstances',
      {
        ou: 'OPjuJMZFLop',
        filter: [`jGNhqEeXy2L:Eq:${patient.uuid}`],
      },
      {},
      state => {
        const { trackedEntityInstances } = state.data;
        const isNewPatient = trackedEntityInstances.length === 0;

        buildPatientsUpsert(patient, isNewPatient);
        return state;
      }
    )(state);
  };

  for (const patient of patients) {
    console.log(patient.uuid, 'patient uuid');
    await getPatient(patient);
  }
  return state;
});



// Upsert TEIs to DHIS2
each(
  'patientsUpsert[*]',
  upsert(
    'trackedEntityInstances',
    state => state.data.query,
    state => state.data.data
  )
);

// Clean up state
fn(state => ({ ...state, data: {} }));
