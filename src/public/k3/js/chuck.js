socket.on("data-server-k3", function (msg) {
  if (msg) {
    let checkData = GAME_TYPE;
    if (checkData == msg.game) {
      pageno = 0;
      limit = 10;
      page = 1;
      let notResult = msg.data[0];
      let Result = msg.data[1];
      let check = $("#number_result").attr("data-select");
      reload_money();
      initGameHistoryTab();
      initMyBets();
      RenderResult(Result.result);
      handleMyEmerdList();
      $("#period").text(notResult.period);
      // $("#previous").addClass("block-click")
      // $("#previous").removeClass("action")
      // $("#previous .van-icon-arrow").css("color", "#7f7f7f")
      // $("#next").removeClass("block-click")
      // $("#next").addClass("action")
      // $("#next .van-icon-arrow").css("color", "#fff")
    }
  }
});

function ShowGameHistory(list_orders) {
  let htmlContent;

  if (list_orders.length == 0) {
    htmlContent = `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">No data</p>
            </div>
            `;
  } else {
    htmlContent = list_orders
      .map((list_orders) => {
        let total = String(list_orders.result).split("");

        const total2 = total.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );

        const diceStatusContent = total
          .map((item) => {
            return `<div data-v-03b808c2="" class="li img${item}"></div>`;
          })
          .join(" ");

        return `
            <div data-v-03b808c2="" class="c-tc item van-row">
                <div data-v-03b808c2="" class="van-col van-col--6">
                    <div data-v-03b808c2="" class="c-tc goItem lh">${list_orders.period}</div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--4">
                    <div data-v-03b808c2="" class="c-tc goItem lh"> ${total2} </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="c-tc goItem lh">
                        <div data-v-03b808c2="">${total2 >= 3 && total2 <= 10 ? "Small" : "Big"}</div>
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--4">
                    <div data-v-03b808c2="" class="c-tc goItem lh">
                        <div data-v-03b808c2="">${total2 % 2 == 0 ? "Even" : "Odd"}</div>
                    </div>
                </div>
                <div data-v-03b808c2="" class="van-col van-col--5">
                    <div data-v-03b808c2="" class="goItem c-row c-tc c-row-between c-row-middle">
                        ${diceStatusContent}
                    </div>
                </div>
            </div>
        `;
      })
      .join(" ");
  }
  $(`#list_order`).empty();
  $(`#list_order`).html(htmlContent);
}

function ShowMyBets(list_orders) {
  let htmlContent;

  if (list_orders.length == 0) {
    htmlContent = `
         <div data-v-a9660e98="" class="van-empty">
             <div class="van-empty__image">
                 <img src="/images/empty-image-default.png" />
             </div>
             <p class="van-empty__description">No Data</p>
         </div>
      `;
  }

  htmlContent = list_orders
    .map((item) => {
      return `
         <div data-v-03b808c2="" class="item c-row">
             <div data-v-03b808c2="" class="c-row c-row-between c-row-middle info">
                 <div data-v-03b808c2="">
                     <div data-v-03b808c2="" class="issueName">
                         ${item.stage}
                         <!---->
                         <span data-v-03b808c2="" class="state ${item.status == 1 ? "green" : "red"} ${item.status == 0 ? "d-none" : ""}">${item.status == 1 ? "Success" : "Failed"}</span>
                     </div>
                     <div data-v-03b808c2="" class="tiem">${timerJoin(item.time)}</div>
                 </div>
                 <div data-v-03b808c2="" class="money ${item.status == 0 ? "d-none" : ""}">
                     <!---->
                     <span data-v-03b808c2="" class="${item.status == 1 ? "Success" : "Failed"}"> ${item.status == 1 ? "+" : "-"}${item.status == 1 ? item.get : item.price}.00 </span>
                 </div>
             </div>
         </div>
      `;
    })
    .join(" ");

  $(`#my_bets__root`).empty();
  $(`#my_bets__root`).html(htmlContent);
}

