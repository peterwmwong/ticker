const MIN_MS  = 1000 * 60;
const HOUR_MS = MIN_MS * 60;
const DAY_MS  = HOUR_MS * 24;
const WEEK_MS  = DAY_MS * 7;

let timeAgoNow = Date.now();
// Update every 5 min
setInterval(
  ()=>timeAgoNow = Date.now(),
  MIN_MS * 5
);

export default function timeAgo(dateTime){
  const diffms = timeAgoNow - dateTime;
  return  diffms > WEEK_MS ? `${~~(diffms / WEEK_MS)}w`
        : diffms > DAY_MS  ? `${~~(diffms / DAY_MS)}d`
        : diffms > HOUR_MS ? `${~~(diffms / HOUR_MS)}h`
        : diffms > MIN_MS  ? `${~~(diffms / MIN_MS)}m`
        : '1m';
}


window.timeAgo = timeAgo;
