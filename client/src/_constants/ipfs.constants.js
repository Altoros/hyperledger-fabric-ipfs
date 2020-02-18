const stages = ['request', 'success', 'failure'];
const actions = ['add', 'get'];

export const ipfsConstants = {};
actions.forEach(action => {
  stages.forEach(stage => {
    const key = `${action.toUpperCase()}_${stage.toUpperCase()}`;
    ipfsConstants[key] = 'IPFS_' + key;
  });
});
