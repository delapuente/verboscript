(function () {

  var verboscript = this.verboscript;

  var sources = Array.prototype.slice.call(
    document.querySelectorAll('article > pre:first-child')
  );

  sources.forEach(function (source) {
    var result = verboscript.parse(source.textContent);
    var output = source.nextElementSibling;
    output.textContent = result.output;

    source.addEventListener('input', function () {
      clearTimeout(source.timeoutToSave);
      source.timeoutToSave = setTimeout(function _translate() {
        output.textContent = verboscript.parse(source.textContent).output;
      }, 400);
    });
  });

}.call(this));
