const functions = require("firebase-functions");
const app = require('express')();
const { db } = require('./util/admin');

const cors = require('cors');
app.use(cors());

const {
    getAllAlbums,
    getTop10Albums,
    purchaseAlbum
} = require ('./handlers/albums');

const {
    getAllSongs,
    getAllSongsFromAlbum,
    getTop10Songs,
    playSong
} = require ('./handlers/songs');

app.get('/getAllAlbums', getAllAlbums);
app.get('/getTop10Albums', getTop10Albums);
app.get('/purchaseAlbum/:albumId', purchaseAlbum);
app.get('/getAllSongs', getAllSongs);
app.get('/getAllSongsFromAlbum/:songAlbumID', getAllSongsFromAlbum);
app.get('/getTop10Songs', getTop10Songs);
app.get('/playSong/:songId', playSong);

exports.api = functions.https.onRequest(app);