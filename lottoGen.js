//Lotto Max global variables
let maxHistory, lm_genBtn, lm_genList, lm_under13, lm_zeros, lm_theRest, lm_genListDiv, lm_patternPick, lm_chosenList, lm_totalGenList, lm_missA10, lm_evenOdd, lm_cardPick;
let lm_mainCount = {
  '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0, '8':0, '9':0, '10':0,
  '11':0, '12':0, '13':0, '14':0, '15':0, '16':0, '17':0, '18':0, '19':0, '20':0,
  '21':0, '22':0, '23':0, '24':0, '25':0, '26':0, '27':0, '28':0, '29':0, '30':0,
  '31':0, '32':0, '33':0, '34':0, '35':0, '36':0, '37':0, '38':0, '39':0, '40':0,
  '41':0, '42':0, '43':0, '44':0, '45':0, '46':0, '47':0, '48':0, '49':0, '50':0
}
let lm_mainFreq = JSON.parse(JSON.stringify(lm_mainCount)); //this makes a deep copy
let lm_tempCount = JSON.parse(JSON.stringify(lm_mainCount));
let lm_patternCount = {'1-5-1':0, '1-6-0':0, '0-6-1':0};
let lm_evenCount = {'4/3':0, '3/4':0, '5/2':0};
let lm_miss10Count = {'Yes':0, 'No':0};

//Lotto 6/49 global variables
let history649, l6_genBtn, l6_genList, l6_under14, l6_zeros, l6_theRest, l6_genListDiv, l6_patternPick, l6_chosenList, l6_totalGenList, l6_missA10, l6_evenOdd, l6_cardPick;
let l6_mainCount = {
  '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0, '8':0, '9':0, '10':0,
  '11':0, '12':0, '13':0, '14':0, '15':0, '16':0, '17':0, '18':0, '19':0, '20':0,
  '21':0, '22':0, '23':0, '24':0, '25':0, '26':0, '27':0, '28':0, '29':0, '30':0,
  '31':0, '32':0, '33':0, '34':0, '35':0, '36':0, '37':0, '38':0, '39':0, '40':0,
  '41':0, '42':0, '43':0, '44':0, '45':0, '46':0, '47':0, '48':0, '49':0
}
let l6_mainFreq = JSON.parse(JSON.stringify(l6_mainCount)); //this makes a deep copy
let l6_tempCount = JSON.parse(JSON.stringify(l6_mainCount));
let l6_patternCount = {'1-4-1':0, '0-5-1':0, '1-5-0':0};
let l6_evenCount = {'3/3':0, '4/2':0, '2/4':0};
let l6_miss10Count = {'Yes':0, 'No':0};

//Daily Grand global variables
let dgHistory, dg_genBtn, dg_genList, dg_under7, dg_under15, dg_theRest, dg_genListDiv, dg_patternPick, dg_chosenList, dg_grandNumber, dg_totalGenList, dg_missA10, dg_evenOdd, dg_cardPick;
let grandCount = {
  '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0
};
let dg_mainCount = JSON.parse(JSON.stringify(l6_mainCount));
let dg_mainFreq = JSON.parse(JSON.stringify(l6_mainCount)); //this makes a deep copy
let grandFreq = JSON.parse(JSON.stringify(grandCount));
let dg_tempCount = JSON.parse(JSON.stringify(l6_mainCount));
let dg_patternCount = {'3-1-1':0, '3-0-2':0, '3-2-0':0};
let dg_evenCount = {'3/2':0, '4/1':0, '1/4':0};
let dg_miss10Count = {'Yes':0, 'No':0};

let lotteryCards = ["lottoMaxCard", "lotto649Card", "dailyGrandCard"];

window.onload = function() {

  lm_cardPick = document.getElementById("lm_cardPick");
  l6_cardPick = document.getElementById("l6_cardPick");
  dg_cardPick = document.getElementById("dg_cardPick");

  lm_cardPick.onclick = function() {
    lotteryChooser("lottoMaxCard");
  }

  l6_cardPick.onclick = function() {
    lotteryChooser("lotto649Card");
  }

  dg_cardPick.onclick = function() {
    lotteryChooser("dailyGrandCard");
  }

  lotteryChooser("lottoMaxCard");

  //ready();
  d3.queue()
      .defer(d3.json, 'LMHistory.json')
      .defer(d3.json, '649History.json')
      .defer(d3.json, 'DGHistory.json')
      .await(ready);
}

function lotteryChooser(lottoCard) {
  if (lottoCard == "lottoMaxCard") document.getElementById("lottoCardDropdown").innerHTML = "Lotto Max";
  else if (lottoCard == "lotto649Card") document.getElementById("lottoCardDropdown").innerHTML = "Lotto 6/49";
  else document.getElementById("lottoCardDropdown").innerHTML = "Daily Grand";

  for (var lotto of lotteryCards) {
    if (lotto == lottoCard) {
      console.log("showing " + lotto);
      document.getElementById(lotto).style.display = "flex";
    }
    else document.getElementById(lotto).style.display = "none";
  }
}

function ready(error, lmData, data649, dgData) {
  maxHistory = lmData.history;
  history649 = data649.history;
  dgHistory = dgData.history;

  console.log("LOTTO MAX PRE CALCULATIONS:");
  lm_preCalculations();
  genLMSequence();

  console.log("LOTTO 6/49 PRE CALCULATIONS:");
  l6_preCalculations();
  genL6Sequence();

  console.log("DAILY GRAND PRE CALCULATIONS:");
  dg_preCalculations();
  genDGSequence();
}

