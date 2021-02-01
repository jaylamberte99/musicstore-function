const { db } = require('../util/admin');

exports.getAllSongs = (req, res) => {
    db.collection('songs')
    .orderBy('songPlays', 'desc')
    .get()
    .then(data => {
        let songs = [];
        data.forEach( doc => {
          songs.push({
                songId: doc.id,
                songName: doc.data().songName,
                songArtist: doc.data().songArtist,
                songAlbum: doc.data().songAlbum,
                songAlbumID: doc.data().songAlbumID,
                songImg: doc.data().songImg,
                songPlays: doc.data().songPlays
  
            });
        });
        return res.json(songs);
    })
    .catch(err => console.error(err))
};

exports.getAllSongsFromAlbum = (req, res) => {
    db.collection('songs')
    .where('songAlbumID', '==', req.params.songAlbumID)
    .get()
    .then(data => {
        let songs = [];
        data.forEach( doc => {
          songs.push({
                songId: doc.id,
                songName: doc.data().songName,
                songArtist: doc.data().songArtist,
                songAlbum: doc.data().songAlbum,
                songAlbumID: doc.data().songAlbumID,
                songImg: doc.data().songImg,
                songPlays: doc.data().songPlays
  
            });
        });
        return res.json(songs);
    })
    .catch(err => console.error(err))
};

exports.getTop10Songs = (req, res) => {
    db.collection('songs')
    .orderBy('songPlays', 'desc')
    .limit(10)
    .get()
    .then(data => {
        let songs = [];
        data.forEach( doc => {
          songs.push({
                songId: doc.id,
                songName: doc.data().songName,
                songArtist: doc.data().songArtist,
                songAlbum: doc.data().songAlbum,
                songAlbumID: doc.data().songAlbumID,
                songImg: doc.data().songImg,
                songPlays: doc.data().songPlays
  
            });
        });
        return res.json(songs);
    })
    .catch(err => console.error(err))
};

exports.playSong = (req, res) =>{
    const playDocument = db
    .collection('plays')
    .where('songId', '==', req.params.songId)
    .limit(1);

    const songDocument = db.doc(`/songs/${req.params.songId}`);

  let songData;

  songDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        songData = doc.data();
        songData.songId = doc.id;
        return playDocument.get();
      } else {
        return res.status(404).json({ error: 'Song not found' });
      }
    })
    .then((data) => {
        return db
          .collection('plays')
          .add({
            songId: req.params.songId
          })
          .then(() => {
            songData.songPlays++;
            return songDocument.update({ songPlays: songData.songPlays });
          })
          .then(() => {
            return res.json(songData);
          });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });

};