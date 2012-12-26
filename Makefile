-include local.mk

URLS?=`cat ./src/urls.txt`
PHANTOMJS?=phantomjs

glossary.json:
	$(PHANTOMJS) ./src/get.js $(URLS) > ./glossary.json
