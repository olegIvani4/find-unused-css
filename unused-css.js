$.get('/parh/to/css/file.css').done(function(css){
  css = css.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');
  
  window.unused = [];
  window.used = [];
  window.changed = false;

  var selectors = 
    _.map(css.split('}'), function(css) {
      css = css.trim();

      var parsed = css.split('{');
      if (parsed[parsed.length - 2] === undefined)
        return null;

      css = parsed[parsed.length - 2].trim();

      if (css.substr(0,1) === '@')
        return null;
      return css;
    });

  for (var i in selectors) {
    if (typeof selectors[i] === 'string' && selectors[i] !== '') {
      // skip pseudo classes
      if (selectors[i].indexOf(':') !== -1 || selectors[i].substr(selectors[i].length - 1) === '%') {
        continue;
      }
      unused.push(selectors[i]);
    }
  }
  
  function checkCssUssage(){
    var selector = '';
    console.log('searching');
    for (var i in window.unused) {
      selector = window.unused[i];
      if (typeof selector === 'string' && selector !== '') {
        if ($(selector).length)  {
          window.used.push(selector);
          window.unused.splice(i, 1);
        }
      }
    };
    return true;
  }
  
  checkCssUssage();
  
  $("body")
   .unbind('DOMSubtreeModified')
   .bind("DOMSubtreeModified", function() {
     window.changed = true;
    window.setTimeout(function(){
      if (window.changed) {
        window.changed = false;
        checkCssUssage();
      }
    }, 2000);
  });
  
});
