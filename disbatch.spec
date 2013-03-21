%define    _use_internal_dependency_generator 0
%define    __find_requires %{SOURCE99}

Name: disbatch
Version: 3.0
Summary: Multi-threaded execution harness
Release: 1
License: Proprietary
Group: System/Cluster
Packager: Matthew Berg <mberg@synacor.com>
Source: disbatch-%{version}.tar.gz
Source1: disbatch.init
Source99: disbatch-filter-requires.sh
BuildRoot:  %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArch: noarch
Requires: perl(Moose) perl(Mouse) perl-threads-shared perl-threads perl(Authen::Simple::Adapter) perl(Class::Data::Inheritable) perl(HTTP::Server::Simple::Authen)
Obsoletes: disbatch-frontend

%description
Disbatch provides a multi-threaded execution harness for doing very large 
jobs with comprise of many smaller self-similar tasks.

%prep
%setup -n disbatch-3.0

%build

%clean
rm -rf %{buildroot}

%install
install -d -m0755 %{buildroot}/opt/disbatch

cp -r * %{buildroot}/opt/disbatch

%post
/sbin/chkconfig --add disbatchd

%preun
if [ $1 -lt 1 ]; then
	/sbin/service disbatchd stop > /dev/null 2>&1

	/sbin/chkconfig --del disbatchd
fi

%files
/etc/init.d/disbatchd
/opt/disbatch

%changelog
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
