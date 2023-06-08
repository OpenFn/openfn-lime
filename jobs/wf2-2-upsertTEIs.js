fn(state => {
  const genderOptions = {
    M: 'male',
    F: 'female',
    U: 'unknown',
    O: 'prefer_not_to_answer',
  };

  return {
    ...state,
    genderOptions,
  };
});

// Prepare DHIS2 data model for patients
fn(state => {
  const { genderOptions } = state;

  const patientsUpsert = state.patients.map(patient => {
    const dateCreated = patient.auditInfo.dateCreated.substring(0, 10);

    const DHIS2_PATIENT_NUMBER = '8d79403a-c2cc-11de-8d13-0010c6dffd0f';
    const OPENMRS_AUTO_ID = '05a29f94-c0ed-11e2-94be-8c13b969e334';

    const { identifier } =
      patient.identifiers.find(
        i => i.identifierType.uuid === DHIS2_PATIENT_NUMBER
      ) ||
      patient.identifiers.find(i => i.identifierType.uuid === OPENMRS_AUTO_ID);

    return {
      query: {
        ou: 'l22DQq4iV3G',
        filter: [`jGNhqEeXy2L:Eq:${patient.uuid}`],
      },
      data: {
        program: 'uGHvY5HFoLG',
        orgUnit: 'l22DQq4iV3G',
        trackedEntityType: 'cHlzCA2MuEF',
        attributes: [
          {
            attribute: 'P4wdYGkldeG',
            value: identifier,
          },
          {
            attribute: 'jGNhqEeXy2L',
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
        enrollments: [
          {
            orgUnit: 'l22DQq4iV3G',
            program: 'uGHvY5HFoLG',
            programStage: 'hfKSeo6nZK0',
            enrollmentDate: dateCreated,
          },
        ],
      },
    };
  });
  return { ...state, patientsUpsert };
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
fn(state => ({ ...state, data: {}, references: [] }));
