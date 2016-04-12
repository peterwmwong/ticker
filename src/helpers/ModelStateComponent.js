export default (Model, type, Component)=> {
  const onInit = (props, state, {onLoadModel})=> (
    Model[type](props).then(onLoadModel),
    Model[type === 'get' ? 'localGet' : 'localQuery'](props)
  );
  Component.state = {
    onInit,
    onProps: onInit,
    onLoadModel: (props, state, actions, model)=> model
  }
  return Component;
}
