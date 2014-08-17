#!/usr/bin/perl

# > db.balance.find()
# { "_id" : ObjectId("51e6b6ba9a6c3039c5a80b98"), "max_tasks" : { "* 7 0" : 20, "* 19 0" : 50 }, "queues" : [  [  "main" ],  [  "oneoff" ],  [  "single" ] ] }

# db.balance.update({}, { "max_tasks" : { "* 8 0" : 20, "* 20 0" : 35 }, "queues" : [ [ "lqres" ] ] }, {upsert : 1})

use 5.12.0;
use warnings;

use File::Slurp;
use JSON;
use lib 'lib';
use Synacor::Disbatch::QueueBalance;

$| = 1;

my $config = read_file '/etc/disbatch/config.json';
$config = JSON->new->relaxed->decode($config);

my $qb = Synacor::Disbatch::QueueBalance->new($config);

while (1) {
    $qb->update();
    sleep 30;
}