function handleMyEmerdList() {
  $.ajax({
    type: "POST",
    url: "/api/webapi/k3/GetMyEmerdList",
    data: {
      gameJoin: GAME_TYPE,
      pageno: "0",
      pageto: "10",
    },
    dataType: "json",
    success: function (response) {
      let data = response.data.gameslist;
      $("#number_result").text("1/" + response.page);
      // ShowMyBets(data)
      $(".Loading").fadeOut(0);

      let lastGame = data[0];

      const STATUS_MAP = {
        WIN: "win",
        LOSS: "loss",
        NONE: "none",
      };

      const displayResultHandler = ({ status, amount, period, result }) => {
        let modal = document.getElementById("result_modal");
        // let modalAmount = document.getElementById("modal_amount")

        modal.classList.add("open");

        let total = String(result).split("");
        const diceStatusContent = total
          .map((item) => {
            return `<div data-v-03b808c2="" class="popup_result_img img${item}"></div>`;
          })
          .join(" ");
        // $(".modal-result_img").attr("src", `/images/number_${result}.png`)
        $(".modal-popup__result").html(diceStatusContent);
        //diceStatusContent
        $(".modal-popup__period").text(period);
        if (status === STATUS_MAP.WIN) {
          $(".modal-popup__title").text("Congratulations");
          $(".modal-popup__amount").text(`₹ ${amount}`);
        } else if (status === STATUS_MAP.LOSS) {
          $(".modal-popup__title").text("So Said");
          $(".modal-popup__amount").text(`₹ -${amount}`);
        } else {
          $(".modal-popup__title").text("Result");
          $(".modal-popup__amount").text(`No Bets !`);
        }

        setTimeout(() => {
          modal.classList.remove("open");
        }, 5000);
      };

      // Nested AJAX call
      $.ajax({
        type: "POST",
        url: "/api/webapi/k3/GetNoaverageEmerdList",
        data: {
          gameJoin: GAME_TYPE,
          pageno: "0",
          pageto: "10",
        },
        dataType: "json",
        success: function (response) {
          let list_orders = response.data.gameslist;

          // Assuming firstGame is defined somewhere in your code
          if (lastGame && lastGame.stage === list_orders[0].period) {
            if (lastGame.get == 0) {
              displayResultHandler({
                status: STATUS_MAP.LOSS,
                amount: lastGame.money,
                period: list_orders[0].period,
                result: list_orders[0].result,
              });
            } else {
              displayResultHandler({
                status: STATUS_MAP.WIN,
                amount: lastGame.get,
                period: list_orders[0].period,
                result: list_orders[0].result,
              });
            }
          } else {
            displayResultHandler({
              status: STATUS_MAP.NONE,
              period: list_orders[0].period,
              result: list_orders[0].result,
            });
          }
        },
      });
    },
  });
}

var pageno = 0;
var limit = 10;
var page = 1;
// $("#next").click(function (e) {
//    e.preventDefault()
//    let check = $("#number_result").attr("data-select")
//    $(".Loading").fadeIn(0)
//    $("#previous").removeClass("block-click")
//    $("#previous").addClass("action")
//    $("#previous .van-icon-arrow-left").css("color", "#fff")
//    pageno += 10
//    let pageto = limit
//    let url = ""
//    if (check == "all") {
//       url = "/api/webapi/k3/GetNoaverageEmerdList"
//    } else {
//       url = "/api/webapi/k3/GetMyEmerdList"
//    }
//    $.ajax({
//       type: "POST",
//       url: url,
//       data: {
//          gameJoin: GAME_TYPE,
//          pageno: pageno,
//          pageto: pageto,
//       },
//       dataType: "json",
//       success: async function (response) {
//          $(".Loading").fadeOut(0)
//          if (response.status === false) {
//             pageno -= 10
//             $("#next").addClass("block-click")
//             $("#next").removeClass("action")
//             $("#next .van-icon-arrow").css("color", "#7f7f7f")
//             alertMess(response.msg)
//             return false
//          }
//          let list_orders = response.data.gameslist
//          $("#period").text(response.period)
//          $("#number_result").text(++page + "/" + response.page)
//          if (check == "all") {
//             ShowGameHistory(list_orders)
//          } else {
//             ShowMyBets(list_orders)
//          }
//       },
//    })
// })
// $("#previous").click(function (e) {
//    e.preventDefault()
//    let check = $("#number_result").attr("data-select")
//    $(".Loading").fadeIn(0)
//    $("#next").removeClass("block-click")
//    $("#next").addClass("action")
//    $("#next .van-icon-arrow").css("color", "#fff")
//    pageno -= 10
//    let pageto = limit
//    let url = ""
//    if (check == "all") {
//       url = "/api/webapi/k3/GetNoaverageEmerdList"
//    } else {
//       url = "/api/webapi/k3/GetMyEmerdList"
//    }
//    $.ajax({
//       type: "POST",
//       url: url,
//       data: {
//          gameJoin: GAME_TYPE,
//          pageno: pageno,
//          pageto: pageto,
//       },
//       dataType: "json",
//       success: async function (response) {
//          $(".Loading").fadeOut(0)
//          if (page - 1 < 2) {
//             $("#previous").addClass("block-click")
//             $("#previous").removeClass("action")
//             $("#previous .van-icon-arrow-left").css("color", "#7f7f7f")
//          }
//          if (response.status === false) {
//             pageno = 0
//             $("#previous .arr:eq(0)").addClass("block-click")
//             $("#previous .arr:eq(0)").removeClass("action")
//             $("#previous .van-icon-arrow-left").css("color", "#7f7f7f")
//             alertMess(response.msg)
//             return false
//          }
//          let list_orders = response.data.gameslist
//          $("#period").text(response.period)
//          $("#number_result").text(--page + "/" + response.page)
//          if (check == "all") {
//             ShowGameHistory(list_orders)
//          } else {
//             ShowMyBets(list_orders)
//          }
//       },
//    })
// })

