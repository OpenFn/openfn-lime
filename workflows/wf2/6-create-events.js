// Prepare DHIS2 data model for create events
fn(state => {
  const { TEIs, mhpssMap } = state;
  const optsMap = JSON.parse(state.optsMap);

  const dataValuesMapping = data => {
    return Object.keys(mhpssMap)
      .map(k => {
        let value;
        const dataElement = k;
        const conceptUuid = mhpssMap[k];
        const answer = data.obs.find(o => o.concept.uuid === conceptUuid);

        if (answer) {
          if (typeof answer.value === 'string') {
            value = answer.value;
          }
          if (typeof answer.value === 'object') {
            if (
              //TODO: Ask mtuchi about this mapping
              answer.value.uuid === '278401ee-3d6f-4c65-9455-f1c16d0a7a98' &&
              conceptUuid === '722dd83a-c1cf-48ad-ac99-45ac131ccc96'
            ) {
              value = 'TRUE';
            } else {
              value = optsMap.find(
                o => o['value.uuid - External ID'] == answer?.value?.uuid
              )?.['DHIS2 Option Code']; //Changed from 'DHIS2 Option UID'
            }
          }
        }
        if (!answer) {
          value = '';
        }
        return { dataElement, value };
      })
      .filter(d => d);
  };

  state.encountersMapping = state.encounters.map(data => {
    const dataValues = dataValuesMapping(data);
    const encounterDate = data.encounterDatetime.replace('+0000', '');

    return {
      program: 'w9MSPn5oSqp',
      orgUnit: 'OPjuJMZFLop',
      programStage: 'MdTtRixaC1B',
      trackedEntityInstance: TEIs[data.patient.uuid],
      eventDate: encounterDate,
      dataValues,
    };
  });

  return state;
});

// Create events fore each encounter
each(
  '$.encountersMapping[*]',
  create(
    'events',
    state => {
      // console.log(state.data);
      return state.data;
    },
    {
      params: {
        dataElementIdScheme: 'UID',
      },
    }
  )
);

// Clean up state
fn(({ data, references, ...state }) => state);
