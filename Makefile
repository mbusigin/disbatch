PROJECT=disbatch
VERSION=3.0

all:	
	@echo "Nothing to make"

clean:	
	find . -name '*~' -exec rm '{}' \;
	find . -name 'DEADJOE' -exec rm '{}' \;
	rm -f disbatchd.log $(PROJECT)-$(VERSION).tar.gz

dist:	clean
	tar --transform="s%^%$(PROJECT)-$(VERSION)/%" -zcvf $(PROJECT)-$(VERSION).tar.gz Synacor/ disbatch.ini-example disbatch.init \
		docs/ htdocs/ disbatch-log4perl.conf disbatch.pl Pinscher/ disbatch.d/ disbatchd.pl frontend/

rpm:	dist
	cp -f $(PROJECT)-$(VERSION).tar.gz disbatch-filter-requires.sh $(HOME)/rpmbuild/SOURCES/
	rpmbuild -bb $(PROJECT).spec
