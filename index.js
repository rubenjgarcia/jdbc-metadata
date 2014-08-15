'use strict';

var java = require('java');
var jdbc = require('./lib/jdbc');
var _s = require('underscore.string');

module.exports = JDBCMetadata;

function JDBCMetadata(config) {
    this._config = config;
    this._jdbc = null;
    this._conn = null;
    this._metadata = null;
}

JDBCMetadata.prototype.metadata = function (callback) {
    var self = this;

    if (self._jdbc == null) {
        self._jdbc = new jdbc();
        self._jdbc.initialize(self._config, function (err) {
            if (err) {
                return callback(err);
            }

            self._jdbc.open(function (err, conn) {
                if (err) {
                    return callback(err);
                }

                self._conn = conn;
                return getMetadata(self, callback);
            });
        });
    }
    else if (self._metadata == null) {
        return getMetadata(self, callback);
    }
    else {
        return self._metadata;
    }
};

var getMetadata = function (self, callback) {

    java.callMethod(self._conn, 'getMetaData', function (err, metadata) {
        if (err) {
            return callback(err);
        } else {
            self._metadata = metadata;
            return callback(null, metadata);
        }
    });
};

JDBCMetadata.prototype.tables = function (options, callback) {
    var self = this;

    if (self._metadata == null) {
        self.metadata(function (err) {
            if (err) {
                return callback(err);
            }

            getTables(self, options, callback);
        });
    }
    else {
        getTables(self, options, callback);
    }
};

var getTables = function (self, options, callback) {

    options = options || {};

    java.callMethod(self._metadata, 'getTables', options.catalog, options.schema, options.table, java.newArray("java.lang.String", options.types || []), function (err, tablesRs) {
        if (err) {
            return callback(err);
        } else {
            tablesRs.getMetaData(function (err, rsmd) {
                if (err) {
                    return callback(err);
                } else {
                    var tables = parseResultSet(tablesRs, rsmd);
                    return callback(null, tables);
                }
            });
        }
    });
};

var parseResultSet = function (resultset, rsmd) {
    var cc = rsmd.getColumnCountSync();
    var columns = [''];
    for (var i = 1; i <= cc; i++) {
        var colname = rsmd.getColumnNameSync(i);
        columns.push(colname)
    }
    var results = [];
    var next = resultset.nextSync();

    while (next) {
        var row = {};

        for (var j = 1; j <= cc; j++) {
            var propertyName = _s.classify(columns[j]);
            propertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
            row[propertyName] = resultset.getStringSync(j);
        }
        results.push(row);
        next = resultset.nextSync();
    }

    resultset.close();

    return results;
};

JDBCMetadata.prototype.columns = function (options, callback) {
    var self = this;

    if (self._metadata == null) {
        self.metadata(function (err) {
            if (err) {
                return callback(err);
            }

            getColumns(self, options, callback);
        });
    }
    else {
        getColumns(self, options, callback);
    }
};

var getColumns = function (self, options, callback) {

    options = options || {};

    java.callMethod(self._metadata, 'getColumns', options.catalog, options.schema, options.table, options.column, function (err, columnsRs) {
        if (err) {
            return callback(err);
        } else {
            columnsRs.getMetaData(function (err, rsmd) {
                if (err) {
                    return callback(err);
                } else {
                    var columns = parseResultSet(columnsRs, rsmd);
                    return callback(null, columns);
                }
            });
        }
    });
};

JDBCMetadata.prototype.primaryKeys = function (options, callback) {
    var self = this;

    if (self._metadata == null) {
        self.metadata(function (err) {
            if (err) {
                return callback(err);
            }

            getPrimaryKeys(self, options, callback);
        });
    }
    else {
        getPrimaryKeys(self, options, callback);
    }
};

var getPrimaryKeys = function (self, options, callback) {

    options = options || {};

    java.callMethod(self._metadata, 'getPrimaryKeys', options.catalog, options.schema, options.table, function (err, primaryKeysRs) {
        if (err) {
            return callback(err);
        } else {
            primaryKeysRs.getMetaData(function (err, rsmd) {
                if (err) {
                    return callback(err);
                } else {
                    var primaryKeys = parseResultSet(primaryKeysRs, rsmd);
                    return callback(null, primaryKeys);
                }
            });
        }
    });
};

JDBCMetadata.prototype.exportedKeys = function (options, callback) {
    var self = this;

    if (self._metadata == null) {
        self.metadata(function (err) {
            if (err) {
                return callback(err);
            }

            getExportedKeys(self, options, callback);
        });
    }
    else {
        getExportedKeys(self, options, callback);
    }
};

var getExportedKeys = function (self, options, callback) {

    options = options || {};

    java.callMethod(self._metadata, 'getExportedKeys', options.catalog, options.schema, options.table, function (err, exportedKeysRs) {
        if (err) {
            return callback(err);
        } else {
            exportedKeysRs.getMetaData(function (err, rsmd) {
                if (err) {
                    return callback(err);
                } else {
                    var exportedKeys = parseResultSet(exportedKeysRs, rsmd);
                    return callback(null, exportedKeys);
                }
            });
        }
    });
};

JDBCMetadata.prototype.importedKeys = function (options, callback) {
    var self = this;

    if (self._metadata == null) {
        self.metadata(function (err) {
            if (err) {
                return callback(err);
            }

            getImportedKeys(self, options, callback);
        });
    }
    else {
        getImportedKeys(self, options, callback);
    }
};

var getImportedKeys = function (self, options, callback) {

    options = options || {};

    java.callMethod(self._metadata, 'getImportedKeys', options.catalog, options.schema, options.table, function (err, importedKeysRs) {
        if (err) {
            return callback(err);
        } else {
            importedKeysRs.getMetaData(function (err, rsmd) {
                if (err) {
                    return callback(err);
                } else {
                    var importedKeys = parseResultSet(importedKeysRs, rsmd);
                    return callback(null, importedKeys);
                }
            });
        }
    });
};

JDBCMetadata.prototype.close = function (callback) {
    var self = this;

    if (self._jdbc != null) {
        self._jdbc.close(callback);
    }
};