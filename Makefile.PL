use strict;
use warnings;
use ExtUtils::MakeMaker;

die "don't run 'perl Makefile.PL' directly - use 'make rpm'\n" if -e 'Makefile';

WriteMakefile(
    EXE_FILES           => [ 'bin/QueueBalance.pl', 'bin/disbatch.pl', 'bin/disbatchd.pl' ],
);
