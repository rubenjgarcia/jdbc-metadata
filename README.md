#JDBC Metadata

This nodule module helps you to get the metadata information from a database. Using a jdbc driver in Java you can access to the database and collect the information 
about tables, columns, primary keys, foreign keys, ...

## Example

```javascript

var metadata = require('jdbc-metadata');

var jdbcConfig = {
    libpath: __dirname + '/../jar/mysql-connector-java-5.1.32-bin.jar',
    drivername: 'com.mysql.jdbc.Driver',
    url: 'jdbc:mysql://localhost:3306/test',
    user: 'root',
    password: ''
};

var jdbcMetadata = new metadata(jdbcConfig);
        
jdbcMetadata.metadata(function (err, metadata) {

    console.log('Getting tables...');
    
    jdbcMetadata.tables(null, function (err, tables) {
        console.log(tables);
        
        jdbcConn.close(function(err) {
          console.log('Connection closed');
        });
    });
});

```

## Configuration

Create an object with the following properties
* libpath: Path to the jdbc jar
* drivername: Driver class
* url: Url to connect to the database
* user: User to connect to the database
* password: Password to connect to de database

```javascript

var jdbcConfig = {
    libpath: __dirname + '/../jar/mysql-connector-java-5.1.32-bin.jar',
    drivername: 'com.mysql.jdbc.Driver',
    url: 'jdbc:mysql://localhost:3306/test',
    user: 'root',
    password: ''
};

```

## Metadata Object

First you must create the metadata object passing a config object and initialize it by calling `metadata` method

```javascript
var jdbcMetadata = new metadata(jdbcConfig);
jdbcMetadata.metadata(function (err, metadata) {
    console.log('Metadata object initialized');
});
        
```

## Tables

To get the tables in the database you can use the `tables` method. You can filter the result using an options object with the following properties

* **catalog**: a catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
* **schema**: a schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
* **table**: a table name pattern; must match the table name as it is stored in the database
* **types**: an array of table types, which must be from the list of table types returned ("TABLE", "VIEW", "SYSTEM TABLE", "GLOBAL TEMPORARY", "LOCAL TEMPORARY", "ALIAS", "SYNONYM") to include; null returns all types

```javascript
var options = {schema: 'test', types: ['TABLE', 'VIEW']};
jdbcMetadata.tables(options, function (err, tables) {
    console.log(tables);
});

```

The result is an array containing the objects representing the tables properties

* **tableCat**: String => table catalog (may be null)
* **tableSchem** String => table schema (may be null)
* **tableName**: String => table name
* **tableType**: String => table type. Typical types are "TABLE", "VIEW", "SYSTEM TABLE", "GLOBAL TEMPORARY", "LOCAL TEMPORARY", "ALIAS", "SYNONYM".
* **remarks**: String => explanatory comment on the table
* **typeCat** String => the types catalog (may be null)
* **typeSchem** String => the types schema (may be null)
* **typeName** String => type name (may be null)
* **selfReferencingColName**: String => name of the designated "identifier" column of a typed table (may be null)
* **refGeneration**: String => specifies how values in selfReferencingColName are created. Values are "SYSTEM", "USER", "DERIVED". (may be null)
 
## Columns

To get the columns in tables you can use the `columns` method. You can filter the result using an options object with the following properties

* **catalog**: a catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
* **schema**: a schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
* **table**: a table name pattern; must match the table name as it is stored in the database
* **column**: a column name pattern; must match the column name as it is stored in the database

```javascript
var options = {schema: 'test', table: 'mytable'};
jdbcMetadata.columns(options, function (err, columns) {
    console.log(columns);
});

```

The result is an array containing the objects representing the columns properties


* **tableCat**: String => table catalog (may be null)
* **tableSchem**: String => table schema (may be null)
* **tableName**: String => table name
* **columnName**: String => column name
* **dataType**: int => column type
  * ARRAY (2003)
  * BIGINT (-5)
  * BINARY (-2)
  * BIT (-7)
  * BLOB (2004)
  * BOOLEAN (16)
  * CHAR (1)
  * CLOB (2005)
  * DATALINK (70)
  * DATE (91)
  * DECIMAL (3)
  * DISTINCT (2001)
  * DOUBLE (8)
  * FLOAT (6)
  * INTEGER (4)
  * JAVA_OBJECT (2000)
  * LONGNVARCHAR (-16)
  * LONGVARBINARY (-4)
  * LONGVARCHAR (-1)
  * NCHAR (-15)
  * NCLOB (2011)
  * NULL (0)
  * NUMERIC (2)
  * NVARCHAR (-9)
  * OTHER (1111)
  * REAL (7)
  * REF (2006)
  * ROWID (-8)
  * SMALLINT (5)
  * SQLXML (2009)
  * STRUCT (2002)
  * TIME (92)
  * TIMESTAMP (93)
  * TINYINT (-6)
  * VARBINARY (-3)
  * VARCHAR (12)
