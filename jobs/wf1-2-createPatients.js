//Define gender options and prepare newPatientUuid and identifiers
fn(state => {
  //TODO: Update option value mappings
  const genderOptions = {
    male: 'M',
    female: 'F',
    unknown: 'U',
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

//First we generate a unique OpenMRS "MSF ID" for each patient
each('trackedEntityInstances[*]', state => {
  return post(
    'idgen/identifiersource/05a29f94-c0ed-11e2-94be-8c13b969e334/identifier', //MSF ID
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
    const result = attributes.find(attribute => attribute.attribute === code); //to match on attribute.attribute ID
    //const result = attributes.find(attribute => attribute.code === code); //to match on attribute.code
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

    const siteLocation = 'cf6fa7d4-1f19-4c85-ac50-ff824805c51c'; //Mental Health (MH): default location in OMRS

    return {
      patientNumber: patientNumber,
      identifiers: [
        {
          identifier: identifiers[i], //map ID value from DHIS2 attribute
          identifierType: '8d79403a-c2cc-11de-8d13-0010c6dffd0f', //"DHIS2 ID" identifier
          location: siteLocation,
          preferred: true,
        },
        {
          identifier: patientNumber,
          identifierType: '8d79403a-c2cc-11de-8d13-0010c6dffd0f', //TODO: Add if Old Identification number
          location: siteLocation,
          preferred: false, //default value for this identifiertype
        },
      ],
      person: {
        gender: genderOptions[getValueForCode(d.attributes, 'qptKDiv9uPl')], //sex
        age: getValueForCode(d.attributes, 'Rv8WM2mTuS5'), //age
        birthdate: getValueForCode(d.attributes, 'WDp4nVor9Z7'), //dateOfBirth
        //birthdate: calculateDOB(getValueForCode(d.attributes, 'Rv8WM2mTuS5')), //TODO: check if DOB in source?
        birthdateEstimated: true, //TODO: Logic depending if DOB present?
        names: [
          {
            familyName: patientNumber, //TODO: Map names from DHIS2?
            givenName: 'Patient',
          },
        ],
        // TODO: Confirm Place of living mapping
        // Example Input: "Afadé (Goulfey) - CM"
        // addresses: [
        //   {
        //     country: 'Iraq',
        //     stateProvince: 'Ninewa',
        //     countyDistrict: 'Mosul',
        //     cityVillage: 'VillageA',
        //     address1: 'Street1',
        //   },
        // ],
        attributes: [
          {
            attributeType: '24d1fa23-9778-4a8e-9f7b-93f694fc25e2',
            value: getValueForCode(d.attributes, 'Xvzc9e0JJmp'), //nationality
          },
          {
            attributeType: 'e0b6ed99-72c4-4847-a442-e9929eac4a0f',
            value: getValueForCode(d.attributes, 'YUIQIA2ClN6'), //current status
          },
          {
            attributeType: 'a9b2c642-097f-43f8-b96b-4d2f50ffd9b1',
            value: getValueForCode(d.attributes, 'Qq6xQ2s6LO8'), //legal status
          },
          {
            attributeType: '3884dc76-c271-4bcb-8df8-81c6fb897f53',
            value: getValueForCode(d.attributes, 'FpuGAOu6itZ'), //marital status
          },
          {
            attributeType: 'dd1f7f0f-ccea-4228-9aa8-a8c3b0ea4c3e',
            value: getValueForCode(d.attributes, 'v7k4OcXrWR8'), //occupation/employment status
          },
          // TODO: Confirm if No. of Children included in WF1
          // {
          //   attributeType: 'e363161a-9d5c-4331-8463-238938f018ed',
          //   value: getValueForCode(d.attributes, 'SVoT2cVLd5O'), //No of children
          // },
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
