export default (modelOrGetter, type, Component) => {
  const onInit = ({props, bindSend}) => {
    const Model = typeof modelOrGetter === 'function' ? modelOrGetter(props) : modelOrGetter;
    Model[type](props).then(bindSend('onLoadModel'));
    return Model[type === 'get' ? 'localGet' : 'localQuery'](props);
    // TODO: Figure out a way to avoid always loading and just use the cache if it's available.
    // const localResult = Model[type === 'get' ? 'localGet' : 'localQuery'](props);
    // if(!localResult) Model[type](props).then(bindSend('onLoadModel'));
    // return localResult;
  };
  Component.state = {
    onInit,
    onProps: onInit,
    onLoadModel: (component, model) => model
  }
  return Component;
}
