fn(state => {
  const mappings = state.data(d => {
    return {
      identifiers: [
        {
          identifierType: '',
          preferred: '',
          identifier: '',
        },
      ],
      person: {
        gender: 'M',
        age: 42,
        birthdate: '1970-01-01T00:00:00.000+0100',
        birthdateEstimated: false,
        dead: false,
        deathDate: null,
        causeOfDeath: null,
        names: [
          {
            givenName: 'Doe',
            familyName: 'John',
          },
        ],
        addresses: [
          {
            address1: '30, Vivekananda Layout, Munnekolal,Marathahalli',
            cityVillage: 'Bengaluru',
            country: 'India',
            postalCode: '560037',
          },
        ],
      },
    };
  });

  return { ...state, mappings };
});
