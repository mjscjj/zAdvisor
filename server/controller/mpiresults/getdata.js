'use strict';

const db2 = require('../db2/db2pool');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let dsConfig = require('../../datasources.json');
// let ibmdb = require('../db2/db2poolmpi');
let pearrayapar = require('./PE/getpearrayapar.js');
let ddl = require('../../DDL.js');
let _ = require('lodash');
let pluck = require('lodash.pluck');
let openPePtfs = require('./PE/getopenPePtfs');
/**
 * @ignore  =====================================================================================
 * @file get data from db2 and initialize
 * @input:
 * release, subRelease (eg: A.1, release is 'A', subRelease is '1'), meplId
 * @output:
 * meplitem: get mepl from meplitems_a by meplid
 * relation: get the relationship of apar, module, ptf
 * hist: reorganized from relation map module and the other info got from the relation
 * installptfs: the mark of ptfs that is installed on the client
 * peArraySet: peArray from pe table
 * aparsSet: apars from apar table
 * hitmodule: the ptf is hit on those modules
 * meplModel: the map of module and ptfid
 * openPePtfs: get open Pe ptfs from db2
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let getdata = function(release, subRelease, meplId, callback) {
  let selectMeplitem = ddl.selectMeplitem;
  let selectRelation = ddl.selectRelation;
  let selectRelationbyPTF = ddl.selectRelationbyPTF;
  // console.log(meplId);
  db2.pool.open(db2.cn, function(err, conn) {
  // ibmdb.pool.open(connectStr, function(err, conn) {
    if (err) {
      console.log(err);
    } else {
      conn.query(selectMeplitem, [meplId], function(err, meplitem) {
        if (err) console.log(err);
        else {
          conn.close();
          console.log('done1');
        }
        ep.emit('sqlMepl', meplitem);
      });
    }
  });
  db2.pool.open(db2.cn, function(err, conn) {
  // ibmdb.pool.open(connectStr, function(err, conn) {
    if (err) {
      console.log(err);
    } else {
      conn.query(selectRelation, [release, subRelease], function(err, relation) {
        if (err) console.log(err);
        else {
          conn.close();
          console.log('done2');
        }
        ep.emit('sqlRelation', relation);
      });
    }
  });
  db2.pool.open(db2.cn, function(err, conn) {
  // ibmdb.pool.open(connectStr, function(err, conn) {
    if (err) {
      console.log(err);
      return;
    } else {
      conn.query(selectRelationbyPTF, [release, subRelease], function(err, hitManager) {
        if (err) console.log(err);
        else {
          conn.close();
          console.log('done3');
        }
        ep.emit('sqlRelationbyPTF', hitManager);
      });
    }
  });
  openPePtfs.getopenPePtfs(release, subRelease, function(openPePtfs) {
    console.log('done4');
    ep.emit('openPe', openPePtfs);
  });
  pearrayapar.getpearrayapar(release, subRelease, function(apars, peArray) {
    console.log('done5');
    let aparsPe = {};
    aparsPe.Apars = apars;
    aparsPe.PeArray = peArray;
    ep.emit('aparsPe', aparsPe);
  });
  ep.all('sqlMepl', 'sqlRelation', 'sqlRelationbyPTF', 'openPe', 'aparsPe', function(meplitem, relation, hitManager, openPePtfs, aparsPes) {
    let apars = aparsPes.Apars;
    let peArray = aparsPes.PeArray;
    let hist = [];
    _(relation).forEach(function(item) {
      hist[item.MODULE] = [];
    });
    _(relation).forEach(function(item) {
      let temp = {};
      temp.APARID = item.APARID;
      temp.PTFID = item.PTFID;
      temp.RANK = item.RANK;
      temp.TYPE = item.TYPE;
      temp.MODULE = item.MODULE;
      hist[item.MODULE].push(temp);
    });
    _(relation).forEach(function(item) {
      hist[item.MODULE] = _.uniqBy(hist[item.MODULE], function(obj) {
        return obj.APARID;
      });
    });
    let ptfid = pluck(meplitem, 'PTFID');
    let installptfs = [];
    _(ptfid).forEach(function(item) {
      installptfs[item] = true;
    });
    let peArraySet = [];
    let aparsSet = [];
    _(apars).forEach(function(aparsIdx) {
      let obj = {};
      obj.APARID = aparsIdx.APARID;
      obj.CLOSEDATE = aparsIdx.CLOSEDATE;
      obj.SEVERITY = aparsIdx.SEVERITY;
      obj.HIPER = aparsIdx.HIPER;
      obj.SUMMARY = aparsIdx.SUMMARY;
      aparsSet[aparsIdx.APARID] = obj;
    });
      // _(apars).forEach(function(aparsIdx) {
      //   aparsSet[aparsIdx.APARID] = _.uniq(aparsSet[aparsIdx.APARID]);
      // });
    _(peArray).forEach(function(peArrayIdx) {
      peArraySet[peArrayIdx.APARID] = [];
    });
    _(peArray).forEach(function(peArrayIdx) {
      peArraySet[peArrayIdx.APARID].push(peArrayIdx.PTFID);
    });
    _(peArray).forEach(function(peArrayIdx) {
      peArraySet[peArrayIdx.APARID] = _.uniq(peArraySet[peArrayIdx.APARID]);
    });
    let hitmodule = [];
    _(relation).forEach(function(item) {
      hitmodule[item.PTFID] = [];
    });
    _(hitManager).forEach(function(item) {
      let temp = {};
      temp.APARID = item.APARID;
      temp.PTFID = item.PTFID;
      temp.RANK = item.RANK;
      temp.TYPE = item.TYPE;
      temp.MODULE = item.MODULE;
      hitmodule[item.PTFID].push(temp);
    });
    _(hitManager).forEach(function(item) {
      hitmodule[item.PTFID] = _.uniqBy(hitmodule[item.PTFID], function(obj) {
        return obj.MODULE;
      });
    });
    let meplModel = [];
    _(meplitem).forEach(function(meplIdx) {
      meplModel[meplIdx.MODULE] = meplIdx.PTFID;
    });
    // console.log(peArray);
    callback(meplitem, relation, hist, installptfs, peArraySet, aparsSet, hitmodule, meplModel, openPePtfs);
  });
};
exports.getdata = getdata;
