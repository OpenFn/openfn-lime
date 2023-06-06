// Fetch OCL mappings
get(
  'mappings',
  {
    owner: 'MSFOCG',
    repository: 'collections',
    repositoryId: 'lime-demo',
    version: 'HEAD',
    query: {
      page: 1,
      exact_match: 'off',
      limit: 200,
      verbose: false,
      sortDesc: '_score',
    },
  },
  state => {
    // Add state oclMappings
    const oclMappings = state.data;
    return { ...state, data: {}, references: [], response: {}, oclMappings };
  }
);

// get(
//   'MSFOCG/collections/lime-demo/HEAD/mappings',
//   {
//     // owner_type: "users",
//     page: 1,
//     exact_match: 'off',
//     limit: 200,
//     verbose: false,
//     sortDesc: '_score',
//   },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );

// getMappings(
//   'MSFOCG',
//   'lime-demo',
//   { page: 1, exact_match: 'off', verbose: false },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );
