import xvdom  from 'xvdom';
import Avatar from './Avatar.jsx';
import Icon   from './Icon.jsx';

export default ({className, context, list, meta, noDivider, transform})=> {
  const listClass = `List-item layout horizontal center t-normal ${noDivider ? 'List-item--noDivider' : ''}`;
  list = list || [];
  if(transform) list = transform(list);
  return (
    <div className={className} hidden={!list || !list.length} >
      {list.map((el)=> {
        const {href, key, avatarUrl, icon, text, secondaryText} = meta(el, context);
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
      })}
    </div>
  )
}
