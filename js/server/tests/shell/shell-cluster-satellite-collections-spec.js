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
  before(function() {
    internal.db._create('nonsatellite');
    internal.db._create('nonsatellite2');
  });
  after(function() {
    internal.db._drop('nonsatellite');
    internal.db._drop('nonsatellite2');
  });
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

  it('should optimize queries with a satellite as start collection', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite'});
    let explanation = internal.db._createStatement('FOR doc in satellite FOR doc2 in nonsatellite RETURN doc').explain().plan;
    expect(explanation.nodes.filter(node => node.type == 'RemoteNode')).to.have.lengthOf(1);
    expect(explanation.nodes.filter(node => node.type == 'GatherNode')).to.have.lengthOf(1);
    expect(explanation.rules).to.include('remove-satellite-joins');
  });

  it('should optimize queries with a satellite as end collection', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite'});
    let explanation = internal.db._createStatement('FOR doc in satellite FOR doc2 in nonsatellite RETURN doc').explain().plan;
    expect(explanation.nodes.filter(node => node.type == 'RemoteNode')).to.have.lengthOf(1);
    expect(explanation.nodes.filter(node => node.type == 'GatherNode')).to.have.lengthOf(1);
    expect(explanation.rules).to.include('remove-satellite-joins');
  });

  it('should not optimize queries without a satellite collection', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite'});
    let explanation = internal.db._createStatement('FOR doc in nonsatellite FOR doc2 in nonsatellite2 RETURN doc').explain().plan;
    expect(explanation.nodes.filter(node => node.type == 'RemoteNode')).to.have.lengthOf(3);
    expect(explanation.nodes.filter(node => node.type == 'GatherNode')).to.have.lengthOf(2);
    expect(explanation.rules).not.to.include('remove-satellite-joins');
  });

  it('should optimize queries with a satellite collection and a filter', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite'});
    let explanation = internal.db._createStatement('FOR doc in nonsatellite FOR doc2 in nonsatellite2 FILTER doc2.hund==2 RETURN doc').explain().plan;
    expect(explanation.nodes.filter(node => node.type == 'RemoteNode')).to.have.lengthOf(3);
    expect(explanation.nodes.filter(node => node.type == 'GatherNode')).to.have.lengthOf(2);
    expect(explanation.nodes.filter(node => node.type == 'CalculationNode')).to.have.lengthOf(1);
    expect(explanation.nodes.filter(node => node.type == 'FilterNode')).to.have.lengthOf(1);
    expect(explanation.rules).not.to.include('remove-satellite-joins');
  });

  it('should not optimize out a second non satellite join', function() {
    internal.db._create('satellite', {'replicationFactor': 'satellite'});
    let explanation = internal.db._createStatement('FOR doc in nonsatellite FOR doc2 in satellite FOR doc3 in nonsatellite2 RETURN doc').explain().plan;
    expect(explanation.nodes.filter(node => node.type == 'RemoteNode')).to.have.lengthOf(3);
    expect(explanation.nodes.filter(node => node.type == 'GatherNode')).to.have.lengthOf(2);
    expect(explanation.rules).to.include('remove-satellite-joins');
  });
});