function lm_preCalculations() {
  lm_totalGenList = [];
  lm_chosenList = [];
  lm_genBtn = document.getElementById('lm_genButton');
  lm_genListDiv = document.getElementById('lm_genList');
  lm_patternPick = document.getElementById('lm_patternDrop');
  lm_missA10 = document.getElementById('lm_missA10Drop');
  lm_evenOdd = document.getElementById('lm_evenOddDrop');
  let lm_statsDiv = ['lm_240Pattern', 'lm_240EvenOdd', 'lm_240Miss10s', 'lm_dateStats'];
  let lm_seqChooserDiv = ['lm_zerosPool', 'lm_under13Pool', 'lm_theRestPool'];
  //checkBtn = document.getElementById('checkButton');

  maxHistory.reverse();
  lm_zeros = [];
  lm_under13 = [];
  lm_theRest = [];
  calc_overdue(maxHistory, lm_mainCount, lm_mainFreq, lm_zeros, lm_under13, lm_theRest, 1, 13, null, null);

  var lm_tempStats = [];
  calc_tempStats(maxHistory, lm_tempCount, lm_tempStats, 1, 13);
  let lm_conditionStats = calc_conditionFreq(lm_patternCount, lm_evenCount, lm_miss10Count, lm_tempStats, 7);

  console.log("LMax numbers with overdue of 0: ");
  console.log(lm_zeros);
  console.log(("LMax numbers with overdue of under 13: "));
  console.log(lm_under13);
  console.log("LMax numbers with overdue of 13 and above: ");
  console.log(lm_theRest);
  console.log("LMax main number overdue patterns by date: ");
  console.log(lm_tempStats.reverse());
  console.log("LMax pattern frequencies: ");
  console.log(lm_patternCount);
  console.log("LMax even/odd frequencies: ");
  console.log(lm_evenCount);
  console.log("LMax miss 10s frequencies: ");
  console.log(lm_miss10Count);

  fillSeqChooser(lm_zeros, lm_under13, lm_theRest, lm_seqChooserDiv, "lm");
  fillStatsDiv(lm_tempStats, lm_conditionStats, lm_miss10Count, lm_statsDiv);

  lm_genBtn.onclick = function() {
    genLMSequence();
  }
}

function genLMSequence() {
  lm_genList = [];
  let patternSeq = lm_patternPick.value.split("-");
  let evenOddSeq = lm_evenOdd.value.split("-");

  while (lm_genList.length < 5) {
    var newSeq = [];
    calc_newSeq(lm_zeros, lm_under13, lm_theRest, newSeq, patternSeq, 7, 50);

    //check odd-even ratio in newSeq
    var goodRatio = calc_evenOdd(newSeq, evenOddSeq);

    //check consecutive numbers in newSeq
    var noCons = true;
    if ((newSeq[3] - newSeq[2] === 1) && (newSeq[2] - newSeq[1] === 1) && (newSeq[1] - newSeq[0] === 1)) noCons = false;
    else if ((newSeq[4] - newSeq[3] === 1) && (newSeq[3] - newSeq[2] === 1) && (newSeq[2] - newSeq[1] === 1)) noCons = false;
    else if ((newSeq[5] - newSeq[4] === 1) && (newSeq[4] - newSeq[3] === 1) && (newSeq[3] - newSeq[2] === 1)) noCons = false;
    else if ((newSeq[6] - newSeq[5] === 1) && (newSeq[5] - newSeq[4] === 1) && (newSeq[4] - newSeq[3] === 1)) noCons = false;

    newSeq.sort(function(a, b){return a-b});

    //check if more than 3-4 numbers in newSeq have shown up before
    var goodRep = calc_goodRep(maxHistory, newSeq, 4);

    //check if numbers are in all 10s (eg. under 10, 10s, 20s, 30s, etc.)
    var condition10s = false;
    var missing10s = calc_missing10s(newSeq);

    var goodRep2 = calc_goodRep2(lm_totalGenList, newSeq, 4);

    //check condition10s according to user selection
    if ((lm_missA10.value == "Yes") && missing10s) condition10s = true;
    else if ((lm_missA10.value == "No") && !missing10s) condition10s = true;
    else if (lm_missA10.value == "Any") condition10s = true;

    //add newSeq to genList
    if (goodRatio && noCons && goodRep && goodRep2 && condition10s && !lm_genList.includes(newSeq) && !lm_totalGenList.includes(newSeq)) {
      lm_genList.push(newSeq);
      lm_totalGenList.push(newSeq);
    }
  }
  console.log("LMax number sequences generated: ");
  console.log(lm_genList);
  console.log("Total number of LMax sequences generated: " + lm_totalGenList.length);

  //display generated list
  lm_genListDiv.innerHTML = "";
  for (var el in lm_genList) {
    var seq = lm_genList[el];
    for (var num in seq) {
      lm_genListDiv.innerHTML += (" " + seq[num]);
    }
    lm_genListDiv.innerHTML += '<br>';
  }
}



