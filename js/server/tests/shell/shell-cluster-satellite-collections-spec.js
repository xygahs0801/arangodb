/* global describe, beforeEach, afterEach, it*/
////////////////////////////////////////////////////////////////////////////////
/// DISCLAIMER
///
/// Copyright 2016-2016 ArangoDB GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is ArangoDB GmbH, Cologne, Germany
///
/// @author Andreas Streichardt
/// @author Copyright 2016, ArangoDB GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////
'use strict';

const expect = require('chai').expect;
const internal = require('internal');
const download = require('internal').download;
describe('Shard distribution', function () {
  afterEach(function() {
    internal.db._drop('satellite');
  });
  it('should be able to create a satellite collection', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite'});
    expect(internal.db._collection('satellite').properties()).to.have.property('replicationFactor', 'satellite');
  });

  it('should ignore any shard keys upon creation', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite', 'shardKeys': ['_key', 'hund']});
    expect(internal.db._collection('satellite').properties().shardKeys).to.have.lengthOf(1);
  });

  it('should ignore numberOfShards', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite', 'numberOfShards': 12});
    expect(internal.db._collection('satellite').properties().numberOfShards).to.be.equal(1);
  });
});
