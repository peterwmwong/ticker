const FNAME_TO_SYNTAX = {
  'Gemfile.lock': 'ruby',
  'Gemfile'     : 'ruby',
  'Rakefile'    : 'ruby'
}

const EXT_TO_SYNTAX = {
  babelrc : 'json',
  eslintrc: 'json',
  gemspec : 'ruby',
  html    : 'xml',
  js      : 'javascript',
  jsx     : 'javascript',
  md      : 'markdown',
  rb      : 'ruby',
  ts      : 'typescript',
  yml     : 'yaml'
}

export default (fname)=> {
  const ext = (/\.([^.]*)$/.exec(fname) || [])[1];
  return ext
    ? (EXT_TO_SYNTAX[ext] || ext)
    : FNAME_TO_SYNTAX[fname];
};
