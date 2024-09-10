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

    const { identifierMSFID } = patient.identifiers.find(
      i => i.identifierType.uuid === OPENMRS_AUTO_ID
    );

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
        program: 'w9MSPn5oSqp',
        filter: [`AYbfTPYMNJH:Eq:${patient.uuid}`],
      },
      data: {
        program: 'w9MSPn5oSqp',
        orgUnit: 'OPjuJMZFLop',
        trackedEntityType: 'cHlzCA2MuEF',
        attributes: [
          {
            attribute: 'fa7uwpCKIwa',
            value: patient.person.names[0].givenName,
          },
          {
            attribute: 'Jt9BhFZkvP2',
            value: patient.person.names[0].familyName,
          },
          {
            attribute: 'P4wdYGkldeG', //DHIS2 ID ==> "Patient Number"
            value: identifier,
          },
          {
            attribute: 'ZBoxuExmxcZ', //MSF ID ==> "OpenMRS Patient Number"
            value: identifierMSFID,
          },
          {
            attribute: 'AYbfTPYMNJH', //"OpenMRS Patient UID"
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
        filter: [`AYbfTPYMNJH:Eq:${patient.uuid}`],
        program: 'w9MSPn5oSqp',
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
  upsert('trackedEntityInstances', $.data.query, $.data.data)
);

// Clean up state
fn(({ data, ...state }) => state);
