import xvdom  from 'xvdom/src/index';
import Avatar from './Avatar.jsx';
import Icon   from './Icon.jsx';

function renderItem(el){
  const {item, context, listClass} = this;
  const {href, key, avatarUrl, icon, text, secondaryText} = item(el, context);
  return (
    <a className={listClass} href={href} key={key}>
      {avatarUrl
        ? <Avatar avatarUrl={avatarUrl} />
        : <Icon name={icon} />
      }
      <div className='l-margin-l3'>
        {text}
        <div
          className='t-light t-font-size-14 c-gray-dark'
          textContent={secondaryText}
        />
      </div>
    </a>
  );
}

export default ({className, context, list, item, itemClass, transform})=> {
  const listClass = `List-item layout horizontal center t-normal ${itemClass || ''}`;
  list = list || [];
  if(transform) list = transform(list);
  return (
    <div className={className} hidden={!list.length} >
      {list.map(renderItem, {item, context, listClass})}
    </div>
  )
}
