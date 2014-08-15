'use strict';

var java = require('java');

function JDBCConn() {
    this._config = {};
    this._conn = null;
}

JDBCConn.prototype.initialize = function(config, callback) {
    var self = this;
    self._config = config;

    java.classpath.push(self._config.libpath);

    java.newInstance(self._config.drivername, function(err, driver) {
        if (err) {
            return callback(err);
        } else {
            java.callStaticMethod('java.sql.DriverManager','registerDriver', driver, function(err) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, self._config.drivername);
                }
            });
        }
    });
};

JDBCConn.prototype.open = function(callback) {
    var self = this;

    java.callStaticMethod('java.sql.DriverManager','getConnection', self._config.url, self._config.user, self._config.password, function(err, conn) {
        if (err) {
            return callback(err);
        } else {
            self._conn = conn;
            return callback(null, conn);
        }
    });
};

JDBCConn.prototype.close = function(callback) {
    var self = this;

    if (self._conn) {
        self._conn.close(function(err) {
            if (err) {
                return callback(err);
            } else {
                self._conn = null;
                if (callback) {
                    return callback(null);
                }
            }
        });
    }
};

JDBCConn.prototype.metadata = function(callback) {
    var self = this;

    java.callMethod(self._conn, 'getMetaData', function(err, metadata) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, metadata);
        }
    });
};

module.exports = JDBCConn;