function l6_preCalculations() {
  l6_totalGenList = [];
  l6_chosenList = [];
  l6_genBtn = document.getElementById('l6_genButton');
  l6_genListDiv = document.getElementById('l6_genList');
  l6_patternPick = document.getElementById('l6_patternDrop');
  l6_missA10 = document.getElementById('l6_missA10Drop');
  l6_evenOdd = document.getElementById('l6_evenOddDrop');
  let l6_statsDiv = ['l6_240Pattern', 'l6_240EvenOdd', 'l6_240Miss10s', 'l6_dateStats'];
  let l6_seqChooserDiv = ['l6_zerosPool', 'l6_under14Pool', 'l6_theRestPool'];

  history649.reverse();
  l6_zeros = [];
  l6_under14 = [];
  l6_theRest = [];
  calc_overdue(history649, l6_mainCount, l6_mainFreq, l6_zeros, l6_under14, l6_theRest, 1, 14, null, null);

  var l6_tempStats = [];
  calc_tempStats(history649, l6_tempCount, l6_tempStats, 1, 14);
  let l6_conditionStats = calc_conditionFreq(l6_patternCount, l6_evenCount, l6_miss10Count, l6_tempStats, 6);

  console.log("6/49 numbers with overdue of 0: ");
  console.log(l6_zeros);
  console.log(("6/49 numbers with overdue of under 14: "));
  console.log(l6_under14);
  console.log("6/49 numbers with overdue of 14 and above: ");
  console.log(l6_theRest);
  console.log("6/49 main number overdue patterns by date: ");
  console.log(l6_tempStats.reverse());
  console.log("6/49 pattern frequencies: ");
  console.log(l6_patternCount);
  console.log("6/49 even/odd frequencies: ");
  console.log(l6_evenCount);
  console.log("6/49 miss 10s frequencies: ");
  console.log(l6_miss10Count);

  fillSeqChooser(l6_zeros, l6_under14, l6_theRest, l6_seqChooserDiv, "l6");
  fillStatsDiv(l6_tempStats, l6_conditionStats, l6_miss10Count, l6_statsDiv);

  l6_genBtn.onclick = function() {
    genL6Sequence();
  }
}

function genL6Sequence() {
  l6_genList = [];
  let patternSeq = l6_patternPick.value.split("-");
  let evenOddSeq = l6_evenOdd.value.split("-");

  while (l6_genList.length < 5) {
    var newSeq = [];
    calc_newSeq(l6_zeros, l6_under14, l6_theRest, newSeq, patternSeq, 6, 49);

    //check odd-even ratio in newSeq
    var goodRatio = calc_evenOdd(newSeq, evenOddSeq);

    //check consecutive numbers in newSeq
    var noCons = true;
    if ((newSeq[3] - newSeq[2] === 1) && (newSeq[2] - newSeq[1] === 1) && (newSeq[1] - newSeq[0] === 1)) noCons = false;
    else if ((newSeq[4] - newSeq[3] === 1) && (newSeq[3] - newSeq[2] === 1) && (newSeq[2] - newSeq[1] === 1)) noCons = false;
    else if ((newSeq[5] - newSeq[4] === 1) && (newSeq[4] - newSeq[3] === 1) && (newSeq[3] - newSeq[2] === 1)) noCons = false;

    newSeq.sort(function(a, b){return a-b});

    //check if more than 3 numbers in newSeq have shown up before
    var goodRep = calc_goodRep(history649, newSeq, 4);

    //check if numbers are in all 10s (eg. under 10, 10s, 20s, 30s, etc.)
    var condition10s = false;
    var missing10s = calc_missing10s(newSeq);

    var goodRep2 = calc_goodRep2(l6_totalGenList, newSeq, 4);

    //check condition10s according to user selection
    if ((l6_missA10.value == "Yes") && missing10s) condition10s = true;
    else if ((l6_missA10.value == "No") && !missing10s) condition10s = true;
    else if (l6_missA10.value == "Any") condition10s = true;

    //add newSeq to genList
    if (goodRatio && noCons && goodRep && goodRep2 && condition10s && !l6_genList.includes(newSeq) && !l6_totalGenList.includes(newSeq)) {
      l6_genList.push(newSeq);
      l6_totalGenList.push(newSeq);
    }
  }
  console.log("6/49 sequences generated: ");
  console.log(l6_genList);
  console.log("Total number of 6/49 sequences generated: " + l6_totalGenList.length);

  //display generated list
  l6_genListDiv.innerHTML = "";
  for (var el in l6_genList) {
    var seq = l6_genList[el];
    for (var num in seq) {
      l6_genListDiv.innerHTML += (" " + seq[num]);
    }
    l6_genListDiv.innerHTML += '<br>';
  }
}



