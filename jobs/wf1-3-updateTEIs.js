each('newPatientUuid[*]', state => {
  console.log(JSON.stringify(state.data, null, 2));

  return upsert(
    'trackedEntityInstances',
    {
      ou: 'l22DQq4iV3G',
      filter: [`P4wdYGkldeG:Eq:${state.data.patient_number}`],
    },
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
  )(state);
});
