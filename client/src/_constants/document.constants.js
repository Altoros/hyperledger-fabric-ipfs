const stages = ['request', 'success', 'failure'];
const actions = ['get', 'getall', 'add', 'update'];

export const documentConstants = {};
actions.forEach(action => {
  stages.forEach(stage => {
    const key = `${action.toUpperCase()}_${stage.toUpperCase()}`;
    documentConstants[key] = 'DOCUMENT_' + key;
  });
});

export const documentTypes = {'image/jpg': 1, 'image/jpeg': 1, 'audio/mpeg': 2, 'video/mpeg': 3, 'application/pdf': 4};

export const documentTypesToMime = {1: 'image/jpeg', 2: 'audio/mpeg', 3: 'video/mpeg', 4: 'application/pdf'};
