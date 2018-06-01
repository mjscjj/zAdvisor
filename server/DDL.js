'use strict';

let selectOpenPe = 'select a.aparid, p.ptfid, a.severity,' +
  ' a.hiper, a.closedate, a.summary' +
  ' from apars_a a, pe_a pe, ptfs_a p' +
  ' where a.closedate is null' +
  ' AND a.aparid = pe.aparid' +
  ' and p.ptfid = pe.ptfid' +
  ' and p.release = ?' +
  ' and p.subrelease = ?';
let selectPes = 'select pe_a.ptfid, pe_a.aparid from pe_a, ptfs_a' +
  ' where ptfs_a.ptfid = pe_a.ptfid' +
  ' AND ptfs_a.release = ?' +
  ' AND ptfs_a.subrelease = ?' +
  ' order by pe_a.ptfid asc';
let selectPesopen = 'select pe_a.ptfid from pe_a, ptfs_a' +
  ' where pe_a.aparid = ?' +
  ' AND ptfs_a.ptfid = pe_a.ptfid' +
  ' AND ptfs_a.release = ?' +
  ' AND ptfs_a.subrelease = ?' +
  ' order by pe_a.ptfid asc';
let selectMeplitem = 'select module, ldmod, ptfid from meplitems_a' +
  ' where meplid = ?' +
  ' order by module ';
let selectRelation = 'select module, aparid, ptfid, rank, type' +
  ' from relations_a where release = ?' +
  ' and subrelease = ?' +
  ' and type = 2' +
  ' order by module asc, rank asc ';
let selectRelationbyPTF = 'select ptfid, module, aparid, rank, type' +
  ' from relations_a where release = ?' +
  ' and subrelease = ?' +
  ' and type = 2' +
  ' order by ptfid asc, module asc, rank asc ';
let historybyModule = 'select aparid, ptfid, rank, type' +
  ' from relations_a where release = ?' +
  ' and subrelease = ?' +
  ' and type = 2' +
  ' and module = ?' +
  ' order by module asc, rank asc';
let selectaparptfitem = 'select distinct(a.aparid), a.severity,' +
  ' a.closedate, a.hiper, a.summary, a.aparid' +
  ' from apars_a a';
let selectReleaseSub = 'select * ' +
  ' from mepls_a ' +
  ' where meplid = ?';
let insertComment = 'insert into reportComments_a ' +
  ' (MEPLID, COMMENT, ISDELETED) values (?, ?, ?)';
let updateComment = 'update reportComments_a set COMMENT = ? ' +
  ' where COMMENTID = ?';
let selectComment = 'select * from reportComments_a where meplid = ?';
let deleteComment = 'update reportComments_a set ISDELETED = 1 ' +
  ' where COMMENTID = ?';
let selectAnalysisData = 'select * from PERFORMANCEANALYSIS_A ';
let insertAnalysisData = 'insert into PERFORMANCEANALYSIS_A ' +
  ' (USERID, USERTIME, USERAREA, USERFUNCTION, LOCALTIME) ' +
  ' values (?, ?, ?, ?, ?)';
exports.selectOpenPe = selectOpenPe;
exports.selectPes = selectPes;
exports.selectMeplitem = selectMeplitem;
exports.selectRelation = selectRelation;
exports.selectRelationbyPTF = selectRelationbyPTF;
exports.historybyModule = historybyModule;
exports.selectaparptfitem = selectaparptfitem;
exports.selectPesopen = selectPesopen;
exports.selectReleaseSub = selectReleaseSub;
exports.insertComment = insertComment;
exports.updateComment = updateComment;
exports.selectComment = selectComment;
exports.deleteComment = deleteComment;
exports.selectAnalysisData = selectAnalysisData;
exports.insertAnalysisData = insertAnalysisData;
