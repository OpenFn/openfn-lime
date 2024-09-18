// Prepare DHIS2 data model for create events
fn(state => {
  const { TEIs, mhpssMap, mhgapMap } = state;
  const optsMap = JSON.parse(state.optsMap);

  function getRangePhq(input) {
    if (input >= 0 && input <= 4) {
      return '0_4';
    } else if (input >= 5 && input <= 9) {
      return '5_9';
    } else if (input >= 10 && input <= 14) {
      return '10_14';
    } else if (input >= 15 && input <= 19) {
      return '15_19';
    } else if (input >= 20) {
      return '>20';
    } else {
      return '';
    }
  }

  const dataValuesMapping = (data, formsMap) => {
    return Object.keys(formsMap)
      .map(k => {
        let value;
        const dataElement = k;
        const conceptUuid = mhpssMap[k];
        const answer = data.obs.find(o => o.concept.uuid === conceptUuid);

        if (answer) {
          if (typeof answer.value === 'object') {
            value = optsMap.find(
              o => o['value.uuid - External ID'] == answer?.value?.uuid
            )?.['DHIS2 Option Code']; //Changed from 'DHIS2 Option UID'
            if (
              //mapping: diagnosis done by psychologist

              conceptUuid === '722dd83a-c1cf-48ad-ac99-45ac131ccc96' &&
              dataElement === 'pN4iQH4AEzk'
            ) {
              if (
                answer.value.uuid === '278401ee-3d6f-4c65-9455-f1c16d0a7a98'
              ) {
                value = 'TRUE';
              } else {
                value = 'FALSE';
              }
            } else {
              value = optsMap.find(
                o => o['value.uuid - External ID'] == answer?.value?.uuid
              )?.['DHIS2 Option Code']; //Changed from 'DHIS2 Option UID'
              console.log(answer.value.uuid, {
                dataElement,
                value,
                conceptUuid,
              });
            }
          } else if (
            typeof answer.value === 'number' &&
            conceptUuid === '5f3d618e-5c89-43bd-8c79-07e4e98c2f23' &&
            dataElement === 'tsFOVnlc6lz' //mapping: phq9 score
          ) {
            value = getRangePhq(answer.value);
          } else if (!answer) {
            value = '';
          } else {
            value = answer.value;
          }
        }
        return { dataElement, value };
      })
      .filter(d => d);
  };

  state.encountersMapping = state.encounters.map(data => {
    const eventDate = data.encounterDatetime.replace('+0000', '');
    const { trackedEntityInstance, enrollment } = TEIs[data.patient.uuid];

    const event = {
      program: 'w9MSPn5oSqp',
      orgUnit: 'OPjuJMZFLop',
      trackedEntityInstance,
      enrollment,
      eventDate,
    };
    if (data.form.uuid === '6a3e1e0e-dd13-3465-b8f5-ee2d42691fe5') {
      return {
        ...event,
        programStage: 'MdTtRixaC1B',
        dataValues: dataValuesMapping(data, mhpssMap),
      };
    }
    if (data.form.uuid === '82db23a1-4eb1-3f3c-bb65-b7ebfe95b19b') {
      return {
        ...event,
        programStage: 'EZJ9FsNau7Q', //mhgap baseline*
        dataValues: dataValuesMapping(data, mhgapMap),
      };
    }
  });

  console.log(
    'dhis2 events to import:: ',
    JSON.stringify(state.encountersMapping, null, 2)
  );

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
// fn(({ data, references, ...state }) => state);