* **typeName**: String => Data source dependent type name, for a UDT the type name is fully qualified
* **columnSize**: int => column size.
* **bufferLength**: is not used.
* **decimalDigits**: int => the number of fractional digits. Null is returned for data types where decimalDigits is not applicable.
* **numPrecRadix**: int => Radix (typically either 10 or 2)
* **nullable**: int => is NULL allowed.
  * columnNoNulls (0) - might not allow NULL values
  * columnNullable (1) - definitely allows NULL values
  * columnNullableUnknown (2) - nullability unknown
* **remarks**: String => comment describing column (may be null)
* **columnDef**: String => default value for the column, which should be interpreted as a string when the value is enclosed in single quotes (may be null)
* **sqlDataType**: int => unused
* **sqlDatetime**: int => unused
* **charOctetLength**: int => for char types the maximum number of bytes in the column
* **ordinalPosition**: int => index of column in table (starting at 1)
* **isNullable**: String => ISO rules are used to determine the nullability for a column.
  * YES --- if the column can include NULLs
  * NO --- if the column cannot include NULLs
  * empty string --- if the nullability for the column is unknown
* **scopeCatalog**: String => catalog of table that is the scope of a reference attribute (null if dataType isn't REF)
* **scopeSchema**: String => schema of table that is the scope of a reference attribute (null if the dataType isn't REF)
* **scopeTable**: String => table name that this the scope of a reference attribute (null if the dataType isn't REF)
* **sourceData**: short => source type of a distinct type or user-generated Ref type. The posible values are the same as in dataType property (null if dataType isn't DISTINCT or user-generated REF)
* **isAutoincrement**: String => Indicates whether this column is auto incremented
  * YES --- if the column is auto incremented
  * NO --- if the column is not auto incremented
  * empty string --- if it cannot be determined whether the column is auto incremented
* **isGeneratedcolumn**: String => Indicates whether this is a generated column
YES --- if this a generated column
NO --- if this not a generated column
empty string --- if it cannot be determined whether this is a generated column

## Primary Keys

To get the primary keys in tables you can use the `primaryKeys` method. You can filter the result using an options object with the following properties

* **catalog**: a catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
* **schema**: a schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
* **table**: a table name; must match the table name as it is stored in the database

```javascript
var options = {schema: 'test', table: 'mytable'};
jdbcMetadata.primaryKeys(options, function (err, primaryKeys) {
    console.log(primaryKeys);
});

```

The result is an array containing the objects representing the primary keys properties

* **tableCat**: String => table catalog (may be null)
* **tableSchem**: String => table schema (may be null)
* **tableName**: String => table name
* **columnName**: String => column name
* **keySeq**: short => sequence number within primary key( a value of 1 represents the first column of the primary key, a value of 2 would represent the second column within the primary key).
* **pkName**: String => primary key name (may be null)
 
## Foreign keys

To get the Foreing keys (Imported keys) in tables you can use the `importedKeys` method. You can filter the result using an options object with the following properties

* **catalog**: a catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
* **schema**: a schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
* **table**: a table name; must match the table name as it is stored in the database

```javascript
var options = {schema: 'test', table: 'mytable'};
jdbcMetadata.importedKeys(options, function (err, importedKeys) {
    console.log(importedKeys);
});

```

The result is an array containing the objects representing the foreign keys properties

* **pktableCat**: String => primary key table catalog being imported (may be null)
* **pktableSchem**: String => primary key table schema being imported (may be null)
* **pktableName**: String => primary key table name being imported
* **pkcolumnName**: String => primary key column name being imported
* **fktableCat**: String =>  foreign key table catalog (may be null)
* **fktableSchem**: String => foreign key table schema (may be null)
* **fktableName**: String => foreign key table name
* **fkcolumnName**: String => foreign key column name
* **keySeq**: short => sequence number within a foreign key( a value of 1 represents the first column of the foreign key, a value of 2 would represent the second column within the foreign key).
* **updateRule**: short => What happens to a foreign key when the primary key is updated:
  * importedKeyNoAction (3) - do not allow update of primary key if it has been imported
  * importedKeyCascade (0) - change imported key to agree with primary key update
  * importedKeySetNull (2) - change imported key to NULL if its primary key has been updated
  * importedKeySetDefault (4) - change imported key to default values if its primary key has been updated
  * importedKeyRestrict (1) - same as importedKeyNoAction (for ODBC 2.x compatibility)
* **deleteRule**: short => What happens to the foreign key when primary is deleted.
  * importedKeyNoAction (3) - do not allow delete of primary key if it has been imported
  * importedKeyCascade (0) - delete rows that import a deleted key
  * importedKeySetNull (2) - change imported key to NULL if its primary key has been deleted
  * importedKeyRestrict (1) - same as importedKeyNoAction (for ODBC 2.x compatibility)
  * importedKeySetDefault (4) - change imported key to default if its primary key has been deleted
* **fkName**: String => foreign key name (may be null)
* **pkName**: String => primary key name (may be null)
* **deferrability**: short => can the evaluation of foreign key constraints be deferred until commit
  * importedKeyInitiallyDeferred (5) - see [SQL92](http://en.wikipedia.org/wiki/SQL-92) for definition
  * importedKeyInitiallyImmediate (6) - see [SQL92](http://en.wikipedia.org/wiki/SQL-92) for definition
  * importedKeyNotDeferrable (7) - see [SQL92](http://en.wikipedia.org/wiki/SQL-92) for definition

## Exported keys

To get the foreign key columns that reference the given table's primary key columns (the foreign keys exported by a table) you can use the `exportedKeys` method. You can filter the result using an options object with the following properties

* **catalog**: a catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
* **schema**: a schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
* **table**: a table name; must match the table name as it is stored in the database

```javascript
var options = {schema: 'test', table: 'mytable'};
jdbcMetadata.exportedKeys(options, function (err, exportedKeys) {
    console.log(importedKeys);
});

```

The result is an array containing the objects representing the foreign keys properties

* **pktableCat**: String => primary key table catalog (may be null)
* **pktableSchem**: String => primary key table schema (may be null)
* **pktableName**: String => primary key table name
* **pkcolumnName**: String => primary key column name
* **fktableCat**: String => foreign key table catalog (may be null) being exported (may be null)
* **fktableSchem**: String => foreign key table schema (may be null) being exported (may be null)
* **fktableName**: String => foreign key table name being exported
* **fkcolumnName**: String => foreign key column name being exported
* **keySeq**: short => sequence number within foreign key( a value of 1 represents the first column of the foreign key, a value of 2 would represent the second column within the foreign key).
* **updateRule**: short => What happens to foreign key when primary is updated:
  * importedKeyNoAction (3) - do not allow update of primary key if it has been imported
  * importedKeyCascade (0) - change imported key to agree with primary key update
  * importedKeySetNull (2) - change imported key to NULL if its primary key has been updated
  * importedKeySetDefault (4) - change imported key to default values if its primary key has been updated
  * importedKeyRestrict (1) - same as importedKeyNoAction (for ODBC 2.x compatibility)
* **deleteRule**: short => What happens to the foreign key when primary is deleted.
  * importedKeyNoAction (3) - do not allow delete of primary key if it has been imported
  * importedKeyCascade (0) - delete rows that import a deleted key
  * importedKeySetNull (2) - change imported key to NULL if its primary key has been deleted
  * importedKeyRestrict (1) - same as importedKeyNoAction (for ODBC 2.x compatibility)
  * importedKeySetDefault (4) - change imported key to default if its primary key has been deleted
* **fkName**: String => foreign key name (may be null)
* **pkName**: String => primary key name (may be null)
* **deferrability**: short => can the evaluation of foreign key constraints be deferred until commit
  * importedKeyInitiallyDeferred (5) - see [SQL92](http://en.wikipedia.org/wiki/SQL-92) for definition
  * importedKeyInitiallyImmediate (6) - see [SQL92](http://en.wikipedia.org/wiki/SQL-92) for definition
  * importedKeyNotDeferrable (7) - see [SQL92](http://en.wikipedia.org/wiki/SQL-92) for definition
  
## Close connection

Once you've finished with the connection you must close it by calling method `close`

```javascript
jdbcMetadata.close(function (err) {
    console.log('Connection closed');
});
```