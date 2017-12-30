var MongoClient = require( 'mongodb' ).MongoClient;
var url = process.env.MONGOLAB_URI;
var _db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect( url, function( err, client ) {
            var db = client.db('srbattle');
            _db = db;
            return callback( err );
        } );
    },

    getDb: function() {
        return _db;
    }
};

module.exports = function getNextSequence(name) {
    var ret = db.counters.findAndModify(
        {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
        }
    );
    return ret.seq;
};
