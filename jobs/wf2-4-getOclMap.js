/*
 * This get() implementation is backward compatible with the http adaptor
 **/

// Fetch OCL mappings
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
//     toConceptSource:'DHIS2DataElements'
    
//   },
//   state => {
//     // Add state oclMappings
//     const oclMappings = state.data;
//     return { ...state, data: {}, references: [], response: {}, oclMappings };
//   }
// );

// get(
//   'https://api.openconceptlab.org/orgs/MSFOCG/collections/lime-demo/HEAD/expansions/autoexpand-HEAD/mappings/?page=1&exact_match=off&limit=200&verbose=false&fromConceptOwner=MSFOCG&toConceptOwner=MSFOCG&toConceptSource=DHIS2DataElements&sortDesc=_score',
//   {
//     //query: {foo: 'bar', a: 1},
//     headers: { 'content-type': 'application/json' },
//     //authentication: {username: 'user', password: 'pass'}
//   }
// );

get('https://api.openconceptlab.org/orgs/MSFOCG/collections/lime-demo/HEAD/expansions/autoexpand-HEAD/mappings', {
   query: { 
     verbose: false, 
     fromConceptOwner: 'MSFOCG', 
     toConceptOwner: 'MSFOCG',
     toConceptSource: 'DHIS2DataElements',
     sortDesc: '_score'
   },
   headers: {'content-type': 'application/json'},
   //authentication: {username: 'user', password: 'pass'}
 },
 state => {
    // Add state oclMappings
    const oclMappings = state.data;
    console.log(JSON.stringify(oclMappings, null, 2), "OCL Mappings")
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
