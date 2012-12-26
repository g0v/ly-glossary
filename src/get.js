'use strict';

(function() {
  var urls = [].concat(require('system').args);
  urls.shift();
  var allTerms = {};

  var i = urls.length - 1;

  function parseURL(url) {
    var page = require('webpage').create();
    page.settings.loadImages = false;
    page.open(url, function pageOpened(status) {
      if (status !== 'success') {
        console.error('Unable to access network: ' + status);
        phantom.exit(1);
        return;
      }

      var terms = page.evaluate(function getTerms() {
        var terms = {};
        var table = document.getElementsByClassName('news_search')[0];
        var tds = table.getElementsByTagName('td');

        var t = tds.length;
        while (t--) {
          var zhTerm = tds[t].textContent;
          t--;
          var enTerm = tds[t].textContent;
          terms[enTerm.trim()] = zhTerm.trim();
        }

        return terms;
      });

      page.close();

      for (var k in terms) {
        allTerms[k] = terms[k];
      }

      if (i--) {
        parseURL(urls[i]);
        return;
      }

      console.log(JSON.stringify(allTerms));
      phantom.exit(0);
      return;
    });
  };

  parseURL(urls[i]);
})();
