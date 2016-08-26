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
