fn(state => {
  const { nationalityMap, statusMap, placeOflivingMap, genderOptions } = state;

  const DHIS2_PATIENT_NUMBER = '8d79403a-c2cc-11de-8d13-0010c6dffd0f'; //DHIS2 ID or DHIS2 Patient Number
  const OPENMRS_AUTO_ID = '05a29f94-c0ed-11e2-94be-8c13b969e334'; //MSF ID or OpenMRS Patient Number
  const patientsUpsert = [];

  const buildPatientsUpsert = (patient, isNewPatient) => {
    const dateCreated = patient.auditInfo.dateCreated.substring(0, 10);

    function findIdentifierByUuid(identifiers, targetUuid) {
      // Use the `find` method to locate the matching identifier
      const matchingIdentifier = identifiers.find(
        identifier => identifier.identifierType.uuid === targetUuid
      );

      // Return the `identifier` value if a match is found; otherwise, return null
      return matchingIdentifier ? matchingIdentifier.identifier : undefined;
    }

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

    const enrollments = [
      {
        orgUnit: 'OPjuJMZFLop',
        program: 'w9MSPn5oSqp',
        programStage: 'MdTtRixaC1B',
        enrollmentDate: dateCreated,
      },
    ];

    const payload = {
      query: {
        ou: 'OPjuJMZFLop',
        program: 'w9MSPn5oSqp',
        filter: [`AYbfTPYMNJH:Eq:${patient.uuid}`], //upsert on omrs.patient.uid
      },
      data: {
        program: 'w9MSPn5oSqp',
        orgUnit: 'OPjuJMZFLop',
        trackedEntityType: 'cHlzCA2MuEF',
        attributes: [
          {
            attribute: 'fa7uwpCKIwa',
            value: patient.person?.names[0]?.givenName,
          },
          {
            attribute: 'Jt9BhFZkvP2',
            value: patient.person?.names[0]?.familyName,
          },
          {
            attribute: 'P4wdYGkldeG', //DHIS2 ID ==> "Patient Number"
            value:
              findIdentifierByUuid(patient.identifiers, DHIS2_PATIENT_NUMBER) ||
              findIdentifierByUuid(patient.identifiers, OPENMRS_AUTO_ID), //map OMRS ID if no DHIS2 id
          },
          {
            attribute: 'ZBoxuExmxcZ', //MSF ID ==> "OpenMRS Patient Number"
            value: findIdentifierByUuid(patient.identifiers, OPENMRS_AUTO_ID),
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
            attribute: 'Rv8WM2mTuS5',
            value: patient.person.age,
          },
          {
            attribute: 'WDp4nVor9Z7',
            value: patient.person.birthdate.slice(0, 10),
          },
          {
            attribute: 'rBtrjV1Mqkz', //Place of living
            value: placeOflivingMap[patient.person?.addresses[0]?.cityVillage],
          },
          {
            attribute: 'Xvzc9e0JJmp', //nationality
            value:
              nationalityMap[
                patient.person.attributes.find(
                  a =>
                    a.attributeType.uuid ===
                    '24d1fa23-9778-4a8e-9f7b-93f694fc25e2'
                )?.value.uuid
              ], //input.attributeType = "24d1fa23-9778-4a8e-9f7b-93f694fc25e2"
          },
          {
            attribute: 'YUIQIA2ClN6', //current status
            value:
              statusMap[
                patient.person.attributes.find(
                  a =>
                    a.attributeType.uuid ===
                    'e0b6ed99-72c4-4847-a442-e9929eac4a0f'
                )?.value.uuid
              ], //input.attributeType = "e0b6ed99-72c4-4847-a442-e9929eac4a0f"
          },
          {
            attribute: 'Qq6xQ2s6LO8', //legal status
            value:
              statusMap[
                patient.person.attributes.find(
                  a =>
                    a.attributeType.uuid ===
                    'a9b2c642-097f-43f8-b96b-4d2f50ffd9b1'
                )?.value.uuid
              ], //input.attributeType = "a9b2c642-097f-43f8-b96b-4d2f50ffd9b1"
          },
          {
            attribute: 'FpuGAOu6itZ', //marital status
            value:
              statusMap[
                patient.person.attributes.find(
                  a =>
                    a.attributeType.uuid ===
                    '3884dc76-c271-4bcb-8df8-81c6fb897f53'
                )?.value.uuid
              ], //input.attributeType = "3884dc76-c271-4bcb-8df8-81c6fb897f53"
          },
          {
            attribute: 'v7k4OcXrWR8', //employment status
            value:
              statusMap[
                patient.person.attributes.find(
                  a =>
                    a.attributeType.uuid ===
                    'dd1f7f0f-ccea-4228-9aa8-a8c3b0ea4c3e'
                )?.value.uuid
              ], //input.attributeType = "dd1f7f0f-ccea-4228-9aa8-a8c3b0ea4c3e"
          },
          {
            attribute: 'SVoT2cVLd5O', //Number of children
            value: patient.person.attributes.find(
              a =>
                a.attributeType.uuid === 'e363161a-9d5c-4331-8463-238938f018ed'
            )?.value, //input.attributeType = "e363161a-9d5c-4331-8463-238938f018ed"
          },
        ],
      },
    };

    console.log('mapped dhis2 payloads:: ', JSON.stringify(payload, null, 2));

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

each(
  '$.patients[*]',
  get(
    'trackedEntityInstances',
    {
      ou: 'OPjuJMZFLop',
      filter: [`AYbfTPYMNJH:Eq:${$.data.uuid}`],
      program: 'w9MSPn5oSqp',
    },
    {},
    async state => {
      const patient = state.references.at(-1);
      console.log(patient.uuid, 'patient uuid');
      const { trackedEntityInstances } = state.data;
      const isNewPatient = trackedEntityInstances.length === 0;

      state.buildPatientsUpsert(patient, isNewPatient);
      await delay(2000);
      return state;
    }
  )
);

// Upsert TEIs to DHIS2
each(
  '$.patients[*]',
  get(
    'tracker/trackedEntities',
    {
      orgUnit: 'OPjuJMZFLop',
      filter: [`AYbfTPYMNJH:Eq:${$.data.uuid}`],
      program: 'w9MSPn5oSqp',
    },
    {},
    async state => {
      const patient = state.references.at(-1);
      console.log(patient.uuid, 'patient uuid');
      const { instances } = state.data;
      const isNewPatient = instances.length === 0;

      state.buildPatientsUpsert(patient, isNewPatient);
      await delay(2000);
      return state;
    }
  )
);

// Upsert TEIs to DHIS2
each(
  'patientsUpsert[*]',
  upsert('trackedEntityInstances', $.data.query, $.data.data)
);

fn(state => {
  const {
    data,
    patients,
    statusMap,
    references,
    patientsUpsert,
    nationalityMap,
    placeOflivingMap,
    genderOptions,
    response,
    ...next
  } = state;

  next.patientUuids = patients.map(p => p.uuid);
  return next;
});
