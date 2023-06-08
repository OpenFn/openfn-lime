fn(state => {
  if (state.newPatientUuid.length === 0)
    console.log('No data fetched in step prior to sync.');
  return state;
});

// Update TEI on DHIS2
each(
  'newPatientUuid[*]',
  upsert(
    'trackedEntityInstances',
    state => ({
      ou: 'l22DQq4iV3G',
      filter: [`P4wdYGkldeG:Eq:${state.data.patient_number}`],
    }),
    {
      orgUnit: 'l22DQq4iV3G',
      program: 'uGHvY5HFoLG',
      trackedEntityType: 'cHlzCA2MuEF',
      attributes: [
        {
          attribute: 'P4wdYGkldeG',
          value: `${state.data.patient_number}`,
        },
        {
          attribute: 'jGNhqEeXy2L',
          value: `${state.data.uuid}`,
        },
      ],
    }
  )
);
