/*

Builds an iconset to be used with <iron-iconset-svg>.

SVG files from `src` are piped through svg-sprite to...

1. Size/Position normalization
2. Combine all svg definitions

*/
import svgSprite from 'gulp-svg-sprite';

function findPath(svg){
  let child = svg.firstChild;
  while(child){
    if(child.nodeName === 'path'){
      return child;
    }
    child = child.nextSibling;
  }
}

export default src=>
  src.pipe(svgSprite({
    transform:[{
      custom:(shape, sprite, callback)=>{
        const pathString = findPath(shape.dom.firstChild).toString();
        const width = shape.width;
        const translateX = (1024 - width) / 2;
        shape.setSVG(`
  <svg>
  <g id="${shape.id}" transform="translate(${translateX}, 0)">
    ${pathString}
  </g>
  </svg>`);
        callback(null);
      }
    }],
    mode: {
      'defs':{
        example:{
          template: 'build_tasks/github-iconset-tmpl.html',
          dest: 'github'
        }
      }
    }
  }));
