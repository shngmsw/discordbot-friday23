module.exports = {
  fridaysIntl,
  getWeekOfDay
};

function fridaysIntl(beginDate, endDate) {
  //開始と終了日付のタイムスタンプ
  var beginTime = beginDate.getTime();
  var endTime = endDate.getTime();
  //時間差を算出
  var diff = endTime - beginTime;
  //時間差をミリ秒単位を日単位に変換し（切り捨て）、1日分を加算
  var term = Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  //定休日となる曜日の設定
  var regularDayOff = [5];
  //一週間の定休日の数
  var lenDayOff = regularDayOff.length;
  //期間に入る週の数、7で割って切り捨てて算出する
  var weeks = Math.floor(term / 7);
  //週の数から、その期間の定休日の休日数を算出する
  var dayOffs = weeks * lenDayOff;
  //週の数に入らない余りの日数
  var remainderDays = term % 7;
  //余りの日の処理
  if (remainderDays > 0) {
    //余りの日がある場合、開始日付から余りの日数だけ曜日が定休日かの判定を行う
    //開始日付の曜日数値の取得
    var beginDay = beginDate.getDay(); //0~6の曜日数値
    for (var i = 0; i < remainderDays; i++) {
      //曜日数値に余りの日数を加算していき、7で割った余りの曜日数値が定休日の配列に含まれるか
      if (regularDayOff.indexOf((beginDay + i) % 7) != -1) {
        //定休日の配列に含まれる場合、休日数に加算する
        dayOffs++;
      }
    }
  }
  return dayOffs;
}

/**
 * year		int		求めたい日付の年を指定
 * month	int		求めたい日付の月を指定
 * week		int		第n週か。第1週なら1、第3週なら3を指定
 * day		int		求めたい曜日。0〜6までの数字で指定
 */
function getWeekOfDay(year, month, week, day) {
  // 1・指定した年月の最初の曜日を取得
  var date = new Date(year + "/" + month + "/1");
  var firstDay = date.getDay();

  // 2・求めたい曜日の第1週の日付けを計算する
  var day = day - firstDay + 1;
  if (day <= 0) day += 7;

  // 3・n週まで1週間を足す
  day += 7 * (week - 1);

  // 4・結果
  result = new Date(year + "/" + month + "/" + day);

  var Y = parseInt(result.getFullYear());
  var m = parseInt(result.getMonth());
  var d = parseInt(result.getDate());

  return new Date(Y, m, d);
}
