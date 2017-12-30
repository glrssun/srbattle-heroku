var MongoClient = require( 'mongodb' ).MongoClient;
var url = process.env.MONGOLAB_URI;
var _db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect( url, function( err, client ) {
            var db = client.db('srbattle');
            _db = db;
            return callback( err );
        });
    },

    getDb: function() {
        return _db;
    },

    getNextSequence: function(name) {
        var ret = _db.collection("counters").findAndModify(
            {
                query: { _id: name },
                update: { $inc: { seq: 1 } },
                new: true
            }
        );
        return ret.seq;
    }
};
