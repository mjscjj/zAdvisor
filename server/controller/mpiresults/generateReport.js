'use strict';

// Include modules.
let xlsx = require('node-xlsx');
let fs = require('fs');
let _ = require('lodash');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();

// fs.writeFileSync('analysis.xlsx', buffer, {'flag': 'w'});
function report(hiper, peres, inconsistentres, release, subRelease, meplId, callback) {
  try {
    let data1 = [
      ['Missing Hipers'],
      ['APAR', 'PTF', 'Abstract', 'Closedate', 'Module', 'Sev'],
    ];

    let data2 = [
      ['PEs'],
      ['PTF ERR', 'APAR Fix', 'PTF Fix', 'Abstract (FIX)', 'Closedate (FIX)', 'Module', 'Sev'],
    ];

    let data3 = [
      ['Inconsistencies'],
      ['Module (Inconsistent)', 'PTF (Inconsistent)', 'PTF (Expected)', 'PTF (Evidence)', 'Module (Evidence)'],
    ];
    // console.log(hiper.length);
    _(hiper).forEach(function(dataIdx) {
      let array = [];
      array[0] = dataIdx.AparID;
      array[1] = dataIdx.PTFID;
      array[2] = dataIdx.Summary;
      array[3] = dataIdx.CloseDate;
      array[4] = dataIdx.Module;
      array[5] = dataIdx.Severity;
      data1.push(array);
    });

    _(peres).forEach(function(dataIdx) {
      let array = [];
      array[0] = dataIdx.PtfPe;
      array[1] = dataIdx.AparFixesArray;
      array[2] = dataIdx.PtfFix;
      array[3] = dataIdx.Summary;
      array[4] = dataIdx.CloseDate;
      array[5] = dataIdx.FirstModule;
      array[6] = dataIdx.Severity;
      data2.push(array);
    });

    _(inconsistentres).forEach(function(dataIdx) {
      let array = [];
      array[0] = dataIdx.Modulehit;
      array[1] = dataIdx.Ptfiderror;
      array[2] = dataIdx.Ptfidexpected;
      array[3] = dataIdx.Moduleevidence;
      array[4] = dataIdx.Ptfidmepl;
      data3.push(array);
    });

    let buffer = xlsx.build([
      {
        name: 'Missing Hipers',
        data: data1,
      },
      {
        name: 'PEs',
        data: data2,
      },
      {
        name: 'Inconsistencies',
        data: data3,
      },
    ]);
    fs.writeFileSync(__dirname + '/reports/' + meplId + release + subRelease +
      '.xlsx', buffer);
    callback(null, true);
  } catch (err) {
    callback(err);
  }
}
exports.report = report;
