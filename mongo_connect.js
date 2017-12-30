var MongoClient = require( 'mongodb' ).MongoClient;
var url = process.env.MONGOLAB_URI;
var _db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect( url, function( err, client ) {
            _db = client.db('srbattle');
            return callback( err );
        });
    },

    getDb: function() {
        return _db;
    }
};
