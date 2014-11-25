const MIN_MS     = 1000 * 60;
const HOUR_MS    = MIN_MS * 60;
const DAY_MS     = HOUR_MS * 24;

var timeAgoNow = Date.now();
setTimeout(function(){timeAgoNow = Date.now()}, MIN_MS*5);

export default function timeAgo(dateTime){
  var diffms = timeAgoNow - dateTime;
  return  diffms > DAY_MS  ? `${~~(diffms / DAY_MS)}d`
        : diffms > HOUR_MS ? `${~~(diffms / HOUR_MS)}h`
        : diffms > MIN_MS  ? `${~~(diffms / MIN_MS)}m`
        : '1m';
}

PolymerExpressions.prototype.timeAgo = timeAgo;
