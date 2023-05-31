each('encounters[*]', async state => {
  const { oclMappings, data } = state;

  const encounterDate = data.encounterDatetime.replace('+0000', '');

  const pluckObs = arg => data.obs.filter(ob => ob.concept.uuid === arg)[0];
  const pluckOcl = arg =>
    oclMappings.filter(ocl => ocl.from_concept_name_resolved === arg)[0];

  const obs1 = pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0160');
  const obs2 = pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0177');

  const oclMap1 = obs1 && pluckOcl(obs1.concept.display);
  const oclMap2 = obs2 && pluckOcl(obs2.concept.display);

  const valueForEncounter1 = oclMap1 && oclMap1.to_concept_name_resolved;
  const valueForEncounter2 = oclMap2 && oclMap2.to_concept_name_resolved;

  if (typeof valueForEncounter1 === 'undefined')
    console.error(`Could not find the value for 'ZTSBtZKc8Ff'`);

  if (typeof valueForEncounter2 === 'undefined')
    console.error(`Could not find the value for 'vqGFXhDM1XG'`);

  (await (valueForEncounter1 && valueForEncounter2)) &&
    create('events', {
      program: 'uGHvY5HFoLG',
      orgUnit: 'l22DQq4iV3G',
      programStage: 'hfKSeo6nZK0',
      trackedEntityInstance: data.patient.uuid,
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

  return state;
});
