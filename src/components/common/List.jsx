import xvdom  from 'xvdom/src/index';

const identity = o => o;

function renderItem(el){
  const { item, context, itemClass } = this;
  const { href, key, text } = item(el, context);
  return (
    <a className={`List-item layout horizontal center t-normal ${itemClass || ''}`} href={href} key={key}>
      {text}
    </a>
  );
}

export default props => {
  const { className, list, transform = identity } = props;
  const items = list ? transform(list) : [];
  return (
    <div className={className} hidden={!items.length}>
      {items.map(renderItem, props)}
    </div>
  )
}
