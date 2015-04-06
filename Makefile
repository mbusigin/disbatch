PROJECT=disbatch
VERSION=3.2.3.5

all:	
	@echo "Targets: clean, dist, rpm, bump_rpm, bump, bump_minor"

bump_rpm: disbatch.spec
	perl -ni -e 'if (/^Release: (\d+)$$/) { $$d = $$1+1; s/\d+/$$d/; } print' disbatch.spec

bump: Makefile disbatch.spec
	perl -ni -e 'if (/^VERSION=\d+\.\d+\.(\d+)$$/) { $$d = $$1+1; s/\d+$$/$$d/; } print' Makefile
	perl -pi -e 's/^Release: \d+$$/Release: 1/' disbatch.spec

bump_minor: Makefile disbatch.spec
	perl -ni -e 'if (/^VERSION=\d+\.(\d+)\.\d+$$/) { $$d = $$1+1; s/\d+\.\d+$$/$$d.0/; } print' Makefile
	perl -pi -e 's/^Release: \d+$$/Release: 1/' disbatch.spec

clean:	
	find . -name '*~' -delete
	find . -name 'DEADJOE' -delete
	rm -f disbatchd.log $(PROJECT)-$(VERSION).tar.gz

dist:	clean
	perl -pi -e 's/!!VERSION!!/$(VERSION)/' etc/disbatch/disbatch.ini-example
	tar --transform="s%^%$(PROJECT)-$(VERSION)/%" --exclude="*.pm-sysv" --exclude="*.pm-thread" -zcvhf $(PROJECT)-$(VERSION).tar.gz bin/ docs/ etc/ frontend/ lib/ t/ Makefile.PL MANIFEST
	perl -pi -e 's/$(VERSION)/!!VERSION!!/' etc/disbatch/disbatch.ini-example

rpm:	dist
	cp -f $(PROJECT)-$(VERSION).tar.gz disbatch-filter-requires.sh $(HOME)/rpmbuild/SOURCES/
	perl -pi -e 's/Version: !!VERSION!!/Version: $(VERSION)/' $(PROJECT).spec
	rpmbuild -bb $(PROJECT).spec
	perl -pi -e 's/Version: $(VERSION)/Version: !!VERSION!!/' $(PROJECT).spec