$("#my_bets__bottom_nav .previous_page").click(function (e) {
  e.preventDefault();
  $("#my_bets__bottom_nav .previous_page").addClass("block-click");
  $(".Loading").fadeIn(0);
  const currentPage = parseInt($("#number_result__myBet").text());
  const previousPage = 1 <= currentPage - 1 ? currentPage - 1 : currentPage;
  initMyBets(previousPage);
  $(".Loading").fadeOut(0);
  $("#my_bets__bottom_nav .previous_page").removeClass("block-click");
});

$("#my_bets__bottom_nav .next_page").click(function (e) {
  e.preventDefault();
  $("#my_bets__bottom_nav .previous_page").addClass("block-click");
  $(".Loading").fadeIn(0);
  const currentPage = parseInt($("#number_result__myBet").text());
  const nextPage =
    My_Bets_Pages >= currentPage + 1 ? currentPage + 1 : currentPage;
  initMyBets(nextPage);
  $(".Loading").fadeOut(0);
  $("#my_bets__bottom_nav .previous_page").removeClass("block-click");
});

$("#game_history__bottom_nav .previous_page").click(function (e) {
  e.preventDefault();
  $("#my_bets__bottom_nav .previous_page").addClass("block-click");
  $(".Loading").fadeIn(0);
  console.log(Game_History_Pages);
  const currentPage = parseInt($("#number_result__gameHistory").text());
  const previousPage = 1 <= currentPage - 1 ? currentPage - 1 : currentPage;
  console.log(previousPage);
  initGameHistoryTab(previousPage);
  $(".Loading").fadeOut(0);
  $("#my_bets__bottom_nav .previous_page").removeClass("block-click");
});

$("#game_history__bottom_nav .next_page").click(function (e) {
  e.preventDefault();
  $("#my_bets__bottom_nav .previous_page").addClass("block-click");
  $(".Loading").fadeIn(0);
  console.log(Game_History_Pages);
  const currentPage = parseInt($("#number_result__gameHistory").text());
  const nextPage =
    Game_History_Pages >= currentPage + 1 ? currentPage + 1 : currentPage;
  console.log(nextPage);
  initGameHistoryTab(nextPage);
  $(".Loading").fadeOut(0);
  $("#my_bets__bottom_nav .previous_page").removeClass("block-click");
});

// Helpers ---------------------------------------------------------
function formateT(params) {
  let result = params < 10 ? "0" + params : params;
  return result;
}

function timerJoin(params = "", addHours = 0) {
  let date = "";
  if (params) {
    date = new Date(Number(params));
  } else {
    date = new Date();
  }

  date.setHours(date.getHours() + addHours);

  let years = formateT(date.getFullYear());
  let months = formateT(date.getMonth() + 1);
  let days = formateT(date.getDate());

  let hours = date.getHours() % 12;
  hours = hours === 0 ? 12 : hours;
  let ampm = date.getHours() < 12 ? "AM" : "PM";

  let minutes = formateT(date.getMinutes());
  let seconds = formateT(date.getSeconds());

  return (
    years +
    "-" +
    months +
    "-" +
    days +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    ampm
  );
}
