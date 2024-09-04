fn(state => {
  const TEIs = {};
  return { ...state, TEIs };
});

fn(async state => {
  const { encounters } = state;

  const getTEI = async encounter => {
    await new Promise(resolve => setTimeout(resolve, 2000), 'OCL Mappings');
    await get(
      'trackedEntityInstances',
      {
        ou: 'OPjuJMZFLop',
        filter: [`AYbfTPYMNJH:Eq:${encounter.patient.uuid}`],
      },
      {},
      state => {
        console.log(encounter.patient.uuid, 'Encounter patient uuid');
        state.TEIs[encounter.patient.uuid] =
          state.data.trackedEntityInstances[0].trackedEntityInstance;

        return state;
      }
    )(state);
  };

  for (const encounter of encounters) {
    await getTEI(encounter);
  }
  return state;
});

// Prepare DHIS2 data model for create events
fn(state => {
  const { oclMappings, TEIs } = state;

  //console.log(JSON.stringify(oclMappings, null, 2));

  const encountersMapping = state.encounters.map(data => {
    const encounterDate = data.encounterDatetime.replace('+0000', '');

    const pluckObs = arg => data.obs.find(ob => ob.concept.uuid === arg);
    //console.log('Observation ::', pluckObs);
    // const pluckOcl = arg =>
    //   oclMappings.find(ocl => ocl.from_concept_name_resolved === arg); //TODO: map using concept uid, not name
    const pluckOcl = arg =>
      oclMappings.find(ocl => ocl.from_concept_code === arg);
    //console.log('OCL code match ::', pluckOcl);

    const obs1 = pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0160');
    const obs2 = pluckObs('da33d74e-33b3-495a-9d7c-aa00a-aa0177');

    // const oclMap1 = obs1 && pluckOcl(obs1.value.display);
    // const oclMap2 = obs2 && pluckOcl(obs2.value.display);
    const cleanedObs1 = obs1.value.uuid.split('-').pop().toUpperCase();
    const cleanedObs2 = obs2.value.uuid.split('-').pop().toUpperCase();
    console.log('cleanedObs1 ', cleanedObs1);
    console.log('cleanedObs2 ', cleanedObs2);

    const oclMap1 = obs1 && pluckOcl(cleanedObs1);
    const oclMap2 = obs2 && pluckOcl(cleanedObs2);
    console.log('oclMapping for Obs1 ', JSON.stringify(oclMap1, null, 2));
    console.log('oclMapping for Obs2 ', JSON.stringify(oclMap2, null, 2));

    // const valueForEncounter1 = oclMap1 ? oclMap1.to_concept_name_resolved : '';
    // const valueForEncounter2 = oclMap2 ? oclMap2.to_concept_name_resolved : '';
    const valueForEncounter1 = oclMap1
      ? oclMap1.to_concept.extras.dhis2_option_code
      : '';
    const valueForEncounter2 = oclMap2
      ? oclMap2.to_concept.extras.dhis2_option_code
      : '';
    console.log('valueForEncounter1', valueForEncounter1);
    console.log('valueForEncounter2', valueForEncounter2);

    return {
      program: 'w9MSPn5oSqp',
      orgUnit: 'OPjuJMZFLop',
      programStage: 'EZJ9FsNau7Q',
      trackedEntityInstance: TEIs[data.patient.uuid],
      eventDate: encounterDate,
      //=== TODO: REPLACE & ADD NEW DATAVALUES TO MAP ====================//
      dataValues: [ 
        {
          dataElement: 'ZTSBtZKc8Ff', //diagnosis
          value: valueForEncounter1,
        },
        {
          dataElement: 'vqGFXhDM1XG', //entry triage color
          value: valueForEncounter2,
        },
      ],
      //==================================================================//
    };
  });
  return { ...state, encountersMapping };
});

// Create events fore each encounter
each(
  'encountersMapping[*]',
  create('events', state => state.data) //TODO: Add query parameter '/events?dataElementIdScheme=UID'
);

// Clean up state
fn(state => ({ ...state, data: {}, references: [] }));
