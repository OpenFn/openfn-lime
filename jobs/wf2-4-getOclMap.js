// Fetch OCL mappings
get(
  'mappings',
  {
    query: {
      page: 1,
      exact_match: 'off',
      limit: 200,
      verbose: false,
      fromConceptOwner: 'MSFOCG',
      toConceptOwner: 'MSFOCG',
      toConceptSource: 'DHIS2DataElements',
      sortDesc: '_score',
    },
  },
  state => {
    // Add state oclMappings
    const oclMappings = state.data;
    return { ...state, data: {}, references: [], response: {}, oclMappings };
  }
);
