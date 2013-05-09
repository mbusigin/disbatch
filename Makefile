PROJECT=disbatch
VERSION=3.0.1

all:	
	@echo "Nothing to make"

clean:	
	find . -name '*~' -delete
	find . -name 'DEADJOE' -delete
	rm -f disbatchd.log $(PROJECT)-$(VERSION).tar.gz

dist:	clean
	tar --transform="s%^%$(PROJECT)-$(VERSION)/%" --exclude="*.pm-sysv" --exclude="*.pm-thread" -zcvhf $(PROJECT)-$(VERSION).tar.gz bin/ docs/ etc/ frontend/ lib/ t/ Makefile.PL MANIFEST

rpm:	dist
	cp -f $(PROJECT)-$(VERSION).tar.gz disbatch-filter-requires.sh $(HOME)/rpmbuild/SOURCES/
	rpmbuild -bb $(PROJECT).spec
