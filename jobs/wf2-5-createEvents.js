fn(state => {
  const TEIs = {};
  return { ...state, TEIs };
});

// Fetch TEI's for each patient
each('encounters[*]', state => {
  const encounter = state.data;

  return get(
    'trackedEntityInstances',
    {
      ou: 'l22DQq4iV3G',
      filter: [`jGNhqEeXy2L:Eq:${encounter.patient.uuid}`],
    },
    {},
    state => {
      // console.log(
      //   JSON.stringify(
      //     state.data.trackedEntityInstances[0].trackedEntityInstance
      //   )
      // );
      state.TEIs[encounter.patient.uuid] =
        state.data.trackedEntityInstances[0].trackedEntityInstance;

      return state;
    }
  )(state);
});

// Create events fore each encounter
each('encounters[*]', async state => {
  const { oclMappings, data, TEIs } = state;

  const encounterDate = data.encounterDatetime.replace('+0000', '');

  const pluckObs = arg => data.obs.filter(ob => ob.concept.uuid === arg)[0];
  const pluckOcl = arg =>
    oclMappings.filter(ocl => ocl.from_concept_name_resolved === arg)[0];

  const obs1 = pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0160');
  const obs2 = pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0177');

  const oclMap1 = obs1 && pluckOcl(obs1.value.display);
  const oclMap2 = obs2 && pluckOcl(obs2.value.display);

  const valueForEncounter1 = oclMap1 ? oclMap1.to_concept_name_resolved : '';
  const valueForEncounter2 = oclMap2 ? oclMap2.to_concept_name_resolved : '';

  return create('events', {
    program: 'uGHvY5HFoLG',
    orgUnit: 'l22DQq4iV3G',
    programStage: 'hfKSeo6nZK0',
    trackedEntityInstance: TEIs[data.patient.uuid],
    eventDate: encounterDate,
    dataValues: [
      {
        dataElement: 'ZTSBtZKc8Ff',
        value: valueForEncounter1,
      },
      {
        dataElement: 'vqGFXhDM1XG',
        value: valueForEncounter2,
      },
    ],
  })(state);
});