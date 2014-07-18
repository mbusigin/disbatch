%define    _use_internal_dependency_generator 0
%define    __find_requires %{SOURCE99}

Name: disbatch
Version: !!VERSION!!
Summary: Multi-threaded execution harness
Release: 1
License: Proprietary
Group: System/Cluster
Packager: Ashley Willis <awillis@synacor.com>
Source: %{name}-%{version}.tar.gz
Source1: disbatch.init
Source99: disbatch-filter-requires.sh
BuildRoot:  %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArch: noarch
Obsoletes: disbatch-frontend

%description
Disbatch provides a multi-threaded execution harness for doing very large jobs which comprise many smaller self-similar tasks.

%prep
%setup -n %{name}-%{version}

%build
CFLAGS="$RPM_OPT_FLAGS" perl Makefile.PL INSTALLDIRS=vendor
make

%check
make test

%clean
rm -rf %{buildroot}

%install

rm -rf %{buildroot}
make install DESTDIR=%{buildroot}

[ -x /usr/lib/rpm/brp-compress ] && /usr/lib/rpm/brp-compress
find %{buildroot} \( -name perllocal.pod -o -name .packlist \) -exec rm -v {} \;

find %{buildroot}/usr -type f -print | \
        sed "s@^%{buildroot}@@g" | \
        grep -v perllocal.pod | \
        grep -v "\.packlist" > %{name}-%{version}-filelist
if [ "$(cat %{name}-%{version}-filelist)X" = "X" ] ; then
    echo "ERROR: EMPTY FILE LIST"
    exit -1
fi

install -d -m0755 %{buildroot}/usr/share/doc/%{name}-%{version}
cd docs && perl -mPod::Simple::HTMLBatch -ePod::Simple::HTMLBatch::go ../ . && cd ..
cp -r docs/* %{buildroot}/usr/share/doc/%{name}-%{version}

install -d -m0755 %{buildroot}/etc/disbatch
cp -Lr etc/disbatch/* %{buildroot}/etc/disbatch

install -D -m0755 etc/init.d/disbatchd %{buildroot}/etc/init.d/disbatchd

%post
/sbin/chkconfig --add disbatchd
/sbin/chkconfig disbatchd on

%preun
if [ $1 -lt 1 ]; then
	/sbin/service disbatchd stop > /dev/null 2>&1

	/sbin/chkconfig --del disbatchd
fi

%files -f %{name}-%{version}-filelist
/etc/init.d/disbatchd
/etc/disbatch/
/usr/share/doc/%{name}-%{version}/

%changelog
* Thu Jul 17 2014 Ashley Willis <awillis@synacor.com> - 3.2.2
- full path for /var/log/disbatchd.log in etc/disbatch/disbatch-log4perl.conf
* Thu May  1 2014 Ashley Willis <awillis@synacor.com> - 3.2.1
- kill forks if main process dies, use MongoDB::MongoClient, clean up warnings
* Fri May 10 2013 Ashley Willis <awillis@synacor.com> - 3.2.0
- restructure for proper install and packaging
* Thu Apr 11 2013 Matt Busigin <mbusigin@synacor.com> - 3.1
- New version
* Mon Mar 18 2013 Matt Busigin <mbusigin@synacor.com> - 3.0
- New version
* Tue Jan 25 2011 Matthew Berg <mberg@synacor.com> - 0.9.22-1
- New upstream version
- Add init script
* Tue Jan 25 2011 Matthew Berg <mberg@synacor.com> - 0.9.16-3
- Build with correct tarball
* Tue Jan 25 2011 Matthew Berg <mberg@synacor.com> - 0.9.16-2
- Obsolete old package
* Tue Jan 25 2011 Matthew Berg <mberg@synacor.com> - 0.9.16-1
- New version