function dg_preCalculations() {
  dg_totalGenList = [];
  dg_chosenList = [];
  dg_grandNumber = "";
  dg_genBtn = document.getElementById('dg_genButton');
  dg_genListDiv = document.getElementById('dg_genList');
  dg_patternPick = document.getElementById('dg_patternDrop');
  dg_missA10 = document.getElementById('dg_missA10Drop');
  dg_evenOdd = document.getElementById('dg_evenOddDrop');
  genGrDiv = document.getElementById('genGrand');
  let dg_statsDiv = ['dg_240Pattern', 'dg_240EvenOdd', 'dg_240Miss10s', 'dg_dateStats'];
  let dg_seqChooserDiv = ['dg_under7Pool', 'dg_under15Pool', 'dg_theRestPool'];

  dgHistory.reverse();
  dg_under7 = [];
  dg_under15 = [];
  dg_theRest = [];
  calc_overdue(dgHistory, dg_mainCount, dg_mainFreq, dg_under7, dg_under15, dg_theRest, 7, 15, grandCount, grandFreq);

  var dg_tempStats = [];
  calc_tempStats(dgHistory, dg_tempCount, dg_tempStats, 7, 15);
  let dg_conditionStats = calc_conditionFreq(dg_patternCount, dg_evenCount, dg_miss10Count, dg_tempStats, 5);

  console.log("DG numbers with overdue of under 7: ");
  console.log(dg_under7);
  console.log(("DG numbers with overdue of under 15: "));
  console.log(dg_under15);
  console.log("DG numbers with overdue of 15 and above: ");
  console.log(dg_theRest);
  console.log("DG main number overdue statuses by date: ");
  console.log(dg_tempStats.reverse());
  console.log("DG pattern frequencies: ");
  console.log(dg_patternCount);
  console.log("DG even/odd frequencies: ");
  console.log(dg_evenCount);
  console.log("DG miss 10s frequencies: ");
  console.log(dg_miss10Count);

  fillSeqChooser(dg_under7, dg_under15, dg_theRest, dg_seqChooserDiv, "dg");
  fillStatsDiv(dg_tempStats, dg_conditionStats, dg_miss10Count, dg_statsDiv);

  //display grand numbers with 2 highest overdue status
  var grandNums = [];
  for (var el in grandCount) {
    grandNums.push(grandCount[el]);
  }
  grandNums.sort(function(a, b){return a-b});
  var grand1 = grandNums[6];
  var grand2 = grandNums[5];
  for (var el in grandCount) {
    if (grand1 === grandCount[el]) grand1 = el;
    else if (grand2 === grandCount[el]) grand2 = el;
  }
  genGrDiv.innerHTML = "GN: " + grand1 + " or " + grand2;
  dg_grandNumber = grand1;
  document.getElementById("btn-grand-dg-" + grand1).checked = true;

  dg_genBtn.onclick = function() {
    genDGSequence();
  }
}

function genDGSequence() {
  dg_genList = [];
  let patternSeq = dg_patternPick.value.split("-");
  let evenOddSeq = dg_evenOdd.value.split("-");

  while (dg_genList.length < 5) {
    var newSeq = [];
    calc_newSeq(dg_under7, dg_under15, dg_theRest, newSeq, patternSeq, 5, 49);

    //check odd-even ratio in newSeq
    var goodRatio = calc_evenOdd(newSeq, evenOddSeq);

    //check consecutive numbers in newSeq
    var noCons = true;
    if ((newSeq[3] - newSeq[2] === 1) && (newSeq[2] - newSeq[1] === 1) && (newSeq[1] - newSeq[0] === 1)) noCons = false;
    else if ((newSeq[4] - newSeq[3] === 1) && (newSeq[3] - newSeq[2] === 1) && (newSeq[2] - newSeq[1] === 1)) noCons = false;

    newSeq.sort(function(a, b){return a-b});

    //check if more than 3 numbers in newSeq have shown up before
    var goodRep = calc_goodRep(dgHistory, newSeq, 4);

    //check if numbers are in all 10s (eg. under 10, 10s, 20s, 30s, etc.)
    var condition10s = false;
    var missing10s = calc_missing10s(newSeq);

    //check condition10s according to user selection
    if ((dg_missA10.value == "Yes") && missing10s) condition10s = true;
    else if ((dg_missA10.value == "No") && !missing10s) condition10s = true;
    else if (dg_missA10.value == "Any") condition10s = true;

    var goodRep2 = calc_goodRep2(dg_totalGenList, newSeq, 3);

    //add newSeq to genList
    if (goodRatio && noCons && goodRep && goodRep2 && condition10s && !dg_genList.includes(newSeq) && !dg_totalGenList.includes(newSeq)) {
      dg_genList.push(newSeq);
      dg_totalGenList.push(newSeq);
    }
  }
  console.log("DG sequences generated: ");
  console.log(dg_genList);
  console.log("Total number of DG sequences generated: " + dg_totalGenList.length);

  //display generated list
  dg_genListDiv.innerHTML = "";
  for (var el in dg_genList) {
    var seq = dg_genList[el];
    for (var num in seq) {
      dg_genListDiv.innerHTML += (" " + seq[num]);
    }
    dg_genListDiv.innerHTML += '<br>';
  }
}



function calc_overdue(history, mainCount, mainFreq, zeros, mid, theRest, lowLimit, midLimit, grandCount, grandFreq) {
  //calculate number overdue status
  for (var i = 0; i < history.length; i++) {
    //main numbers
    var seq = history[i].main.split("-");
    if (seq.length === 1) seq = history[i].main.split(" ");
    for (var el in mainCount) {
      mainCount[el]++;
    }
    for (var j=0; j < seq.length; j++) {
      mainCount[seq[j]] = 0;
      mainFreq[seq[j]]++;
    }
    if (grandCount != null) {
      //grand numbers
      var gn = history[i].grand;
      for (var el in grandCount) {
        grandCount[el]++;
      }
      if (gn != '0') {
        grandCount[gn] = 0;
        grandFreq[gn]++;
      }
    }
  }
  //print number overdue status
  console.log("main number overdue status: ");
  console.log(mainCount);
  console.log("main numbers frequencies: ");
  console.log(mainFreq);
  if (grandCount != null) {
    console.log("grand number overdue status: ");
    console.log(grandCount);
    console.log("grand numbers frequencies: ");
    console.log(grandFreq);
  }

  for (var el in mainCount) {
    if (mainCount[el] < lowLimit) zeros.push(el);
    else if (mainCount[el] < midLimit) mid.push(el);
    else theRest.push(el);
  }
}

