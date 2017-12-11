const { reduce, keys, last } = require('lodash');
const csv=require('csvtojson');
const talib = require('talib');
const headers = {
  exchange: 'string',
  market: 'string',
  open: [],
  high: [],
  low: [],
  close: [],
  volume: [],
  time_start: [],
  time_end: [],
};

let res = { ...headers };

const startingBalance = (10000 / 16500);
const percentRisk = 1;
console.log(startingBalance)

async function calculateUnit(n) {
  const equityPerUnit = startingBalance * (1/100);
  const assumedRisk = 2 * n; // instrument volatility
  const unitSize = equityPerUnit / assumedRisk;
  return Promise.resolve(unitSize);
}

csv({
  noheader: false,
  headers: keys(headers),
  delimiter: '\t',

})
  .fromFile('./sample-hourly.csv')
  .on('csv', ([exchange, market, open, high, low, close, volume, time_start, time_end]) => {
    res.exchange = exchange;
    res.market = market;
    res.open.push(open)
    res.high.push(high)
    res.low.push(low)
    res.close.push(close)
    res.volume.push(volume)
    res.time_start.push(time_start)
    res.time_end.push(time_end)

  })
  .on('json', d => {
    // console.log(d);
  })
  .on('done', e => {

    talib.execute({
      name: 'ATR',
      optInTimePeriod: 20,
      startIdx: 0,
      endIdx: res.close.length - 1,
      high: res.high,
      low: res.low,
      close: res.close
    }, (err, result) => {
      if (err) {
        console.warn(err)
      }
      const n = last(result.result.outReal)
      console.log('Average True Range) N ', n)
      console.log('UnitSize', calculateUnit(n))
    })

    talib.execute({
      name: 'MAX',
      startIdx: 0,
      endIdx: res.high.length - 1,
      optInTimePeriod: 20,
      inReal: res.high
    }, (err, result) => {
      if (err) {
        console.warn(err);
      }
      console.log('20 Day Max', last(result.result.outReal))
    })
  })
