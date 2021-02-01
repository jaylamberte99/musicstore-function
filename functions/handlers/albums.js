const { db } = require('../util/admin');

exports.getAllAlbums = (req, res) => {
    db.collection('albums')
    .orderBy('albumPurchases', 'desc')
    .get()
    .then(data => {
        let albums = [];
        data.forEach( doc => {
            albums.push({
                albumId: doc.id,
                albumArtist: doc.data().albumArtist,
                albumName: doc.data().albumName,
                releaseDate: doc.data().releaseDate,
                albumPurchases: doc.data().albumPurchases,
                albumImg: doc.data().albumImg,
                albumImgBig: doc.data().albumImgBig

            });
        });
        return res.json(albums);
    })
    .catch(err => console.error(err))
};

exports.getTop10Albums = (req, res) => {
  db.collection('albums')
  .orderBy('albumPurchases', 'desc')
  .limit(10)
  .get()
  .then(data => {
      let albums = [];
      data.forEach( doc => {
          albums.push({
              albumId: doc.id,
              albumArtist: doc.data().albumArtist,
              albumName: doc.data().albumName,
              releaseDate: doc.data().releaseDate,
              albumPurchases: doc.data().albumPurchases,
              albumImg: doc.data().albumImg,
              albumImgBig: doc.data().albumImgBig
          });
      });
      return res.json(albums);
  })
  .catch(err => console.error(err))
};

exports.purchaseAlbum = (req, res) =>{
    const purchaseDocument = db
    .collection('purchases')
    .where('albumId', '==', req.params.albumId)
    .limit(1);

    const albumDocument = db.doc(`/albums/${req.params.albumId}`);

  let albumData;

  albumDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        albumData = doc.data();
        albumData.albumId = doc.id;
        return purchaseDocument.get();
      } else {
        return res.status(404).json({ error: 'Album not found' });
      }
    })
    .then((data) => {
        return db
          .collection('purchases')
          .add({
            albumId: req.params.albumId
          })
          .then(() => {
            albumData.albumPurchases++;
            return albumDocument.update({ albumPurchases: albumData.albumPurchases });
          })
          .then(() => {
            return res.json(albumData);
          });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });

};