function calc_tempStats(history, tempCount, tempStats, lowLimit, midLimit) {
  var tempZeros = [];
  var tempMid = [];
  var tempRest = [];
  for (var k = (history.length - 840); k < history.length; k++) {
    var seq = history[k].main.split("-");
    if (seq.length === 1) seq = history[k].main.split(" ");
    var bonus = history[k].bonus;
    var bType = "B: ";
    if (seq.length == 5) {
      bonus = history[k].grand;
      bType = "G: ";
    }

    if (k > (history.length - 801)) {
      tempZeros = [];
      tempMid = [];
      tempRest = [];

      for (var el in tempCount) {
        if (tempCount[el] < lowLimit) tempZeros.push(el);
        else if (tempCount[el] < midLimit) tempMid.push(el);
        else tempRest.push(el);
      }
      var patternGroupA = 0;
      var patternGroupB = 0;
      var patternGroupC = 0;
      var seqEven = 0;
      for (var j = 0; j < seq.length; j++) {
        if (tempZeros.includes(seq[j])) patternGroupA++;
        else if (tempMid.includes(seq[j])) patternGroupB++;
        else patternGroupC++;
        if (seq[j] % 2 == 0) seqEven++;
      }
      var prize = "";
      if (history[k].prize !== undefined) { prize = history[k].prize }
      let newStat = {date: history[k].date, main: history[k].main, seqLength: seq.length, bonus: bonus, bType: bType, pattern: patternGroupA + "-" + patternGroupB + "-" + patternGroupC, even: seqEven, miss10s: calc_missing10s(seq), prize: prize};
      tempStats.push(newStat);
    }

    for (var el in tempCount) {
        tempCount[el]++;
    }
    for (var j=0; j < seq.length; j++) {
      tempCount[seq[j]] = 0;
    }
  }
}

function calc_conditionFreq(patternCount, evenCount, miss10Count, tempStats, lottoSeqSize) {
  for (var i = 0; i < tempStats.length; i++) {
    if (patternCount[tempStats[i].pattern] === undefined) {
      patternCount[tempStats[i].pattern] = 1;
    }
    else patternCount[tempStats[i].pattern]++;

    if (evenCount[tempStats[i].even + "/" + (lottoSeqSize - tempStats[i].even)] === undefined) {
      evenCount[tempStats[i].even + "/" + (lottoSeqSize - tempStats[i].even)] = 1;
    }
    else evenCount[tempStats[i].even + "/" + (lottoSeqSize - tempStats[i].even)]++;

    if (tempStats[i].miss10s) miss10Count['Yes']++;
    else miss10Count['No']++;
  }
  let sortedPattern = Object.entries(patternCount).sort((a,b) => b[1] - a[1]);
  let sortedEven = Object.entries(evenCount).sort((a,b) => b[1] - a[1]);
  return [sortedPattern, sortedEven];
}

function fillStatsDiv(tempStats, conditionStats, miss10Stats, statsDiv) {
  var patternString = "";
  var evenString = "";
  for (var i = 0; i < conditionStats[0].length; i++) {
    patternString += "<td class=\"tdMD\"><b>" + conditionStats[0][i][0] + ": </b>" + conditionStats[0][i][1] + "</td>";
  }
  for (i = 0; i < conditionStats[1].length; i++) {
    evenString += "<td class=\"tdMD\"><b>" + conditionStats[1][i][0] + ": </b>" + conditionStats[1][i][1] + "</td>";
  }
  document.getElementById(statsDiv[0]).innerHTML = patternString;
  document.getElementById(statsDiv[1]).innerHTML = evenString;
  document.getElementById(statsDiv[2]).innerHTML = "<td class=\"tdMD\"><b>Yes: </b>" + miss10Stats['Yes'] + "</td><td class=\"tdMD\"><b>No: </b>" + miss10Stats['No'] + "</td>";

  var divString = "";
  var evenRow = "";
  for (i = 0; i < 50; i++) {
    divString += "<tr class=\"statsRow" + evenRow + "\">";
    divString += "<td class=\"tdLG\"><b>Date: </b>" + tempStats[i].date + "</td>";
    divString += "<td class=\"tdLG\"><b>Numbers: </b>" + tempStats[i].main + "</td>";
    divString += "<td class=\"tdSM\"><b>" + tempStats[i].bType + "</b>" + tempStats[i].bonus + "</td>";
    divString += "<td class=\"tdMD\"><b>Pattern: </b>" + tempStats[i].pattern + "</td>";
    divString += "<td class=\"tdMD\"><b>Even/Odd: </b>" + tempStats[i].even + "/" + (tempStats[i].seqLength - tempStats[i].even) + "</td>";
    if (tempStats[i].miss10s) divString += "<td class=\"tdMD\"><b>Miss 10s: </b>Yes</td>";
    else divString += "<td class=\"tdMD\"><b>Miss 10s: </b>No</td>";
    divString += "<td class=\"tdMD\"><b>Prize: </b>" + tempStats[i].prize + "</td>";
    divString += "</tr>";
    if (evenRow == "") evenRow = " evenRow";
    else evenRow = "";
  }
  document.getElementById(statsDiv[3]).innerHTML = divString;
}

