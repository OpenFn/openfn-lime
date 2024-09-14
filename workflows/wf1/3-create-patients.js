//Define gender options and prepare newPatientUuid and identifiers
fn(state => {
  const genderOptions = {
    male: 'M',
    female: 'F',
    unknown: 'U',
    transgender_female: 'O',
    transgender_male: 'O',
    prefer_not_to_answer: 'O',
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
each(
  'trackedEntityInstances[*]',
  post(
    'idgen/identifiersource/8549f706-7e85-4c1d-9424-217d50a2988b/identifier',
    {}
  ).then(state => {
    state.identifiers.push(state.data.identifier);
    return state;
  })
);

// Then we map trackedEntityInstances to openMRS data model
fn(state => {
  const {
    trackedEntityInstances,
    identifiers,
    genderOptions,
    nationalityMap,
    statusMap,
    locations,
  } = state;

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

  state.patients = trackedEntityInstances.map((d, i) => {
    const patientNumber = getValueForCode(d.attributes, 'patient_number'); // Add random number for testing + Math.random()

    const nationality =
      nationalityMap[getValueForCode(d.attributes, 'origin_nationality')];
    const currentStatus =
      statusMap[getValueForCode(d.attributes, 'current_status')];
    const legalStatus =
      getValueForCode(d.attributes, 'legal_status') &&
      statusMap[getValueForCode(d.attributes, 'legal_status')];
    const maritalStatus =
      statusMap[getValueForCode(d.attributes, 'marital_status')];
    const employmentStatus =
      statusMap[getValueForCode(d.attributes, 'occupation')];

    const noOfChildren = d.attributes.find(
      a => a.attribute === 'SVoT2cVLd5O'
    )?.value;

    // const lonlat = d.attributes.find(a => a.attribute === 'rBtrjV1Mqkz')?.value;
    // const location = locations.options.find(
    //   o => o.code === lonlat
    // )?.displayName;

    // const [countyDistrict, remainder] = location?.split(' (');
    // const [cityVillage] = remainder?.split(')');

    return {
      patientNumber,
      person: {
        age: getValueForCode(d.attributes, 'age'),
        gender: genderOptions[getValueForCode(d.attributes, 'sex')],
        birthdate:
          d.attributes.find(a => a.attribute === 'WDp4nVor9Z7')?.value ??
          calculateDOB(getValueForCode(d.attributes, 'age')),
        birthdateEstimated: d.attributes.find(
          a => a.attribute === 'WDp4nVor9Z7'
        )
          ? true
          : false,
        names: [
          {
            familyName:
              d.attributes.find(a => a.attribute === 'fa7uwpCKIwa')?.value ??
              'unknown',
            givenName:
              d.attributes.find(a => a.attribute === 'Jt9BhFZkvP2')?.value ??
              'unknown',
          },
        ],
        addresses: [
          {
            country: 'Iraq',
            stateProvince: 'Ninewa',
            // countyDistrict,
            // cityVillage,
          },
        ],
        attributes: [
          {
            attributeType: '24d1fa23-9778-4a8e-9f7b-93f694fc25e2',
            value: nationality,
          },
          {
            attributeType: 'e0b6ed99-72c4-4847-a442-e9929eac4a0f',
            value: currentStatus,
          },
          legalStatus && {
            attributeType: 'a9b2c642-097f-43f8-b96b-4d2f50ffd9b1',
            value: legalStatus,
          },
          {
            attributeType: '3884dc76-c271-4bcb-8df8-81c6fb897f53',
            value: maritalStatus,
          },
          employmentStatus && {
            attributeType: 'dd1f7f0f-ccea-4228-9aa8-a8c3b0ea4c3e',
            value: employmentStatus,
          },
          noOfChildren && {
            attributeType: 'e363161a-9d5c-4331-8463-238938f018ed',
            value: noOfChildren,
          },
        ].filter(i => i),
      },

      identifiers: [
        {
          identifier: identifiers[i], //map ID value from DHIS2 attribute
          identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334',
          location: 'cf6fa7d4-1f19-4c85-ac50-ff824805c51c', //default location old:44c3efb0-2583-4c80-a79e-1f756a03c0a1
          preferred: true,
        },
        {
          uuid: d.trackedEntity,
          identifier: patientNumber,
          identifierType: '8d79403a-c2cc-11de-8d13-0010c6dffd0f', //Old Identification number
          location: 'cf6fa7d4-1f19-4c85-ac50-ff824805c51c', //default location
          preferred: false, //default value for this identifiertype
        },
      ],
    };
  });

  return state;
});

// Creating patients in openMRS
each(
  '$.patients[*]',
  create(
    'patient',
    state => {
      const { patientNumber, ...patient } = state.data;
      console.log(
        'Creating patient record\n',
        JSON.stringify(patient, null, 2)
      );
      return patient;
    },
    state => {
      state.newPatientUuid.push({
        patient_number: state.references.at(-1)?.patientNumber,
        uuid: state.data.body.uuid,
      });
      return state;
    }
  )
);

// Clean up state
fn(({ data, references, ...state }) => state);
