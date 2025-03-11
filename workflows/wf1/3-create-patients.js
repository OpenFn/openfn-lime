//Define gender options and prepare newPatientUuid and identifiers
fn(state => {
  const { uniqueTeis } = state;
  if (uniqueTeis.length > 0)
    console.log('# of TEIs to send to OpenMRS: ', uniqueTeis.length);
  if (uniqueTeis.length === 0)
    console.log('No data fetched in step prior to sync.');

  return state;
});

//First we generate a unique OpenMRS ID for each patient
each(
  $.uniqueTeis,
  post(
    'idgen/identifiersource/8549f706-7e85-4c1d-9424-217d50a2988b/identifier'
  ).then(state => {
    state.identifiers ??= [];
    state.identifiers.push(state.data.identifier);
    return state;
  })
);

// Then we map uniqueTeis to openMRS data model
fn(state => {
  const {
    uniqueTeis,
    nationalityMap,
    genderOptions,
    identifiers,
    statusMap,
    locations,
  } = state;

  const getValueForCode = (attributes, code) => {
    const result = attributes.find(attribute => attribute.code === code);
    return result ? result.value : undefined;
  };

  const calculateDOB = age => {
    if (!age) return age;
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

  state.patients = uniqueTeis.map((d, i) => {
    const patientNumber =
      getValueForCode(d.attributes, 'patient_number') || d.trackedEntity; // Add random number for testing + Math.random()

    const lonlat = d.attributes.find(a => a.attribute === 'rBtrjV1Mqkz')?.value;
    const location = lonlat
      ? locations.options.find(o => o.code === lonlat)?.displayName
      : undefined;

    let countyDistrict, cityVillage;

    if (location) {
      const match = location.match(/^(.*?)\s*\((.*?)\)/);
      if (match) {
        [, countyDistrict, cityVillage] = match;
        cityVillage = cityVillage.split('-')[0].trim(); // Remove country code and trim
      }
    }

    const attributes = d.attributes
      .filter(a => a.attribute in state.patientAttributes)
      .map(a => {
        let value = a.value;

        if (a.displayName === 'Nationality') {
          value = nationalityMap[a.value];
        } else if (a.displayName.includes(' status')) {
          value = statusMap[a.value];
        }

        if (value) {
          return {
            attributeType: state.patientAttributes[a.attribute].trim(),
            value,
          };
        }
      })
      .filter(Boolean);

    return {
      patientNumber,
      person: {
        age: getValueForCode(d.attributes, 'age'),
        gender: genderOptions[getValueForCode(d.attributes, 'sex')] ?? 'U',
        birthdate:
          d.attributes.find(a => a.attribute === 'WDp4nVor9Z7')?.value ??
          calculateDOB(getValueForCode(d.attributes, 'age')),
        // d.attributes.find(a => a.attribute === 'WDp4nVor9Z7')?.value ?
        // calculateDOB(getValueForCode(d.attributes, 'age')) : '1900-01-01',
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
            countyDistrict,
            cityVillage,
          },
        ],
        attributes,
      },
      identifiers: [
        {
          identifier: identifiers[i], //OMRS-generated identifier - see above
          identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334',
          location: 'cf6fa7d4-1f19-4c85-ac50-ff824805c51c', //default location old:44c3efb0-2583-4c80-a79e-1f756a03c0a1
          preferred: true,
        },
        {
          uuid: d.trackedEntity,
          identifier: patientNumber, //Patient Number from DHIS2
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
  $.patients,
  upsert(
    'patient',
    { q: $.data.patientNumber },
    state => {
      const { patientNumber, ...patient } = state.data;
      console.log(
        'Upserting patient record...',
        JSON.stringify(patient, null, 2)
      );
      return patient;
    },
    state => {
      state.newPatientUuid ??= [];
      //console.log('state.references ::', state.references)
      state.newPatientUuid.push({
        patient_number: state.references.at(-1)?.patientNumber,
        omrs_patient_number: state.references
          .at(-1)
          ?.identifiers.find(
            i => (i.identifierType = `${state.openmrsAutoId}`)
          ),
        uuid: state.data.uuid,
      });
      return state;
    }
  )
);

// Clean up state
fn(({ data, references, ...state }) => state);
