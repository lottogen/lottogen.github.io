//Lotto Max global variables
let maxHistory, lm_genBtn, lm_genList, lm_under13, lm_zeros, lm_theRest, lm_genListDiv, lm_patternPick, lm_totalGenList, lm_missA10, lm_evenOdd, lm_cardPick;
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
let history649, l6_genBtn, l6_genList, l6_under14, l6_zeros, l6_theRest, l6_genListDiv, l6_patternPick, l6_totalGenList, l6_missA10, l6_evenOdd, l6_cardPick;
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
let dgHistory, dg_genBtn, dg_genList, dg_under7, dg_under15, dg_theRest, dg_genListDiv, dg_patternPick, dg_totalGenList, dg_missA10, dg_evenOdd, dg_cardPick;
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
  lm_genBtn = document.getElementById('lm_genButton');
  lm_genListDiv = document.getElementById('lm_genList');
  lm_patternPick = document.getElementById('lm_patternDrop');
  lm_missA10 = document.getElementById('lm_missA10Drop');
  lm_evenOdd = document.getElementById('lm_evenOddDrop');
  let lm_statsDiv = ['lm_240Pattern', 'lm_240EvenOdd', 'lm_240Miss10s', 'lm_dateStats'];
  //checkBtn = document.getElementById('checkButton');

  maxHistory.reverse();
  lm_zeros = [];
  lm_under13 = [];
  lm_theRest = [];
  calc_overdue(maxHistory, lm_mainCount, lm_mainFreq, lm_zeros, lm_under13, lm_theRest, 1, 13, null, null);

  var lm_tempStats = [];
  calc_tempStats(maxHistory, lm_tempCount, lm_tempStats, 1, 13);
  let lm_conditionStats = calc_conditionFreq(lm_patternCount, lm_evenCount, lm_miss10Count, lm_tempStats, 7);

  console.log("numbers with overdue of 0: ");
  console.log(lm_zeros);
  console.log(("numbers with overdue of under 13: "));
  console.log(lm_under13);
  console.log("numbers with overdue of 13 and above: ");
  console.log(lm_theRest);
  console.log("main number overdue patterns by date: ");
  console.log(lm_tempStats.reverse());
  console.log("pattern frequencies: ");
  console.log(lm_patternCount);
  console.log("even/odd frequencies: ");
  console.log(lm_evenCount);
  console.log("miss 10s frequencies: ");
  console.log(lm_miss10Count);

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

    //check condition10s according to user selection
    if ((lm_missA10.value == "Yes") && missing10s) condition10s = true;
    else if ((lm_missA10.value == "No") && !missing10s) condition10s = true;
    else if (lm_missA10.value == "Any") condition10s = true;

    //add newSeq to genList
    if (goodRatio && noCons && goodRep && condition10s && !lm_genList.includes(newSeq) && !lm_totalGenList.includes(newSeq)) {
      lm_genList.push(newSeq);
      lm_totalGenList.push(newSeq);
    }
  }
  console.log("number sequences generated: ");
  console.log(lm_genList);

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
  l6_genBtn = document.getElementById('l6_genButton');
  l6_genListDiv = document.getElementById('l6_genList');
  l6_patternPick = document.getElementById('l6_patternDrop');
  l6_missA10 = document.getElementById('l6_missA10Drop');
  l6_evenOdd = document.getElementById('l6_evenOddDrop');
  let l6_statsDiv = ['l6_240Pattern', 'l6_240EvenOdd', 'l6_240Miss10s', 'l6_dateStats'];

  history649.reverse();
  l6_zeros = [];
  l6_under14 = [];
  l6_theRest = [];
  calc_overdue(history649, l6_mainCount, l6_mainFreq, l6_zeros, l6_under14, l6_theRest, 1, 14, null, null);

  var l6_tempStats = [];
  calc_tempStats(history649, l6_tempCount, l6_tempStats, 1, 14);
  let l6_conditionStats = calc_conditionFreq(l6_patternCount, l6_evenCount, l6_miss10Count, l6_tempStats, 6);

  console.log("numbers with overdue of 0: ");
  console.log(l6_zeros);
  console.log(("numbers with overdue of under 14: "));
  console.log(l6_under14);
  console.log("numbers with overdue of 14 and above: ");
  console.log(l6_theRest);
  console.log("main number overdue patterns by date: ");
  console.log(l6_tempStats.reverse());
  console.log("pattern frequencies: ");
  console.log(l6_patternCount);
  console.log("even/odd frequencies: ");
  console.log(l6_evenCount);
  console.log("miss 10s frequencies: ");
  console.log(l6_miss10Count);

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

    //check condition10s according to user selection
    if ((l6_missA10.value == "Yes") && missing10s) condition10s = true;
    else if ((l6_missA10.value == "No") && !missing10s) condition10s = true;
    else if (l6_missA10.value == "Any") condition10s = true;

    //add newSeq to genList
    if (goodRatio && noCons && goodRep && condition10s && !l6_genList.includes(newSeq) && !l6_totalGenList.includes(newSeq)) {
      l6_genList.push(newSeq);
      l6_totalGenList.push(newSeq);
    }
  }
  console.log("number sequences generated: ");
  console.log(l6_genList);

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
  dg_genBtn = document.getElementById('dg_genButton');
  dg_genListDiv = document.getElementById('dg_genList');
  dg_patternPick = document.getElementById('dg_patternDrop');
  dg_missA10 = document.getElementById('dg_missA10Drop');
  dg_evenOdd = document.getElementById('dg_evenOddDrop');
  genGrDiv = document.getElementById('genGrand');
  let dg_statsDiv = ['dg_240Pattern', 'dg_240EvenOdd', 'dg_240Miss10s', 'dg_dateStats'];

  dgHistory.reverse();
  dg_under7 = [];
  dg_under15 = [];
  dg_theRest = [];
  calc_overdue(dgHistory, dg_mainCount, dg_mainFreq, dg_under7, dg_under15, dg_theRest, 7, 15, grandCount, grandFreq);

  var dg_tempStats = [];
  calc_tempStats(dgHistory, dg_tempCount, dg_tempStats, 7, 15);
  let dg_conditionStats = calc_conditionFreq(dg_patternCount, dg_evenCount, dg_miss10Count, dg_tempStats, 5);

  console.log("numbers with overdue of under 7: ");
  console.log(dg_under7);
  console.log(("numbers with overdue of under 15: "));
  console.log(dg_under15);
  console.log("numbers with overdue of 15 and above: ");
  console.log(dg_theRest);
  console.log("main number overdue statuses by date: ");
  console.log(dg_tempStats.reverse());
  console.log("pattern frequencies: ");
  console.log(dg_patternCount);
  console.log("even/odd frequencies: ");
  console.log(dg_evenCount);
  console.log("miss 10s frequencies: ");
  console.log(dg_miss10Count);

  fillStatsDiv(dg_tempStats, dg_conditionStats, dg_miss10Count, dg_statsDiv);

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

    //add newSeq to genList
    if (goodRatio && noCons && goodRep && condition10s && !dg_genList.includes(newSeq) && !dg_totalGenList.includes(newSeq)) {
      dg_genList.push(newSeq);
      dg_totalGenList.push(newSeq);
    }
  }
  console.log("number sequences generated: ");
  console.log(dg_genList);

  //display generated list
  dg_genListDiv.innerHTML = "";
  for (var el in dg_genList) {
    var seq = dg_genList[el];
    for (var num in seq) {
      dg_genListDiv.innerHTML += (" " + seq[num]);
    }
    dg_genListDiv.innerHTML += '<br>';
  }

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
  for (var k = (history.length - 280); k < history.length; k++) {
    var seq = history[k].main.split("-");
    if (seq.length === 1) seq = history[k].main.split(" ");
    var bonus = history[k].bonus;
    var bType = "B: ";
    if (seq.length == 5) {
      bonus = history[k].grand;
      bType = "G: ";
    }

    if (k > (history.length - 241)) {
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
      let newStat = {date: history[k].date, main: history[k].main, seqLength: seq.length, bonus: bonus, bType: bType, pattern: patternGroupA + "-" + patternGroupB + "-" + patternGroupC, even: seqEven, miss10s: calc_missing10s(seq)};
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
  for (var i = 0; i < 5; i++) {
    patternString += "<td class=\"tdMD\"><b>" + conditionStats[0][i][0] + ": </b>" + conditionStats[0][i][1] + "</td>";
    evenString += "<td class=\"tdMD\"><b>" + conditionStats[1][i][0] + ": </b>" + conditionStats[1][i][1] + "</td>";
  }
  document.getElementById(statsDiv[0]).innerHTML = patternString;
  document.getElementById(statsDiv[1]).innerHTML = evenString;
  document.getElementById(statsDiv[2]).innerHTML = "<td class=\"tdMD\"><b>Yes: </b>" + miss10Stats['Yes'] + "</td><td class=\"tdMD\"><b>No: </b>" + miss10Stats['No'] + "</td>";

  var divString = "";
  var evenRow = "";
  for (i = 0; i < 30; i++) {
    divString += "<tr class=\"statsRow" + evenRow + "\">";
    divString += "<td class=\"tdLG\"><b>Date: </b>" + tempStats[i].date + "</td>";
    divString += "<td class=\"tdLG\"><b>Numbers: </b>" + tempStats[i].main + "</td>";
    divString += "<td class=\"tdSM\"><b>" + tempStats[i].bType + "</b>" + tempStats[i].bonus + "</td>";
    divString += "<td class=\"tdMD\"><b>Pattern: </b>" + tempStats[i].pattern + "</td>";
    divString += "<td class=\"tdMD\"><b>Even/Odd: </b>" + tempStats[i].even + "/" + (tempStats[i].seqLength - tempStats[i].even) + "</td>";
    if (tempStats[i].miss10s) divString += "<td class=\"tdMD\"><b>Miss 10s: </b>Yes</td>";
    else divString += "<td class=\"tdMD\"><b>Miss 10s: </b>No</td>";
    divString += "</tr>";
    if (evenRow == "") evenRow = " evenRow";
    else evenRow = "";
  }
  document.getElementById(statsDiv[3]).innerHTML = divString;
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
