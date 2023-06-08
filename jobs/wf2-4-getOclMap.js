/*
 * This get() implementation is backward compatible with the http adaptor
 **/

// Fetch OCL mappings
get(
  'orgs/MSFOCG/collections/lime-demo/HEAD/expansions/autoexpand-HEAD/mappings/',
  {
    page: 1,
    exact_match: 'off',
    limit: 200,
    verbose: false,
    sortDesc: '_score',
    fromConceptOwner: 'MSFOCG',
    toConceptOwner: 'MSFOCG',
    toConceptSource:'MSFOCG'
    
  },
  state => {
    // Add state oclMappings
    const oclMappings = state.data;
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
//   { page: 1, exact_match: 'off', verbose: false },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );
