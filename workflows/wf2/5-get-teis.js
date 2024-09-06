const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

each(
  'encounters[*]',
  get(
    'trackedEntityInstances',
    {
      ou: 'OPjuJMZFLop',
      program: 'w9MSPn5oSqp',
      filter: [`AYbfTPYMNJH:Eq:${$.data.patient.uuid}`],
    },
    {},
    async state => {
      const encounter = state.references.at(-1);
      console.log(encounter.patient.uuid, 'Encounter patient uuid');
      state.TEIs ??= {};
      state.TEIs[encounter.patient.uuid] =
        state.data.trackedEntityInstances[0].trackedEntityInstance;

      await delay(2000);
      return state;
    }
  )
);
