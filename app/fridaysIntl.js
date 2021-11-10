module.exports = {
  fridaysIntl
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
