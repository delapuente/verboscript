(function () {

  var verboscript = this.verboscript;

  var sources = Array.prototype.slice.call(
    document.querySelectorAll('pre')
  );

  sources.forEach(function (source) {
    source.classList.add('source');
    source.setAttribute('contenteditable', 'true');
    var output = document.createElement('pre');
    var target = document.createElement('pre');

    output.classList.add('output');
    target.classList.add('result');
    source.parentNode.insertBefore(output, source.nextSibling);
    source.parentNode.insertBefore(target, source.nextSibling);

    source.addEventListener('input',
      updateContent.bind(undefined, source, target, output));

    updateContent(source, target, output);

    function updateContent(source, target, output) {
      clearTimeout(source.timeoutToSave);
      source.timeoutToSave = setTimeout(function _translate() {
        try {
          var result = verboscript.parse(source.textContent);
          output.textContent = result.output.trim();
          with (document) {
            target.textContent = eval(result.output);
          }
        } catch (e) {
          if (e instanceof verboscript.SyntaxError) {
            target.textContent = 'Error in line ' + e.line + ':' + e.column +
                                 ' ' + e.message;
          }
        }
      }, 400);
    }
  });

}.call(this));
