/*

Builds an iconset to be used with <iron-iconset-svg>.

SVG files from `src` are piped through svg-sprite to...

1. Size/Position normalization
2. Combine all svg definitions

*/
import svgSprite from 'gulp-svg-sprites';

const outputTemplate =
`<link rel="import" href="../../components/iron-iconset-svg/iron-iconset-svg.html">
<iron-iconset-svg name="github" size="1024"><svg><defs>

{#svg}<g id="{name}" transform="{correctiveTransform}">{raw|s}</g>
{/svg}
</defs></svg></iron-iconset-svg>`;

export default src=>
  src.pipe(svgSprite({
    transformData:data=>{
      data.svg.forEach(svg=>{
        // Center the icons
        if(svg.viewBox){
          const viewBox = svg.viewBox.split(' ');
          const width = +viewBox[2];
          const translateX = (1024 - width) / 2;
          svg.correctiveTransform = `translate(${translateX},0)`;
        }
      });
      return data;
    },
    mode: 'defs',
    svg: {
      defs: 'github.html'
    },
    preview: false,
    templates: {
      defs: outputTemplate
    }
  }));