function fillSeqChooser(zeroPool, midPool, restPool, poolDiv, lotto) {
  var zeroString = "";
  var midString = "";
  var restString = "";
  var grandString = "";
  for (var i = 0; i < zeroPool.length; i++) {
    zeroString += "<td class=\"tdSM\"><input type=\"checkbox\" class=\"btn-check\" id=\"btn-check-" + lotto + "-" + zeroPool[i] + "\" autocomplete=\"off\" onclick=\"addChosenNumber('btn-check-" + lotto + "-" + zeroPool[i] + "')\">";
    zeroString += "<label class=\"btn btn-outline-dark chooserNum\" for=\"btn-check-" + lotto + "-" + zeroPool[i] + "\">" + zeroPool[i] + "</label></td>";
  }
  for (i = 0; i < midPool.length; i++) {
    midString += "<td class=\"tdSM\"><input type=\"checkbox\" class=\"btn-check\" id=\"btn-check-" + lotto + "-" + midPool[i] + "\" autocomplete=\"off\" onclick=\"addChosenNumber('btn-check-" + lotto + "-" + midPool[i] + "')\">";
    midString += "<label class=\"btn btn-outline-dark chooserNum\" for=\"btn-check-" + lotto + "-" + midPool[i] + "\">" + midPool[i] + "</label></td>";
  }
  for (i = 0; i < restPool.length; i++) {
    restString += "<td class=\"tdSM\"><input type=\"checkbox\" class=\"btn-check\" id=\"btn-check-" + lotto + "-" + restPool[i] + "\" autocomplete=\"off\" onclick=\"addChosenNumber('btn-check-" + lotto + "-" + restPool[i] + "')\">";
    restString += "<label class=\"btn btn-outline-dark chooserNum\" for=\"btn-check-" + lotto + "-" + restPool[i] + "\">" + restPool[i] + "</label></td>";
  }
  if (lotto == "dg") {
    for (i = 1; i < 8; i++) {
      grandString += "<td class=\"tdSM\"><input type=\"checkbox\" class=\"btn-check\" id=\"btn-grand-" + lotto + "-" + i + "\" autocomplete=\"off\" onclick=\"addChosenNumber('btn-grand-" + lotto + "-" + i + "')\">";
      grandString += "<label class=\"btn btn-outline-dark chooserNum\" for=\"btn-grand-" + lotto + "-" + i + "\">" + i + "</label></td>";
    }
    document.getElementById("dg_grandPool").innerHTML = grandString;
  }
  document.getElementById(poolDiv[0]).innerHTML = zeroString;
  document.getElementById(poolDiv[1]).innerHTML = midString;
  document.getElementById(poolDiv[2]).innerHTML = restString;
}

function addChosenNumber(numberID) {
  let numLotto = numberID.split('-')[2];
  let chosenNum = numberID.split('-')[3];
  let grandNum = numberID.split('-')[1];
  if (numLotto == "lm") {
    if (!lm_chosenList.includes(chosenNum) && lm_chosenList.length < 7) lm_chosenList.push(chosenNum);
    else if (!lm_chosenList.includes(chosenNum)) {
      document.getElementById(numberID).checked = false;
    }
    else {
      lm_chosenList.splice(lm_chosenList.indexOf(chosenNum), 1);
      document.getElementById(numberID).checked = false;
    }
    //console.log("Lotto Max chosen list: " + lm_chosenList);
  }
  else if (numLotto == "l6") {
    if (!l6_chosenList.includes(chosenNum) && l6_chosenList.length < 6) l6_chosenList.push(chosenNum);
    else if (!l6_chosenList.includes(chosenNum)) {
      document.getElementById(numberID).checked = false;
    }
    else {
      l6_chosenList.splice(l6_chosenList.indexOf(chosenNum), 1);
      document.getElementById(numberID).checked = false;
    }
    //console.log("Lotto 649 chosen list: " + l6_chosenList);
  }
  else {
    if (grandNum == "grand") {
      document.getElementById("btn-grand-dg-" + dg_grandNumber).checked = false;
      dg_grandNumber = chosenNum;
      document.getElementById(numberID).checked = true;
    }
    else {
      if (!dg_chosenList.includes(chosenNum) && dg_chosenList.length < 5) dg_chosenList.push(chosenNum);
      else if (!dg_chosenList.includes(chosenNum)) {
        document.getElementById(numberID).checked = false;
      }
      else {
        dg_chosenList.splice(dg_chosenList.indexOf(chosenNum), 1);
        document.getElementById(numberID).checked = false;
      }
    }
    //console.log("Daily Grand chosen list: " + dg_chosenList);
  }
}

function clearChosenSeq(lotto) {
  if (lotto == "lm") {
    lm_chosenList = [];
    document.getElementById('btn-check-lm-50').checked = false;
  }
  else if (lotto == "l6") {
    l6_chosenList = [];
  }
  else {
    dg_chosenList = [];
  }
  for (var i = 1; i < 50; i++) {
    document.getElementById('btn-check-' + lotto + '-' + i).checked = false;
  }
}

