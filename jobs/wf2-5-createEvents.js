each('encounters[*]', state => {
  const { oclMappings, data } = state;

  const pluckObs = arg => data.obs.filter(ob => ob.concept.uuid === arg)[0];
  const pluckOcl = arg =>
    oclMappings.filter(ocl => ocl.from_concept_name_resolved === arg);

    
  if (pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0160')) {
    const encounter = oclMappings.filter(
      ocl =>
        ocl.from_concept_name_resolved ===
        pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0160').concept.display
    );

    console.log(
      pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0160').concept.display
    );

    // console.log(encounter);
  }

  return state;

  //   return create('events', {
  //     program: 'uGHvY5HFoLG',
  //     orgUnit: 'l22DQq4iV3G',
  //     programStage: 'hfKSeo6nZK0',
  //     trackedEntityInstance: encounter.patient.uuid,
  //     eventDate: '2023-05-30T00:00:00.000',
  //     dataValues: [
  //       {
  //         dataElement: 'ZTSBtZKc8Ff',
  //         value: 'Acute asthma',
  //       },
  //       {
  //         dataElement: 'vqGFXhDM1XG',
  //         value: 'Yellow',
  //       },
  //     ],
  //   })(state);
});
