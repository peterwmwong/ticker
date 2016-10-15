export default (modelOrGetter, type, Component) => {
  const onInit = ({props, bindSend}) => {
    const Model = typeof modelOrGetter === 'function' ? modelOrGetter(props) : modelOrGetter;
    Model[type](props).then(bindSend('onLoadModel'));
    return Model[type === 'get' ? 'localGet' : 'localQuery'](props);
  };
  Component.state = {
    onInit,
    onProps: onInit,
    onLoadModel: (component, model) => model
  }
  return Component;
}
