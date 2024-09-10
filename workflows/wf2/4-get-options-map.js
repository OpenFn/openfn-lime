get(
  'https://gist.githubusercontent.com/aleksa-krolls/b22987f7569bc069e963973401832349/raw/94ae98714c85a6e871fd2fb292c9bff5e324d3a1/msf_mhBaseline_optionsMap.json'
);

fn(state => {
  state.optsMap = state.data;
  // console.log(JSON.stringify(state.optsMap, null, 2), 'Options Map');
  delete state.data;
  delete state.references;
  delete state.response;
  return state;
});

fn(state => {
  state.mhpssMap = {
    dfdv3SkeXKe: 'a6c5188c-29f0-4d3d-8cf5-7852998df86f', //Has the patient attempted suicide or tried to kill themselves?
    hWMBCCA2yy1: 'abede172-ba87-4ebe-8054-3afadb181ea3', //Is the patient currently at risk of hurting himself/herself or attempting suicide?
    TWuCY5r2wx7: 'ccc4f06c-b76a-440d-9b7e-c48ba2c4a0ab', //Is the patient currently at risk of hurting others?
    QHrIUMhjZlO: 'd516de07-979b-411c-b7e4-bd09cf7d9d91', //Does the patient regularly use alcohol / substances to become intoxicated?
    H1fMCaOzr8F: '3e97c2d0-15c1-4cfd-884f-7a4721079217', //Has the patient experienced an act of aggression or violence?
    yCwuZ0htrlH: '5f6e245c-83fc-421b-8d46-061ac773ae71', //Follow up session required?
    RiiH9A53rvG: '6d3876be-0a27-466d-ad58-92edcc8c31fb', //Referral done
    OZViJk8FPVd: 'c2664992-8a5a-4a6d-9238-5df591307d55', //Has the patient had thoughts of death or suicide?
    qgfKPlIHjcD: 'd8c84af2-bd9b-4bf3-a815-81652cb0b0bc', //Patient experienced an act of aggression or violence - What type(s) of violence?
    rSIazMFEBjD: '4dae5b12-070f-4153-b1ca-fbec906106e1', //Admission type
    KSBMR1BDGwx: '1a8bf24f-4f36-4971-aad9-ae77f3525738', //Type of consultation
    WDY6MkQWyHb: '722dd83a-c1cf-48ad-ac99-45ac131ccc96', //Consultation done by
    AuDPJg6gZE7: '82978311-bef9-46f9-9a9a-cc62254b00a6', //Location of intervention
    KeyiEPc4pII: '82978311-bef9-46f9-9a9a-cc62254b00a6', //Type of intervention
    qfYPXP76j8g: 'c3c86c1b-07be-4506-ab25-8f35f4389b19', //Patient referred by
    PCGI7EnvCQS: '45b39cbf-0fb2-4682-8544-8aaf3e07a744', //Current symptoms or complaints 1
    RnbiVrrSFdm: 'ee1b7973-e931-494e-a9cb-22b814b4d8ed', //Current symptoms or complaints 2
    CUdI1BJ5W8G: '92a92f62-3ff6-4944-9ea9-a7af23949bad', //Current symptoms or complaints 3
    YfcNA5bvkxT: '9a8204ca-d908-4157-9285-7c970dbb5287', //Main category of symptoms
    vC3bg9NwJ78: '3edcfddb-7988-4ce5-97a0-d4c46b267a04', //Duration of the main symptom
    RqsvaPH9vHt: '22809b19-54ca-4d88-8d26-9577637c184e', //Clinical diagnosis
    qacGXlyyQOS: 'a1a75011-0fef-460a-b666-dda2d171f39b', //CGI-S score
    S22iy8o0iLg: 'aae000c3-5242-4e3c-bd1f-7e922a6d3d34', //Patient experienced an act of aggression or violence - Time between violence event and consultation
    v0qFX0qv1tX: 'd5e3d927-f7ce-4fdd-ac4e-6ad0b510b608', //Main past or precipitating events - 1
    SsQqwDBGxjh: '54a9b20e-bce5-4d4a-8c9c-e0248a182586', //Main past or precipitating events - 2
    FLIlRjAwn4G: 'e0d4e006-85b5-41cb-8a21-e013b1978b8b', //Main past or precipitating events - 3
    JUabDHhT1wJ: 'c1a3ed2d-6d9a-453d-9d93-749164a76413', //Main category of precipitating event
    DlqJSA5VApl: '8fb3bb7d-c935-4b57-8444-1b953470e109', //Type of referral
    DMaLm9u4GCq: 'b87a93ff-a4a1-4601-b35d-1e42bfa7e194', //Total number of beneficiaries in family consultation
    CLGnlnFqqnk: '0a0c70d2-2ba5-4cb3-941f-b4a9a4a7ec6d', //Location of intervention - If Health Facility, specify
    f64XCwzJW02: '41e68dee-a2a3-4e6c-9d96-53def5caff52', //Location of intervention - If MSF Health Facility, specify
    YeaUNruqmca: '08cd4b4a-4b0b-4391-987b-b5b3d770d30f', //Location of intervention - If Mobile Clinic, specify
    KjgDauY9v4J: 'e08d532b-e56c-43dc-b831-af705654d2dc', //Location of intervention - If other, specify
    pj5hIE6iyAR: 'e08d532b-e56c-43dc-b831-af705654d2dc', //Current symptoms or complaints - If other, specify
    pj5hIE6iyAR: 'e08d532b-e56c-43dc-b831-af705654d2dc', //Current symptoms or complaints - If other, specify
    W7cPAi8iXLZ: '819f79e7-b9af-4afd-85d4-2ab677223113', //Clinical diagnosis - If other, specify
    MF3RML0HLbP: 'b2c5b6e0-66f0-4b9d-8576-b6f48e0a06df', //MHOS score
    m8qis4iUOTo: '790b41ce-e1e7-11e8-b02f-0242ac130002', //Past / Precipitating Events - If other, specify
    //pN4iQH4AEzk: '722dd83a-c1cf-48ad-ac99-45ac131ccc96', //Consultation done by //TODO: Return BOOLEAN
    //qptKDiv9uPl: 'ec42d68d-3e23-43de-b8c5-a03bb538e7c7', //Sex //TODO: Remove TEA?
    //tsFOVnlc6lz: '5f3d618e-5c89-43bd-8c79-07e4e98c2f23', //PHQ9 Score //TODO: ass logic
  };

  return state;
});
