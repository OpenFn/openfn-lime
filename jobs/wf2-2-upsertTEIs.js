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

  const pluckIdentifier = (patient, uuid) =>
    patient.identifiers.find(i => i.identifierType.uuid === uuid);

  const patientsMapping = state.patients.map(patient => {
    const oldId = pluckIdentifier(
      patient,
      '8d79403a-c2cc-11de-8d13-0010c6dffd0f'
    ); //finding DHIS2 patient_number
    const openMRSID = pluckIdentifier(
      patient,
      '05a29f94-c0ed-11e2-94be-8c13b969e334'
    ); //finding OpenMRS ID that was auto-assigned

    const identifier = oldId ? oldId.identifier : openMRSID.identifier;

    const dateCreated = patient.auditInfo.dateCreated.substring(0, 10);

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
  return { ...state, patientsMapping };
});

// Upsert TEIs to DHIS2
each(
  'patients[*]',
  upsert(
    'trackedEntityInstances',
    state => state.data.query,
    state => state.data.data
  )
);

// Clean up state
fn(state => ({ ...state, data: {}, references: [] }));
