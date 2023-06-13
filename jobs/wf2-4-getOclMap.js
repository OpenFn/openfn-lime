/* Fetch OCL mappings
 * This get() implementation is backward compatible with the http adaptor
 **/

get(
  'orgs/MSFOCG/collections/lime-demo/HEAD/expansions/autoexpand-HEAD/mappings/',
  {
    query: {
      page: 1,
      exact_match: 'off',
      limit: 200,
      verbose: false,
      sortDesc: '_score',
      fromConceptOwner: 'MSFOCG',
      toConceptOwner: 'MSFOCG',
      toConceptSource: 'DHIS2DataElements',
    },
  },
  state => {
    // Add state oclMappings
    const oclMappings = state.data;
    console.log(JSON.stringify(oclMappings, null, 2), 'OCL Mappings');
    return { ...state, data: {}, references: [], response: {}, oclMappings };
  }
);

/*
 * The following implementation of the get(),
 * works only with the OCL adaptor
 **/

// get(
//   'orgs/MSFOCG/collections/lime-demo/HEAD/expansions/autoexpand-HEAD/mappings/',
//   {
//     page: 1,
//     exact_match: 'off',
//     limit: 200,
//     verbose: false,
//     sortDesc: '_score',
//     fromConceptOwner: 'MSFOCG',
//     toConceptOwner: 'MSFOCG',
//     toConceptSource: 'DHIS2DataElements',
//   },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );

// Using getMappings function
// getMappings(
//   'MSFOCG',
//   'lime-demo',
//   {
//     page: 1,
//     limit: 1000,
//     verbose: false,
//     fromConceptOwner: 'MSFOCG',
//     toConceptOwner: 'MSFOCG',
//     toConceptSource: 'DHIS2DataElements',
//     sortDesc: '_score',
//   },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );
