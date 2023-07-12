get(
  'https://api.openconceptlab.org/orgs/MSFOCG/collections/lime-demo/HEAD/expansions/autoexpand-HEAD/mappings',
  {
    query: {
      page: 1,
      limit: 1000,
      fromConceptOwner: 'MSFOCG',
      toConceptOwner: 'MSFOCG',
      toConceptSource: 'DHIS2DataElements',
      sortDesc: '_score',
      lookupToConcept: true,
      verbose: true,
    },
    headers: { 'content-type': 'application/json' },
    //authentication: {username: 'user', password: 'pass'}
  },
  state => {
    // Add state oclMappings
    const oclMappings = state.data;
    console.log(JSON.stringify(oclMappings, null, 2), 'OCL Mappings');
    return { ...state, data: {}, references: [], response: {}, oclMappings };
  }
);
/*
 * The following implimentation of the get(),
 * works only with the OCL adaptor
 **/
// get(
//   'mappings',
//   {
//     ownerId: 'MSFOCG',
//     repository: 'collections',
//     repositoryId: 'lime-demo',
//     version: 'HEAD',
//     page: 1,
//     exact_match: 'off',
//     limit: 200,
//     verbose: false,
//     sortDesc: '_score',
//     lookupToConcept: true,
//     verbose: true,
//   },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, refÏerences: [], response: {}, oclMappings };
//   }
// );

// getMappings(
//   'MSFOCG',
//   'lime-demo',
//   { page: 1, exact_match: 'off', verbose: true, lookupToConcept: true },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );
