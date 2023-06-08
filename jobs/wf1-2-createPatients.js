//Define gender options and prepare newPatientUuid and identifiers
fn(state => {
  const genderOptions = {
    male: 'M',
    female: 'F',
    unknown: 'U',
    //TODO: Ask MSF for updated category option values
    transgender_female: 'O',
    transgender_male: 'O',
    Prefer_not_to_answer: 'O',
    gender_variant_non_conforming: 'O',
  };

  const identifiers = [];
  const newPatientUuid = [];

  const { trackedEntityInstances } = state;
  if (trackedEntityInstances.length > 0)
    console.log(
      '# of TEIs to send to OpenMRS: ',
      trackedEntityInstances.length
    );
  if (trackedEntityInstances.length === 0)
    console.log('No data fetched in step prior to sync.');

  return {
    ...state,
    genderOptions,
    newPatientUuid,
    identifiers,
  };
});

//First we generate a unique OpenMRS ID for each patient
each('trackedEntityInstances[*]', state => {
  return post(
    'idgen/identifiersource/8549f706-7e85-4c1d-9424-217d50a2988b/identifier',
    {}
  )(state).then(state => {
    state.identifiers.push(state.data.body.identifier);
    return state;
  });
});

// Then we map trackedEntityInstances to openMRS data model
fn(state => {
  const { trackedEntityInstances, identifiers, genderOptions } = state;

  const getValueForCode = (attributes, code) => {
    const result = attributes.find(attribute => attribute.code === code);
    return result ? result.value : undefined;
  };

  const calculateDOB = age => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthYear = currentYear - age;

    const birthday = new Date(
      birthYear,
      currentDate.getMonth(),
      currentDate.getDay()
    );

    return birthday.toISOString().replace(/\.\d+Z$/, '+0000');
  };

  const patients = trackedEntityInstances.map((d, i) => {
    const patientNumber = getValueForCode(d.attributes, 'patient_number'); // Add random number for testing + Math.random()

    return {
      patientNumber: patientNumber,
      identifiers: [
        {
          identifier: identifiers[i], //map ID value from DHIS2 attribute
          identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334',
          location: '44c3efb0-2583-4c80-a79e-1f756a03c0a1', //default location
          preferred: true,
        },
        {
          identifier: patientNumber,
          identifierType: '8d79403a-c2cc-11de-8d13-0010c6dffd0f', //Old Identification number
          location: '44c3efb0-2583-4c80-a79e-1f756a03c0a1', //default location
          preferred: false, //default value for this identifiertype
        },
      ],
      person: {
        gender: genderOptions[getValueForCode(d.attributes, 'sex')],
        age: getValueForCode(d.attributes, 'age'),
        birthdate: calculateDOB(getValueForCode(d.attributes, 'age')),
        birthdateEstimated: true,
        names: [
          {
            familyName: patientNumber,
            givenName: 'Patient',
          },
        ],
      },
    };
  });

  return { ...state, patients };
});

// Creating patients in openMRS
each('patients[*]', state => {
  const { patientNumber, ...patient } = state.data;

  console.log('Creating patient record\n', JSON.stringify(patient, null, 2));

  return createPatient(patient)(state).then(state => {
    state.newPatientUuid.push({
      patient_number: patientNumber,
      uuid: state.data.body.uuid,
    });
    return state;
  });
});

// Clean up state
fn(state => ({ ...state, data: {}, references: [] }));
