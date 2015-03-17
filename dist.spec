Name: <% $zilla->name %>
Version: <% (my $v = $zilla->version) =~ s/^v//; $v %>
Release: 1%{?_dist}

Summary: <% $zilla->abstract %>
License: distributable
Group: System/Cluster
Vendor: <% $zilla->license->holder %>
Source: <% $archive %>

BuildRoot: %{_tmppath}/%{name}-%{version}-BUILD
BuildRequires: perl >= 0:5.01204

%description
<% $zilla->abstract %>

%prep
%setup -q

%build
PERL_MB_OPT="" PERL_MM_OPT="" CFLAGS="$RPM_OPT_FLAGS" perl Makefile.PL INSTALLDIRS=vendor
make

%check
make test

%install
if [ "%{buildroot}" != "/" ] ; then
    rm -rf %{buildroot}
fi
make install DESTDIR=%{buildroot}
#find %{buildroot} | sed -e 's#%{buildroot}##' > %{_tmppath}/filelist

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

install -d -m0755 %{buildroot}/etc/disbatch
cp -Lr etc/disbatch/* %{buildroot}/etc/disbatch

install -D -m0755 etc/init.d/disbatchd %{buildroot}/etc/init.d/disbatchd
install -D -m0644 etc/logrotate.d/disbatch %{buildroot}/etc/logrotate.d/disbatch

#install -d -m0755 %{buildroot}/etc/disbatch/htdocs
cp -Lr frontend/build etc/disbatch/htdocs

%post
/sbin/chkconfig --add disbatchd
/sbin/chkconfig disbatchd on

%preun
if [ $1 -lt 1 ]; then
	/sbin/service disbatchd stop > /dev/null 2>&1

	/sbin/chkconfig --del disbatchd
fi

%clean
if [ "%{buildroot}" != "/" ] ; then
    rm -rf %{buildroot}
fi

%files -f %{name}-%{version}-filelist
/etc/init.d/disbatchd
/etc/disbatch/
/etc/logrotate.d/disbatch

%defattr(-,root,root)

%changelog
* %(date '+%a %b %d %Y') Ashley Willis <awillis@synacor.com> %{version}-1
- Initial Synacor build.
