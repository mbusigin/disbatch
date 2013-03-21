PROJECT=disbatch
VERSION=3.0

all:	
	@echo "Nothing to make"

clean:	
	find . -name '*~' -exec rm '{}' \;
	find . -name 'DEADJOE' -exec rm '{}' \;
	rm -f disbatchd.log $(PROJECT)-$(VERSION).tar.gz

dist:	clean
	tar zcvf $(PROJECT)-$(VERSION).tar.gz Synacor/ disbatch.ini docs/ htdocs/ disbatch-log4perl.conf disbatch.pl Pinscher/ disbatch.d/ disbatchd.pl frontend/
