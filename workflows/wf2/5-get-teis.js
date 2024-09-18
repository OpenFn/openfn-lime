const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

each(
  '$.encounters[*]',
  get(
    'trackedEntityInstances',
    {
      ou: 'OPjuJMZFLop',
      program: 'w9MSPn5oSqp',
      filter: [`AYbfTPYMNJH:Eq:${$.data.patient.uuid}`],
      fields: '*',
    },
    {},
    async state => {
      const encounter = state.references.at(-1);
      console.log(encounter.patient.uuid, 'Encounter patient uuid');
      state.TEIs ??= {};

      const { trackedEntityInstance, enrollments } =
        state.data.trackedEntityInstances[0]; // Can one encounter have more that one TEI?

      state.TEIs[encounter.patient.uuid] = {
        trackedEntityInstance,
        enrollment: enrollments[0]?.enrollment,
      };

      await delay(2000);
      return state;
    }
  )
);
