package Synacor::Disbatch::Input::Users;

use strict;
use JSON;
use Data::Dumper;

=head1 NAME

Synacor::Disbatch::Input::Users - a instance of this object represents a database of
users which other modules will access in the process of migrating email,
calendars & contacts.

=head1 METHODS

=over 1

=cut


=item new()

Creates new Users object.

Parameters:

  $users		Hashref for users

=cut

my $json = new JSON;


sub new
{
    my $class = shift;
    my $id = shift;
    
    my $users = $Synacor::Disbatch::Backend::mongo->get_collection( 'users' );
    my $groups = $Synacor::Disbatch::Backend::mongo->get_collection( 'groups' );
    
    my $self =
    {
        'id'		=> $id,
        'users'		=> $users,
        'groups'	=> $groups,
    };

    bless $self, $class;
    return $self;
}


sub query
{
   my $self = shift;
   my $filter = shift;
   $filter->{ 'group' } = $self->{ 'id' };
   warn Dumper( $filter );   
   return $self->{ 'users' }->query( $filter );
}


sub find_one
{
   my $self = shift;
   my $filter = shift;
   $filter->{ 'group' } = $self->{ 'id' };
   
   return $self->{ 'users' }->find_one( $filter );
}


sub update
{
   my $self = shift;
   my $criteria = shift;
   $criteria->{ 'group' } = $self->{ 'id' };
   my $object = shift;
   my $options = shift;
   
   return $self->{ 'users' }->update( $criteria, $object, $options );
}


sub insert
{
   my $self = shift;
   my $object = shift;
   $object->{ 'group' } = $self->{ 'id' };

#   warn Dumper( "Inserting: $object\n" );
   
   return $self->{ 'users' }->insert( $object );
}


sub save
{
    my $self = shift;
    my $dirtyonly = shift;
    return;

    my $all_users = $Synacor::Disbatch::Engine::dbh->selectall_hashref( 'select id, username, password from users', 'username' );

#    warn "Saving all users...\n";
    foreach my $username ( keys %{$self->{'users'}} )
    {
        $self->save_user( $username, $all_users )
          if !$dirtyonly or $self->{'users'}->{$username}->{'_dirty'};
    }
}


sub add_group
{
    my $self = shift;
    
    $self->{ 'groups' }->insert( {'id' => $self->{'id'}} );
}


my $select_id_from_users_sth = undef;
my $insert_into_users_sth = undef;
my $update_users_sth = undef;
sub save_user
{
    my $self = shift;
    my $user = shift;
    my $all_users = shift;

    return;

    my $u = $self->{ 'users' }->{ $user };
    my $user_json = $json->encode( $self->{'users'}->{$user} );
    
    if ( !(ref($user) and ref($user) eq 'HASH') )
    {
        $user = $self->{ 'users' }->{ $user };
    }
    my $id;
    
    if ( $all_users )
    {
        $id = $all_users->{ $user->{'username'} };
        $id = $id->{ 'id' } if $id;
    }
    else
    {
        $select_id_from_users_sth ||= $Synacor::Disbatch::Engine::dbh->prepare( 'select id from users where username = ?' );
        $select_id_from_users_sth->execute( ($user->{'username'}) );
        ( $id ) = $select_id_from_users_sth->fetchrow_array;
    }
        
    if ( !$id )
    {
#        warn "Inserting " . Dumper( $u );
        $insert_into_users_sth ||= $Synacor::Disbatch::Engine::dbh->prepare( 
                'insert into users values( ?, ?, ?, ?, ? )' );
        $insert_into_users_sth->execute( (undef, $self->{'id'}, $u->{'username'}, $u->{'password'}, $user_json) );
    }
    else
    {
        $update_users_sth ||= $Synacor::Disbatch::Engine::dbh->prepare( 
               'update users set password = ?, json = ? where id = ?' );
        $update_users_sth->execute( ($user->{'password'}, $user_json, $id) );
    }
    
    delete $u->{ '_dirty' };
}


sub load
{
    my $self = shift;
    my $json = new JSON;
    
    return;
    
    my $users = $Synacor::Disbatch::Engine::dbh->selectall_hashref( 'select * from users', 'id' ); #, undef, ($self->{'id'}) );
    foreach my $uid (keys %{$users})
    {
        my $row = $users->{ $uid };
        my $user = $json->decode( $row->{'json'} );
        
        $self->{ 'users' }->{ $user->{'username'} } = $user;
    }
}


1;
