# BeatQL

![](https://d17oy1vhnax1f7.cloudfront.net/items/3m1F25150d0a1g012a08/Screen%20Shot%202016-09-15%20at%2012.50.07%20PM%201.png)

Demo app that combines react-music, GraphQL and PostgreSQL.

It also shows off GraphQL mutations and subscriptions, based on [Apollo Client](https://github.com/apollostack/apollo-client).

Full background story: https://speakerdeck.com/lfittl/graphql-postgresql-p-dot-s-aka-beatql

## Getting started

First things first:

```
git clone https://github.com/lfittl/beatql
cd beatql
npm install
```

Then, boot up a PostgreSQL database and load the data structure:

```
docker-compose up -d db
psql -h `docker-machine ip` -U beatql -f data/sql/00_schema.sql
```

Next, lets load the song from the [react-music demo](https://github.com/FormidableLabs/react-music/blob/master/demo/index.js):

```
psql -h `docker-machine ip` -U beatql -f data/sql/01_sample_song.sql
```

In addition, run the following to enable LISTEN/NOTIFY for powering GraphQL subscriptions:

```
psql -h `docker-machine ip` -U beatql -f data/sql/02_notify.sql
```

Start the server:

```
npm start
```

You can then visit http://localhost:5000/ and should hear the demo song :-)

## Authors

Hacked together by [Lukas Fittl](https://github.com/lfittl).

None of this would have been possible without [react-music](https://github.com/FormidableLabs/react-music) made by [Ken Wheeler](https://github.com/kenwheeler).

## LICENSE

Copyright (c) 2016, Lukas Fittl <lukas@fittl.com> <br>
Licensed under the MIT license.

Demo code used from react-music is licensed under the [MIT license](https://opensource.org/licenses/MIT).

Code taken from relay-starter-kit is licensed under the [BSD license](https://github.com/relayjs/relay-starter-kit/blob/master/LICENSE).<br>
Copyright (c) 2013-2015, Facebook, Inc. All rights reserved.

See LICENSE file for details.
