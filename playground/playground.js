(function () {

  var verboscript = this.verboscript;

  var sources = Array.prototype.slice.call(
    document.querySelectorAll('textarea')
  );

  sources.forEach(function (source) {
    source.classList.add('source');
    var output = document.createElement('pre');
    var result = document.createElement('pre');

    output.classList.add('output');
    result.classList.add('result');
    source.parentNode.insertBefore(output, source.nextSibling);
    source.parentNode.insertBefore(result, source.nextSibling);

    source.addEventListener('input',
      updateContent.bind(undefined, source, result, output));

    updateContent(source, result, output);

    function updateContent(source, result, output) {
      clearTimeout(source.timeoutToSave);
      source.style.height = 0 + 'px';
      source.style.height = source.scrollHeight + 'px';
      source.timeoutToSave = setTimeout(function _translate() {
        try {
          var parsed = verboscript.parse(source.textContent);
          output.textContent = parsed.output.trim();
          with (document) {
            result.textContent = eval(parsed.output);
          }
        } catch (e) {
          if (e instanceof verboscript.SyntaxError) {
            result.textContent = 'Error in line ' + e.line + ':' + e.column +
                                 ' ' + e.message;
          }
        }
      }, 400);
    }
  });

}.call(this));
