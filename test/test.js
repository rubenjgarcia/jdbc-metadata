'use strict';
var jdbc = require('../lib/jdbc');
var should = require('should');

var metadata = require('../index');

var jdbcConfig = {
    libpath: __dirname + '/../jar/mysql-connector-java-5.1.32-bin.jar',
    drivername: 'com.mysql.jdbc.Driver',
    url: 'jdbc:mysql://localhost:3306/test',
    user: 'root',
    password: ''
};

describe('Connect', function () {

    var jdbcConn = new jdbc();

    it('connect to database', function (done) {

        jdbcConn.initialize(jdbcConfig, function (err) {
            should.not.exists(err);

            jdbcConn.open(function(err, conn) {
                should.not.exists(err);

                jdbcConn.close(function(err) {
                    should.not.exists(err);

                    done();
                });
            });
        });
    });

    after(function (){
        jdbcConn.close();
    });
});

describe('Metadata', function () {

    var jdbcMetadata = new metadata(jdbcConfig);

    it('get metadata', function (done) {

        jdbcMetadata.metadata(function (err, metadata) {
            should.not.exists(err);
            done();
        });
    });

    var testTables;

    it('get tables', function (done) {

        this.timeout(5000);

        jdbcMetadata.tables(null, function (err, tables) {
            should.not.exists(err);
            testTables = tables;
            done();
        });
    });

    it('get columns from table', function (done) {

        jdbcMetadata.columns(null, function (err, columns) {
            should.not.exists(err);
            done();
        });
    });

    it('get primary keys from table', function (done) {

        jdbcMetadata.primaryKeys({table: testTables[0].tableName}, function (err, primaryKeys) {
            should.not.exists(err);
            done();
        });
    });

    it('get imported keys from table', function (done) {

        jdbcMetadata.importedKeys({table: testTables[0].tableName}, function (err, importedKeys) {
            should.not.exists(err);
            done();
        });
    });

    it('get exported keys from table', function (done) {

        jdbcMetadata.exportedKeys({table: testTables[0].tableName}, function (err, exportedKeys) {
            should.not.exists(err);
            done();
        });
    });

    after(function (){
        jdbcMetadata.close();
    });
});
