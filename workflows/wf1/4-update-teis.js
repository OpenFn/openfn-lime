fn(state => {
  if (state.newPatientUuid.length === 0) {
    console.log('No data fetched in step prior to sync.');
  }

  console.log(
    'newPatientUuid ::',
    JSON.stringify(state.newPatientUuid, null, 2)
  );
  return state;
});

// Update TEI on DHIS2
each(
  'newPatientUuid[*]',
  upsert(
    'trackedEntityInstances',
    state => ({
      ou: 'OPjuJMZFLop',
      program: 'w9MSPn5oSqp',
      filter: [`P4wdYGkldeG:Eq:${state.data.patient_number}`],
    }),
    {
      orgUnit: 'OPjuJMZFLop',
      program: 'w9MSPn5oSqp',
      trackedEntityType: 'cHlzCA2MuEF',
      attributes: [
        { attribute: 'P4wdYGkldeG', value: `${$.data.patient_number}` }, //DHIS2 patient number to use as lookup key
        { attribute: 'AYbfTPYMNJH', value: `${$.data.patient.uuid}` }, //OMRS patient uuid
        {
          attribute: 'ZBoxuExmxcZ',
          value: `${$.data.patient.identifier[0].identifier}`,
        }, //id generated in wf1-2 e.g., "IQ146-24-000-027"
      ],
    }
  )
);