function genChosenSeq(lotto) {
  var patternA = 0;
  var patternB = 0;
  var patternC = 0;
  var even = 0;
  var numString = "<b>Numbers: </b>";
  var evenStr = "<b>Even/Odd: </b>";
  var editedStr = false;
  var miss10s = "Yes";
  if (lotto == "lm" && lm_chosenList.length == 7) {
    lm_chosenList.sort(function(a, b){return a-b});
    for (var i = 0; i < lm_chosenList.length; i++) {
      numString += lm_chosenList[i] + " ";
      if (lm_zeros.includes(lm_chosenList[i])) patternA++;
      else if (lm_under13.includes(lm_chosenList[i])) patternB++;
      else patternC++;
      if (lm_chosenList[i] % 2 === 0) even++;
    }
    evenStr += even + "/" + (lm_chosenList.length - even);
    if (!calc_missing10s(lm_chosenList)) miss10s = "No";
    editedStr = true;
    let prevMatchLM = calc_prevMatch("lm", maxHistory, lm_chosenList);
    prevMatchDisplay("lm", prevMatchLM);
  }
  else if (lotto == "l6" && l6_chosenList.length == 6) {
    l6_chosenList.sort(function(a, b){return a-b});
    for (var i = 0; i < l6_chosenList.length; i++) {
      numString += l6_chosenList[i] + " ";
      if (l6_zeros.includes(l6_chosenList[i])) patternA++;
      else if (l6_under14.includes(l6_chosenList[i])) patternB++;
      else patternC++;
      if (l6_chosenList[i] % 2 === 0) even++;
    }
    evenStr += even + "/" + (l6_chosenList.length - even);
    if (!calc_missing10s(l6_chosenList)) miss10s = "No";
    editedStr = true;
    let prevMatchL6 = calc_prevMatch("l6", history649, l6_chosenList);
    prevMatchDisplay("l6", prevMatchL6);
  }
  else if (lotto == "dg" && dg_chosenList.length == 5){
    dg_chosenList.sort(function(a, b){return a-b});
    for (var i = 0; i < dg_chosenList.length; i++) {
      numString += dg_chosenList[i] + " ";
      if (dg_under7.includes(dg_chosenList[i])) patternA++;
      else if (dg_under15.includes(dg_chosenList[i])) patternB++;
      else patternC++;
      if (dg_chosenList[i] % 2 === 0) even++;
    }
    numString += "<span style='margin-left:10px;'><b>G: </b>" + dg_grandNumber + "</span>";
    evenStr += even + "/" + (dg_chosenList.length - even);
    if (!calc_missing10s(dg_chosenList)) miss10s = "No";
    editedStr = true;
    let prevMatchDG = calc_prevMatch("dg", dgHistory, dg_chosenList);
    prevMatchDisplay("dg", prevMatchDG);
  }
  if (editedStr) {
    document.getElementById(lotto + "_resultNumbers").innerHTML = numString;
    document.getElementById(lotto + "_resultPattern").innerHTML = "<b>Pattern: </b>" + patternA + "-" + patternB + "-" + patternC;
    document.getElementById(lotto + "_resultEven").innerHTML = evenStr;
    document.getElementById(lotto + "_resultMiss10").innerHTML = "<b>Miss 10s: </b>" + miss10s;
  }
}

function calc_prevMatch(lotto, history, seqChosen) {
  var match4 = [];
  var match5 = [];
  var match6 = [];
  var match7 = [];
  for (var i = 0; i < history.length; i++) {
    var oldSeq = history[i].main.split("-");
    if (oldSeq.length === 1) oldSeq = history[i].main.split(" ");
    var repCount = 0;
    let bonus;
    var match = "";
    var bType = "B:";
    for (var j = 0; j < oldSeq.length; j++) {
      if (seqChosen.includes(oldSeq[j])) repCount++;
    }
    var match = repCount + "/" + seqChosen.length;
    if (lotto == "lm" || lotto == "l6") {
      if (seqChosen.includes(history[i].bonus)) match += " + B";
      bonus = history[i].bonus;
    }
    else {
      if (dg_grandNumber == history[i].grand) match += " + G";
      bonus = history[i].grand;
      bType = "G:";
    }
    let newMatch = {date: history[i].date, main: history[i].main, bonus: bonus, bType: bType, match: match};
    if (repCount == 4) {
      match4.push(newMatch);
    }
    else if (repCount == 5) {
      match5.push(newMatch);
    }
    else if (repCount == 6) {
      match6.push(newMatch);
    }
    else if (repCount == 7) {
      match7.push(newMatch);
    }
  }
  return [{match: "4", list: match4}, {match: "5", list: match5}, {match: "6", list: match6}, {match: "7", list: match7}];
}

function prevMatchDisplay(lotto, matches) {
  var prevMStr = "";
  for (var i = 0; i < matches.length; i++) {
    if (matches[i].list.length == 0) continue;
    var headStr = lotto + "-headingM" + matches[i].match;
    var idStr = lotto + "match" + matches[i].match;
    prevMStr += "<div class='accordion'>";
    prevMStr += "<div class='accordion-item'>";
    prevMStr += "<h2 class='accordion-header' id='" + headStr +"'>";
    prevMStr += "<button aria-controls='" + idStr + "' aria-expanded='true' class='accordion-button collapsed' data-bs-target='#" + idStr + "' data-bs-toggle='collapse'>";
    prevMStr += "<b style='color: #595959;'>Matched " + matches[i].match + ": " + matches[i].list.length + " times</b></button></h2>";
    prevMStr += "<div aria-labelledby='" + headStr + "' class='accordion-collapse collapse' id='" + idStr + "'>";
    prevMStr += "<div class='accordion-body'>";
    prevMStr += "<table class='table-borderless'>";
    prevMStr += "<tbody>";
    var evenRow = "";
    for (j = 0; j < matches[i].list.length; j++) {
      prevMStr += "<tr class=\"statsRow" + evenRow + "\">";
      prevMStr += "<td class=\"tdMD\"><b>Match: </b>" + matches[i].list[j].match + "</td>";
      prevMStr += "<td class=\"tdLG\"><b>Date: </b>" + matches[i].list[j].date + "</td>";
      prevMStr += "<td class=\"tdLG\"><b>Numbers: </b>" + matches[i].list[j].main + "</td>";
      prevMStr += "<td class=\"tdSM\"><b>" + matches[i].list[j].bType + " </b>" + matches[i].list[j].bonus + "</td>";
      prevMStr += "</tr>";
      if (evenRow == "") evenRow = " evenRow";
      else evenRow = "";
    }
    prevMStr += "</tbody></table></div></div></div></div>";
  }
  document.getElementById(lotto + "_prevMatches").innerHTML = prevMStr;
}

