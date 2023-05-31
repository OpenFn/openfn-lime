//Define gender options and prepare newPatientUuid and identifiers
fn(state => {
  const genderOptions = {
    male: 'M',
    female: 'F',
    unknown: 'U',
    //TODO: Ask MSF for updated category option values
    'Transgender female': 'O',
    'Transgender male': 'O',
    'Prefer not to answer': 'O',
    'Gender variant - Non conforming': 'O',
  };

  const identifiers = [];
  const newPatientUuid = [];

  return { ...state, genderOptions, newPatientUuid, identifiers };
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

  const pluckAttributeValue = (arr, keyVal) => {
    const result = arr.filter(a => a.code === keyVal);
    return result.length > 0 ? result[0].value : undefined;
  };

  const calculateDOB = age => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthYear = currentYear - age;

    const birthday = `${birthYear}-${currentDate.getMonth()}-${currentDate.getDate()}`;

    return birthday;
  };
  

  const patients = trackedEntityInstances.map((d, i) => {
    const patientNumber = d.patient_number;
    
    //If we want to clean text from DHIS2 patient_number
    // const patientNumber = pluckAttributeValue(
    //   d.attributes,
    //   'patient_number'
    // ).match(/\b\d+\b/g)[0];

    return {
      identifiers: [
        {
          identifier: identifiers[i], // FOR TESTING: Add random number for testing + Math.random()
          identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334',
          location: '44c3efb0-2583-4c80-a79e-1f756a03c0a1', //default location
          preferred: true,
        },
        {
          identifier: patientNumber, /// FOR TESTING: map ID value from DHIS2 attribute
          identifierType: '8d79403a-c2cc-11de-8d13-0010c6dffd0f', //Old Identification number
          location: '44c3efb0-2583-4c80-a79e-1f756a03c0a1', //default location
          preferred: false, //default value for this identifiertype
        },
      ],
      person: {
        gender: genderOptions[pluckAttributeValue(d.attributes, 'sex')],
        age: pluckAttributeValue(d.attributes, 'age'),
        birthdate: calculateDOB(pluckAttributeValue(d.attributes, 'age')),
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
  const patient = state.data;
  const pn = patient.identifiers.filter(i => !i.preferred)[0];

  console.log('Creating patient record\n', JSON.stringify(patient, null, 2));

  return createPatient(patient)(state).then(state => {
    state.newPatientUuid.push({
      patient_number: pn.identifier,
      uuid: state.data.body.uuid,
    });
    return state;
  });
});