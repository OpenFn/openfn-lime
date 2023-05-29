// TODO: Confirm how these options are coded in openMRS
fn(state => {
  const genderOptions = {
    male: 'eQkRH9GTjBN',
    female: 'H61UkMHyNku',
    unknown: 'YJw3CPNftrE',
    'Transgender female': 'l8RshnosXNy',
    'Transgender male': 'OcJsz1BOHTf',
    'Prefer not to answer': 'QQzTV76xGfF',
    'Gender variant - Non conforming': 'V8RXdmOdY8L',
  };
  return { ...state, genderOptions };
});

fn(state => {
  const genders = { male: 'M', female: 'F' };
  const { trackedEntityInstances } = state.data;

  const pluckAttributeValue = (arr, keyVal) => {
    const result = arr.filter(a => a.code === keyVal);
    return result.length > 0 ? result[0].value : undefined;
  };

  const calculateDOB = age => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthYear = currentYear - age;

    const birthday = `${birthYear}-${currentDate.getMonth()}-${currentDate.getDate()}`;

    return birthday;
  };
  const patients = trackedEntityInstances.map(d => {
    return {
      identifiers: [
        {
          identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334',
          preferred: true,
          identifier: pluckAttributeValue(d.attributes, 'patient_number').match(
            /\b\d+\b/g
          )[0],
        },
      ],
      person: {
        gender: genders[pluckAttributeValue(d.attributes, 'sex')],
        age: pluckAttributeValue(d.attributes, 'age'),
        birthdate: calculateDOB(pluckAttributeValue(d.attributes, 'age')),
        birthdateEstimated: true,
        names: [
          {
            givenName: 'Doe',
            familyName: 'John',
          },
        ],
      },
    };
  });

  return { ...state, patients };
});

each(
  'patients[*]',
  createPatient(state => state.data)
);