function calc_newSeq(zeros, mid, aboveMid, newSeq, patternSeq, seqLength, seqRange) {
  if (patternSeq.length > 1) {
    //add number with overdue status of 0
    for (i = 0; i < (+patternSeq[0]); i++) {
      var newNum = +zeros[Math.floor(Math.random() * zeros.length)];
      if (!newSeq.includes(newNum)) newSeq.push(newNum);
      else i--;
    }
    //add number with overdue status of under mid
    for (i = 0; i < (+patternSeq[1]); i++) {
      var newNum = +mid[Math.floor(Math.random() * mid.length)];
      if (!newSeq.includes(newNum)) newSeq.push(newNum);
      else i--;
    }
    //add number with overdue status of above mid
    for (i = 0; i < (+patternSeq[2]); i++) {
      var newNum = +aboveMid[Math.floor(Math.random() * aboveMid.length)];
      if (!newSeq.includes(newNum)) newSeq.push(newNum);
      else i--;
    }
  }
  else {
    for (i = 0; i < seqLength; i++) {
      var newNum = Math.floor(Math.random() * seqRange) + 1;
      if (!newSeq.includes(newNum)) newSeq.push(newNum);
      else i--;
    }
  }
}

function calc_evenOdd(newSeq, evenOddSeq) {
  if (evenOddSeq.length === 1) return true;
  var even = 0;
  for (var numVal in newSeq) {
    if (newSeq[numVal]%2 === 0) even++;
  }
  if (even === +evenOddSeq[0]) return true;
  return false;
}

function calc_goodRep(history, newSeq, repLimit) {
  var repLimitCount = 0;
  for (var i = 0; i < history.length; i++) {
    var oldSeq = history[i].main.split("-");
    if (oldSeq.length === 1) oldSeq = history[i].main.split(" ");
    var repCount = 0;
    for (var j=0; j < oldSeq.length; j++) {
      var seqNum = +oldSeq[j];
      if (newSeq.includes(seqNum)) repCount++;
    }
    if (repCount > repLimit) {
      return false;
    }
    //else if (repCount === 3) rep3Count++;
    else if (repCount === repLimit) {
      repLimitCount++;
      if (repLimitCount > 4) {
        return false;
      }
    }
  }
  return true;
}

function calc_goodRep2(totalGenList, newSeq, repLimit) {
  for (var i = 0; i < totalGenList.length; i++) {
    var repCount = 0;
    for (var j=0; j < totalGenList[i].length; j++) {
      if (newSeq.includes(totalGenList[i][j])) repCount++;
    }
    if (repCount > repLimit) {
      return false;
    }
  }
  return true;
}

function calc_missing10s(newSeq) {
  var inTheZeros = false;
  var inThe10s = false;
  var inThe20s = false;
  var inThe30s = false;
  var inThe40s = false; //includes 50
  for (var numVal in newSeq) {
    if (newSeq[numVal] < 10) inTheZeros = true;
    else if ((newSeq[numVal] > 9) && (newSeq[numVal] < 20)) inThe10s = true;
    else if ((newSeq[numVal] > 19) && (newSeq[numVal] < 30)) inThe20s = true;
    else if ((newSeq[numVal] > 29) && (newSeq[numVal] < 40)) inThe30s = true;
    else if ((newSeq[numVal] > 39) && (newSeq[numVal] < 51)) inThe40s = true;
  }
  if (inTheZeros && inThe10s && inThe20s && inThe30s && inThe40s) return false;
  return true;
}


//this code is to find sequences with up to 6 numbers that haven't shown up together
/*checkBtn.onclick = function() {

  for (var a = 1; a < 51; a++) {
    console.log(a);
    for (var b = a+1; b < 51; b++) {
      for (var c = b+1; c < 51; c++) {
        for (var d = c+1; d < 51; d++) {
          for (var e = d+1; e < 51; e++) {
            for (var f = e+1; f < 51; f++) {

                for (var i = 0; i < maxHistory.length; i++) {
                  //main numbers
                  var seq = maxHistory[i].main.split(" ");
                  var count = 0;
                  for (var j=0; j < seq.length; j++) {
                    var num = +seq[j];
                    if ((num === a) || (num === b) || (num === c) || (num === d) || (num === e) || (num === f)) count++;
                  }
                  if (count > 2) break;
                  else if (i === (maxHistory.length-1)) console.log("seq not shown before: " + a + " " + b + " " + c + " " + d + " " + e + " " + f);
                }

            }
          }
        }
      }
    }
  }

  let sumList = [];
  //calculate number frequencies sums
  for (var i = 0; i < maxHistory.length; i++) {
    //main numbers
    var seq = maxHistory[i].main.split(" ");
    var currentSum = 0;
    for (var j=0; j < seq.length; j++) {
      currentSum += +seq[j];
    }
    sumList.push(currentSum);
  }
  console.log(sumList);
  let average = (array) => array.reduce((a, b) => a + b) / array.length;
  console.log(Math.floor(average(sumList)));
}*/
