var denom = [
  { name: 'ONE HUNDRED', value: 100.00},
  { name: 'TWENTY', value: 20.00},
  { name: 'TEN', value: 10.00},
  { name: 'FIVE', value: 5.00},
  { name: 'ONE', value: 1.00},
  { name: 'QUARTER', value: 0.25},
  { name: 'DIME', value: 0.10},
  { name: 'NICKEL', value: 0.05},
  { name: 'PENNY', value: 0.01}
];

function checkCashRegister(price, cash, cid) {
  var output = { status: null, change: [] };
  var change = cash - price;

  // Create drawer object
  var register = cid.reduce(function(acc, currency) {
    acc.total += currency[1];
    acc[currency[0]] = currency[1];
    return acc;
  }, { total: 0 });

  // Exact change
  if (register.total === change) {
    output.status = "CLOSED";
    output.change = cid;
    return output;
  }

  // Handle obvious insufficient funds
  if (register.total < change) {
    output.status = "INSUFFICIENT_FUNDS";
    return output;
  }

  // Iterate denomination array
  var change_arr = denom.reduce(function(acc, currency) {
    var value = 0;
    while (register[currency.name] > 0 && change >= currency.value) {
      change -= currency.value;
      register[currency.name] -= currency.value;
      value += currency.value;

      // Precision error handling
      change = Math.round(change * 100) / 100;
    }

    if (value > 0) {
        acc.push([ currency.name, value ]);
    }
    return acc;
  }, []);

  // If funds are insufficient
  if (change_arr.length < 1 || change > 0) {
    output.status = "INSUFFICIENT_FUNDS";
    return output;
  }

  // Change to return
  output.status = "OPEN";
  output.change = change_arr;
  return output;
}

// test
checkCashRegister(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]);