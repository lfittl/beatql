# BeatQL

Demo app that combines react-music, GraphQL and PostgreSQL.

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
psql -h `docker-machine ip` -U beatql -f data/sql/schema.sql
```

Next, lets load the song from the [react-music demo](https://github.com/FormidableLabs/react-music/blob/master/demo/index.js):

```
psql -h `docker-machine ip` -U beatql -f data/sql/sample_song.sql
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
