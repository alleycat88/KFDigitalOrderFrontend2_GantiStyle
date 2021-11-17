export async function getProducts(
  searchKey = '',
  page = 1,
  ascending = true,
  minPrice = 0,
  maxPrice = 0,
  order = ''
) {
  const req = await fetch(
    'https://digitalorderbackend.sprintmanager.id/api/Product' +
      '?' +
      (searchKey != '' ? 'key=' + searchKey + '&' : null) +
      ('page=' + page + '&') +
      ('ascending=' + ascending + '&') +
      (minPrice != 0 ? 'minPrice=' + minPrice + '&' : null) +
      (maxPrice != 0 ? 'maxPrice=' + maxPrice + '&' : null) +
      (order != '' ? 'order=' + order : null)
  );
  const data = await req.json();
  console.log(data);
  return data.data;

  // this.setState({isOngoingOrderLoading: true, isOngoingOrderError: false, isOngoingOrderEmpty: false});
  // $.ajax({
  //     type: "GET",
  //     url: "https://digitalorderbackend.sprintmanager.id/api/Product",
  //     contentType: "application/json; charset=utf-8",
  //     complete: function(){
  //         // this.setState({isOngoingOrderLoading: false});
  //     }.bind(this),
  //     success: function(res) {
  //         res = JSON.parse(res);
  //         var data = res.data;
  //         console.log(res);
  //         if(res.success){
  //             // if(res.data && res.data.length < 1) this.setState({isOngoingOrderEmpty: true});
  //             // else{
  //                 // this.setState({_data_ongoingOrders: res.data, _data_ongoingOrdersTotal: res.totalData});
  //                 return JSON.stringify(data);
  //             // }
  //         }else{
  //             // this.setState({isOngoingOrderError: true});
  //             // showFloatingNotif("Gagal Mengambil Pesanan Berjalan : " + res.message, "red");
  //             // if(res.message.toLowerCase().includes(("Session Tidak Valid").toLowerCase())) window.sessionManager.logOut();
  //         }
  //     }.bind(this),
  //     error: function (jqXHR, status, err) {
  //         // this.setState({isOngoingOrderError: true});
  //         console.log("ERROR. status : "+status+". error : "+err);
  //         // showFloatingNotif("Gagal Mengambil Pesanan Berjalan : " + err, "red");
  //     }.bind(this)
  // });
}

// export async function getProducts() {
//   if (
//     !(
//       process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL &&
//       process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
//       process.env.GOOGLE_SPREADSHEET_ID_PRODUCT
//     )
//   ) {
//     throw new Error(
//       "GOOGLE credentials must be set as env vars `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` ,`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` and `GOOGLE_SPREADSHEET_ID_PRODUCT`."
//     );
//   }
//   const { GoogleSpreadsheet } = require("google-spreadsheet");
//   const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID_PRODUCT);
//   await doc.useServiceAccountAuth({
//     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
//       /\\n/gm,
//       "\n"
//     ),
//   });
//   await doc.loadInfo(); // loads document properties and worksheets
//   const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
//   // read rows
//   const rows = await sheet.getRows(); // can pass in { limit, offset }
//   const products = rows?.map(({ _sheet, _rowNumber, _rawData, ...fields }) => ({
//     ...fields,
//   }));
//   return JSON.parse(JSON.stringify(products));
// }
