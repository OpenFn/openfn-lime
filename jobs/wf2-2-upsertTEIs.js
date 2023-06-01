fn(state => {
  const genderOptions = {
    M: 'male',
    F: 'female',
    U: 'unknown',
    O: 'Prefered not to answer',
  };

  return {
    ...state,
    genderOptions,
  };
});

each('patients[*]', state => {
  const patient = state.data;
  const { genderOptions } = state;

  const [OldId] = patient.identifiers.filter(
    i => i.identifierType.uuid === '8d79403a-c2cc-11de-8d13-0010c6dffd0f'
  ); //finding DHIS2 patient_number

  const [openMRSID] = patient.identifiers.filter(
    i => i.identifierType.uuid === '05a29f94-c0ed-11e2-94be-8c13b969e334'
  ); //finding OpenMRS ID that was auto-assigned
  const identifier = OldId ? OldId.identifier : openMRSID.identifier;

  //   console.log(`Identifier: ${identifier}`);
  //   console.log(`UUID: ${patient.uuid}`);
  //   console.log(`Age: ${patient.person.age}`);
  //   console.log(`Gender: ${genderOptions[patient.person.gender]}`);

  return upsert(
    'trackedEntityInstances',
    {
      ou: 'l22DQq4iV3G',
      filter: [`jGNhqEeXy2L:Eq:${patient.uuid}`],
    },
    {
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
    }
  )(state);
});

// Clean up state
fn(state => {
  state.data = {};
  state.references = [];
  return state;
});