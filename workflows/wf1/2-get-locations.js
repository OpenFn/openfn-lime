get('optionGroups/kdef7pUey9f', {
  fields: 'id,displayName,options[id,displayName,code]',
});

fn(({ data, ...state }) => {
  state.locations = data;
  return state;
});
