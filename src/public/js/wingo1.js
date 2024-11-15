const GAME_NAME = "wingo";
const GAME_TYPE_ID = "1";

let My_Bets_Pages = 1;
let Game_History_Pages = 1;

function showGameHistoryData(list_orders) {
  const containerId = "#game_history_data_container";

  if (list_orders.length == 0) {
    return $(containerId).html(`
         <div data-v-a9660e98="" class="van-empty">
             <div class="van-empty__image">
                 <img src="/images/empty-image-default.png" />
             </div>
             <p class="van-empty__description">No data</p>
         </div>
      `);
  }

  let html = list_orders
    .map((list_orders) => {
      // return `
      //    <div data-v-a9660e98="" class="c-tc item van-row game_history_bar">
      //        <div data-v-a9660e98="" class="van-col van-col--8">
      //            <div data-v-a9660e98="" class="c-tc goItem" >${list_orders.period}</div>
      //        </div>
      //        <div data-v-a9660e98="" class="van-col van-col--5">
      //            <div data-v-a9660e98="" class="c-tc goItem">
      //                <!---->
      //                <span data-v-a9660e98="" class="${list_orders.amount % 2 == 0 ? "red" : "green"}"> ${list_orders.amount} </span>
      //            </div>
      //        </div>
      //        <div data-v-a9660e98="" class="van-col van-col--5">
      //            <div data-v-a9660e98="" class="c-tc goItem">
      //                <span data-v-a9660e98=""> ${list_orders.amount < 5 ? "Small" : "Big"} </span>
      //                <!---->
      //            </div>
      //        </div>
      //        <div data-v-a9660e98="" class="van-col van-col--6">
      //            <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
      //                <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
      //                    <span data-v-a9660e98="" class="li ${list_orders.amount % 2 == 0 ? "red" : "green"}"></span>
      //                    ${list_orders.amount == 0 || list_orders.amount == 5 ? '<span data-v-a9660e98="" class="li violet"></span>' : ""}
      //                </div>
      //            </div>
      //        </div>
      //    </div>`

      let colorHtml = "";
      let colorClass = "";
      if (list_orders.amount == 0) {
        colorClass = "mixedColor0";
        colorHtml = `
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I red"></div>
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I violet"></div>
            `;
      } else if (list_orders.amount == 5) {
        colorClass = "mixedColor5";
        colorHtml = `
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I green"></div>
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I violet"></div>
            `;
      } else if (list_orders.amount % 2 == 0) {
        colorClass = "defaultColor";
        colorHtml = `
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I red"></div>
            `;
      } else {
        colorClass = "greenColor";
        colorHtml = `
               <div data-v-c52f94a7="" class="GameRecord__C-origin-I green"></div>
            `;
      }

      return `
         <div data-v-c52f94a7="" class="van-row">
            <div data-v-c52f94a7="" class="van-col van-col--8">${list_orders.period}</div>
            <div data-v-c52f94a7="" class="van-col van-col--5 numcenter"><div data-v-c52f94a7="" class="GameRecord__C-body-num ${colorClass}">${list_orders.amount}</div></div>
            <div data-v-c52f94a7="" class="van-col van-col--5"><span data-v-c52f94a7="">${list_orders.amount < 5 ? "Small" : "Big"}</span></div>
            <div data-v-c52f94a7="" class="van-col van-col--6">
               <div data-v-c52f94a7="" class="GameRecord__C-origin">
                  ${colorHtml}
               </div>
            </div>
         </div>`;
    })
    .join(" ");

  $(containerId).html(html);

  // $(`#game_history_tab .c-tc`).last().remove()
}

function showTrendData(list_orders) {
  const containerId = "#trend_data_container";

  if (list_orders.length == 0) {
    return $(containerId).html(`
       <div data-v-a9660e98="" class="van-empty">
         <div class="van-empty__image">
           <img src="/images/empty-image-default.png" />
         </div>
         <p class="van-empty__description">No data</p>
       </div>`);
  }

  let amounts = list_orders.map((order) => order.amount);
  let labels = list_orders.map((order) => order.period % 100);

  let html = `
   <style>
     canvas {
       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
       transform: rotate(360deg);
       transform-origin: center;
     }
   </style>
 
   <canvas id="graphCanvas" width="380" height="400"></canvas>
  
   <script>
      labels1 = ${JSON.stringify(labels)};
      amounts1 = [${amounts.join(", ")}];
      labels1.reverse();
      amounts1.reverse();
     
      data = {
        labels: labels1,
        values: amounts1
      };

         canvas = document.getElementById('graphCanvas');
      ctx = canvas.getContext('2d');

      function createGradient(value, ctx, x, y, prevX, prevY) {
        gradient = ctx.createLinearGradient(prevX, prevY, x, y);
        if (value === 0) {
          gradient.addColorStop(0, 'rgba(149,2,156,1)');
          gradient.addColorStop(0.35, 'rgba(121,9,111,1)');
          gradient.addColorStop(1, 'rgba(1,255,0,1)');
        } else if (value === 5) {
          gradient.addColorStop(0, 'rgba(149,2,156,1)');
          gradient.addColorStop(0.35, 'rgba(121,9,111,1)');
          gradient.addColorStop(1, 'rgba(255,0,14,1)');
        }
        return gradient;
      }

      function plotGraph(data) {
         padding = 50;
         spaceBetween = (canvas.width - padding * 2) / (data.values.length - 1);

        ctx.font = '14px Arial';
        ctx.lineWidth = 2;

        // Draw the Y axis labels
        for (let i = 0; i <= 9; i++) {
          ctx.fillText(9 - i, padding - 30, padding + i * (canvas.height - padding * 2) / 9);
        }

        data.values.forEach((value, index) => {
           x = padding + index * spaceBetween;
           y = padding + (9 - value) * (canvas.height - padding * 2) / 9;

          if (index > 0) {
             prevX = padding + (index - 1) * spaceBetween;
             prevY = padding + (9 - data.values[index - 1]) * (canvas.height - padding * 2) / 9;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);

            if (value === 0 || value === 5) {
              ctx.strokeStyle = createGradient(value, ctx, x, y, prevX, prevY);
            } else {
              ctx.strokeStyle = getColorForValue(value);
            }
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = getColorForValue(value);
          ctx.fill();

          ctx.fillText(data.labels[index], x - ctx.measureText(data.labels[index]).width / 2, canvas.height - padding + 20);
        });
      }

      function getColorForValue(value) {
        switch (value) {
          case 1:
          case 3:
          case 7:
          case 9: return 'green';
          case 2:
          case 4:
          case 6:
          case 8: return 'red';

          default: return '#000'; // default color
        }
      }

      plotGraph(data);
   </script>
   `;

  $(containerId).empty();
  $(containerId).html(html);
}

function showMyBetsData(list_orders) {
  let containerId = `#my_bets_data_container`;

  if (list_orders.length == 0) {
    return $(containerId).html(`
      <div data-v-a9660e98="" class="van-empty">
          <div class="van-empty__image">
              <img src="/images/empty-image-default.png" />
          </div>
          <p class="van-empty__description">No Data</p>
      </div>
      `);
  }
  console.log(list_orders);

  let html = list_orders
    .map((list_order, index) => {
      let join = list_order.bet;
      let color = "";
      if (join == "l") {
        color = "big";
      } else if (join == "n") {
        color = "small";
      } else if (join == "t") {
        color = "violet";
      } else if (join == "d") {
        color = "red";
      } else if (join == "x") {
        color = "green";
      } else if (join == "0") {
        color = "red-violet";
      } else if (join == "5") {
        color = "green-violet";
      } else if (Number(join) % 2 == 0) {
        color = "red";
      } else if (Number(join) % 2 != 0) {
        color = "green";
      }
      if ((!isNumber(join) && join == "l") || join == "n") {
        checkJoin = `
                    <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
                        <img src="/images/${join == "n" ? "small" : "big"}.png" class="van-image__img">
                    </div>
                    `;
      } else {
        checkJoin = `
                    <span data-v-a9660e98="">${isNumber(join) ? join : ""}</span>`;
      }
      return `
            <div data-v-a9660e98="" issuenumber="${list_order.stage}" addtime="${timerJoin(list_order.time)}" colour="red" number="6" rowid="${index}" class="hb my_bets_bar">
               <div data-v-a9660e98="" class="item c-row">
                  <div data-v-a9660e98="" class="result">
                     <div data-v-a9660e98="" class="select select-${color}">
                        ${checkJoin}    
                     </div>
                  </div>
                  <div data-v-a9660e98="" class="c-row c-row-between info">
                     <div data-v-a9660e98="">
                        <div data-v-a9660e98="" class="issueName">
                           ${list_order.stage} 
                           ${list_order.status == 1 ? '<span data-v-a9660e98="" class="state green">Success</span>' : list_order.status == 2 ? '<span data-v-a9660e98="" class="state red">Fail</span>' : ""}
                        </div>
                        <div data-v-a9660e98="" class="tiem">${timerJoin(list_order.time)}</div>
                     </div>
                     <div data-v-a9660e98="" class="money">
                        ${
                          list_order.status == 1 && list_order.bet == 0
                            ? '<span data-v-a9660e98="" class="success"> + ' +
                              list_order.money * 4.5 +
                              " </span>"
                            : list_order.status == 1 && list_order.bet == 5
                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                list_order.money * 4.5 +
                                " </span>"
                              : list_order.status == 1 &&
                                  list_order.result == 0 &&
                                  list_order.bet == "d"
                                ? '<span data-v-a9660e98="" class="success"> + ' +
                                  list_order.money * 1.5 +
                                  " </span>"
                                : list_order.status == 1 &&
                                    list_order.bet == "d"
                                  ? '<span data-v-a9660e98="" class="success"> + ' +
                                    list_order.money * 2 +
                                    " </span>"
                                  : list_order.status == 1 &&
                                      list_order.bet == "t"
                                    ? '<span data-v-a9660e98="" class="success"> + ' +
                                      list_order.money * 4.5 +
                                      " </span>"
                                    : list_order.status == 1 &&
                                        list_order.result == 5 &&
                                        list_order.bet == "x"
                                      ? '<span data-v-a9660e98="" class="success"> + ' +
                                        list_order.money * 1.5 +
                                        " </span>"
                                      : list_order.status == 1 &&
                                          list_order.bet == "x"
                                        ? '<span data-v-a9660e98="" class="success"> + ' +
                                          list_order.money * 2 +
                                          " </span>"
                                        : list_order.status == 1 &&
                                            list_order.bet == "l"
                                          ? '<span data-v-a9660e98="" class="success"> + ' +
                                            list_order.money * 2 +
                                            " </span>"
                                          : list_order.status == 1 &&
                                              list_order.bet == "n"
                                            ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_order.money * 2 +
                                              " </span>"
                                            : list_order.status == 1
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                                list_order.money * 9 +
                                                " </span>"
                                              : list_order.status == 2
                                                ? '<span data-v-a9660e98="" class="fail"> - ' +
                                                  list_order.money +
                                                  "</span>"
                                                : ""
                        }
                     </div>
                  
                     </div>
               </div>
               <div data-v-a9660e98="" class="details" style="display: none">
                  <div data-v-a9660e98="" class="tit">Details</div>
                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                     <div data-v-a9660e98="">Order ID</div>
                        <div data-v-a9660e98="" data-clipboard-text="${list_order.id_product}" class="tag-read c-row c-row-between c-row-middle">
                            ${list_order.id_product}
                            <img data-v-a9660e98="" width="18px" height="15px" src="/images/copy.png" class="m-l-5">
                        </div>
                     </div>
                     <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                        <div data-v-a9660e98="">Periods</div>
                            <div data-v-a9660e98="">${list_order.stage}</div>
                        </div>
                        <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                            <div data-v-a9660e98="">Amount Spent</div>
                            <div data-v-a9660e98="">${list_order.money + list_order.fee}.00</div>
                        </div>
                        <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                            <div data-v-a9660e98="">Quantity</div>
                            <div data-v-a9660e98="">${list_order.amount}</div>
                        </div>
                        <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                            <div data-v-a9660e98="">Net Amount</div>
                            <div data-v-a9660e98="" class="red">${list_order.money}.00</div>
                        </div>
                        <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                            <div data-v-a9660e98="">Tax</div>
                            <div data-v-a9660e98="">${list_order.fee}.00</div>
                        </div>
                        <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                            <div data-v-a9660e98="">Opening Price</div>
                            <div data-v-a9660e98="">${list_order.result}</div>
                        </div>
                        <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                            <div data-v-a9660e98="">Result</div>
                        <div data-v-a9660e98="">
                            <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${list_order.result}</div>
                            <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${list_order.result == 0 ? "Purple" : list_order.result == 5 ? "Indigo" : list_order.result % 2 == 0 ? "Red" : "Green"}</div>
                            <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${list_order.amount < 5 ? "Small" : "Big"}</div>
                        </div>
                     </div>
                     <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle ">
                         <div data-v-a9660e98="">Select</div>
                         <div data-v-a9660e98="">
                             <div data-v-a9660e98="">${color}</div>
                         </div>
                     </div>
                     <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                         <div data-v-a9660e98="">Status</div>
                         <div data-v-a9660e98="" class="${list_order.status == 1 ? "green" : list_order.status == 2 ? "red" : ""}">${list_order.status == 1 ? "Success" : list_order.status == 2 ? "Failure" : ""}</div>
                     </div>
                     <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                         <div data-v-a9660e98="">Win Or Loss</div>
                         <div data-v-a9660e98="" class="${list_order.status == 1 ? "green" : list_order.status == 2 ? "red" : ""}"> 
                         ${list_order.status == 1 ? "+" : list_order.status == 2 ? "-" : ""} 
                         ${list_order.status == 0 ? "" : list_order.status == 1 && list_order.bet == 0 ? list_order.money * 4.5 : list_order.status == 1 && list_order.bet == 5 ? list_order.money * 1.5 : list_order.status == 1 && list_order.bet == "t" ? list_order.money * 4.5 : list_order.status == 1 && list_order.result == 0 && list_order.bet == "d" ? list_order.money * 1.5 : list_order.status == 1 && list_order.bet == "d" ? list_order.money * 2 : list_order.status == 1 && list_order.bet == "x" ? list_order.money * 1.5 : list_order.status == 1 && list_order.result == 5 && list_order.bet == "x" ? list_order.money * 1.5 : list_order.status == 1 && list_order.bet == "l" ? list_order.money * 2 : list_order.status == 1 && list_order.bet == "n" ? list_order.money * 2 : list_order.status == 1 ? list_order.money * 9 : list_order.money}
                     </div>
                  </div>
                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                      <div data-v-a9660e98="">Time</div>
                      <div data-v-a9660e98="">${timerJoin(list_order.time)}</div>
                  </div>
               </div>
            </div>`;
    })
    .join(" ");

  $(containerId).html(html);
}

var pageno = 0;
var limit = 10;
var page = 1;

// --------------------- wingo game logic ---------------------

var audio1 = new Audio("/audio/di1.da40b233.mp3");
var audio2 = new Audio("/audio/di2.317de251.mp3");

var clicked = false;

function openAudio() {
  audio1.muted = true;
  audio1.play();
  audio2.muted = true;
  audio2.play();
}

$("body").click(function (e) {
  e.preventDefault();
  if (clicked) return;
  openAudio();
  clicked = true;
});

function playAudio1() {
  audio1.muted = false;
  audio1.play();
}

function playAudio2() {
  audio2.muted = false;
  audio2.play();
}

fetch("/api/webapi/GetUserInfo")
  .then((response) => response.json())
  .then((data) => {
    $(".Loading").fadeOut(0);
    if (data.status === false) {
      unsetCookie();
      return false;
    }
    $("#balance_amount").text(`₹ ${data.data.money_user}.00 `);
  });

$(".reload_money").click(function (e) {
  e.preventDefault();
  $(this).addClass("action block-click");
  setTimeout(() => {
    $(this).removeClass("action block-click");
  }, 3000);
  fetch("/api/webapi/GetUserInfo")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === false) {
        unsetCookie();
        return false;
      }
      $("#balance_amount").text(`₹ ${data.data.money_user}.00 `);
    });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function totalMoney() {
  let value = parseInt($("#van-field-1-input").val().trim());
  let money = parseInt(
    $(".Betting__Popup-body-money-main").attr("data-current-money"),
  );
  console.log($("#van-field-1-input").val());
  console.log(money);
  let total = value * money;
  $("#popup_total_bet_money").text(total + ".00");
}

const selectPopupXData = () => {};
$(".van-overlay").fadeOut();
$(".popup-join").fadeOut();

function alertBox(join, cssValueNumber, addText) {
  $(".van-overlay").fadeIn();
  $(".popup-join").fadeIn();
  $(".popup-join > div").removeClass();
  $(".popup-join > div").addClass(`Betting__Popup-${cssValueNumber}`);

  let activeXData = $(".Betting__C-multiple-r.active").attr("data-x");
  console.log(activeXData);
  $("#van-field-1-input").val(activeXData);
  $("div.Betting__Popup-body-x-btn").removeClass("bgcolor");
  $(`div.Betting__Popup-body-x-btn[data-x="${activeXData}"]`).addClass(
    "bgcolor",
  );
  $("#join_bet_btn").attr("data-join", join);
  $("#betting_value").html(addText);
  totalMoney();
}

$(`.Betting__Popup-body-money-btn`).click(function (e) {
  e.preventDefault();

  const thisValue = $(this).attr("data-money");
  $(".Betting__Popup-body-money-btn").removeClass("bgcolor");
  $(this).addClass("bgcolor");
  $(".Betting__Popup-body-money-main").attr("data-current-money", thisValue);

  totalMoney();
});

$(`.Betting__Popup-body-x-btn`).click(function (e) {
  e.preventDefault();

  const thisValue = $(this).attr("data-x");
  $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
  $(this).addClass("bgcolor");

  $("#van-field-1-input").val(thisValue);
  totalMoney();
});

$(`.Betting__Popup-minus-btn`).click(function (e) {
  e.preventDefault();
  const currentX = parseInt($("#van-field-1-input").val());
  const nextX = currentX === 1 ? 1 : currentX - 1;
  $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
  $(`.Betting__Popup-body-x-btn[data-x="${nextX}"]`).addClass("bgcolor");

  $("#van-field-1-input").val(nextX);
  totalMoney();
});

$(`.Betting__Popup-plus-btn`).click(function (e) {
  e.preventDefault();
  const currentX = parseInt($("#van-field-1-input").val());
  const nextX = currentX + 1;

  $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
  $(`.Betting__Popup-body-x-btn[data-x="${nextX}"]`).addClass("bgcolor");

  $("#van-field-1-input").val(nextX);
  totalMoney();
});
$(`#van-field-1-input`).change(function (e) {
  e.preventDefault();
  const currentX = parseInt($("#van-field-1-input").val());

  $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
  $(`.Betting__Popup-body-x-btn[data-x="${currentX}"]`).addClass("bgcolor");

  totalMoney();
});
$("#join_bet_btn").click(function (event) {
  event.preventDefault();
  let join = $(this).attr("data-join");
  const currentX = parseInt($("#van-field-1-input").val().trim());
  let money = $(".Betting__Popup-body-money-main").attr("data-current-money");

  if (!join || !currentX || !money) {
    return;
  }

  $(this).addClass("block-click");
  $.ajax({
    type: "POST",
    url: "/api/webapi/action/join",
    data: {
      typeid: GAME_TYPE_ID,
      join: join,
      x: currentX,
      money: money,
    },
    dataType: "json",
    success: function (response) {
      alertMessJoin(response.message);
      if (response.status === false) return;
      $("#balance_amount").text("₹ " + response.money + ".00");
      socket.emit("data-server_2", {
        money: currentX * money,
        join,
        time: Date.now(),
        change: response.change,
      });
    },
  });

  setTimeout(() => {
    $(".van-overlay").fadeOut();
    $(".popup-join").fadeOut();
    $("#join_bet_btn").removeClass("block-click");
  }, 500);
});

$("#cancel_bet_btn").click(function (event) {
  event.preventDefault();

  $(".van-overlay").fadeOut();
  $(".popup-join").fadeOut();
  $("#join_bet_btn").removeClass("block-click");
});

//main button events

$(".con-box .bet_button").click(function (e) {
  e.preventDefault();
  let addTop = $(this).attr("data-join");
  let cssValueNumber = $(this).attr("data-css-value");
  let addText = $(this).text();
  alertBox(addTop, cssValueNumber, addText);
});

$(".number-box .bet_button").click(function (e) {
  e.preventDefault();
  let addTop = $(this).attr("data-join");
  let cssValueNumber = $(this).attr("data-css-value");
  let addText = $(this).attr("data-join");
  alertBox(addTop, cssValueNumber, addText);
});

$(".btn-box .bet_button").click(function (e) {
  e.preventDefault();
  let addTop = $(this).attr("data-join");
  let cssValueNumber = $(this).attr("data-css-value");
  let addText = $(this).text();
  alertBox(addTop, cssValueNumber, addText);
});

$(".Betting__C-multiple-r").click(function (e) {
  e.preventDefault();
  $(".Betting__C-multiple-r").css({
    "background-color": "rgb(240, 240, 240)",
    color: "rgb(0, 0, 0)",
  });

  $(this).css({
    "background-color": "rgb(63 147 104)",
    color: "rgb(255, 255, 255)",
  });
  $(".Betting__C-multiple-r").removeClass("active");
  $(this).addClass("active");
});

$(".random").click(async function (e) {
  e.preventDefault();
  let random = 0;
  for (let i = 0; i < 55; i++) {
    random = Math.floor(Math.random() * 10);
    $(".number-box .bet_button").removeClass("active");
    $(`.number-box .bet_button:eq(${random})`).addClass("active");
    await sleep(50);
  }

  alertBox(random, random);
});

function alertMessJoin(msg) {
  $("body").append(
    `
      <div data-v-1dcba851="" class="msg">
          <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${msg} </div>
      </div>
   `,
  );
  setTimeout(() => {
    $(".msg .msg-content").removeClass("v-enter-active v-enter-to");
    $(".msg .msg-content").addClass("v-leave-active v-leave-to");
    setTimeout(() => {
      $("body .msg").remove();
    }, 500);
  }, 1000);
}

// ------------------------- wingo game logic --------------------end

// -------------------------- game pagination -----------------------

const initGameHistoryTab = (page = 1) => {
  let size = 10;
  let offset = page === 1 ? 0 : (page - 1) * size;
  let limit = page * size;

  $.ajax({
    type: "POST",
    url: "/api/webapi/GetNoaverageEmerdList",
    data: {
      typeid: GAME_TYPE_ID,
      pageno: offset,
      pageto: 10,
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      Game_History_Pages = response.page;
      let list_orders = response.data.gameslist;
      $("#period").text(response.period);
      $(".TimeLeft__C-num").html(`
            <div data-v-55cb6917="" class="n${response?.data?.gameslist[0]?.amount || 0}"></div>
            <div data-v-55cb6917="" class="n${response?.data?.gameslist[1]?.amount || 0}"></div>
            <div data-v-55cb6917="" class="n${response?.data?.gameslist[2]?.amount || 0}"></div>
            <div data-v-55cb6917="" class="n${response?.data?.gameslist[3]?.amount || 0}"></div>
            <div data-v-55cb6917="" class="n${response?.data?.gameslist[4]?.amount || 0}"></div>
         `);
      $("#number_result__gameHistory").text(page);
      $(".Loading").fadeOut(0);
      showGameHistoryData(list_orders);
    },
  });
};
initGameHistoryTab();
function initMyBets(page = 1) {
  let size = 10;
  let offset = page === 1 ? 0 : (page - 1) * size;
  let limit = page * size;
  $.ajax({
    type: "POST",
    url: "/api/webapi/GetMyEmerdList",
    data: {
      typeid: GAME_TYPE_ID,
      pageno: offset,
      pageto: 10,
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      My_Bets_Pages = response.page;
      let data = response.data.gameslist;
      $("#number_result__myBet").text(page);
      $(".Loading").fadeOut(0);
      showMyBetsData(data);
    },
  });
}
initMyBets();
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

// -------------------------------- pagination -----------------------------end

window.onload = function () {
  function cownDownTimer() {
    var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
    setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var minute = Math.ceil(minutes / 20 - 2);
      var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
      var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
      $(".TimeLeft__C-time div:eq(3)").text(seconds1);
      $(".TimeLeft__C-time div:eq(4)").text(seconds2);
    }, 0);
    setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
      var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
      if (seconds1 == 0 && seconds2 <= 5) {
        if (clicked) {
          playAudio1();
        }
      }
      if (seconds1 == 5 && seconds2 == 9) {
        if (clicked) {
          playAudio2();
        }
      }
    }, 1000);
    setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
      var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
      if (seconds1 == 0 && seconds2 <= 5) {
        $(".van-overlay").fadeOut();
        $(".popup-join").fadeOut();

        $(".Betting__C-mark").css("display", "flex");
        $(".Betting__C-mark div:eq(0)").text(seconds1);
        $(".Betting__C-mark div:eq(1)").text(seconds2);
      } else {
        $(".Betting__C-mark").css("display", "none");
      }
    }, 0);
  }

  cownDownTimer();
  setTimeout(() => {
    let check = true;
    $("#history-order .item").click(function (e) {
      e.preventDefault();
      let parent = $(this).parent();
      // let show = parent.children();
      let myVar = parent.find(".details");
      if (check) {
        check = false;
        myVar.fadeIn(0);
      } else {
        check = true;
        myVar.fadeOut(0);
      }
    });
  }, 1000);
};

$(".van-notice-bar__wrap .van-notice-bar__content").css({
  "transition-duration": "48.9715s",
  transform: "translateX(-2448.57px)",
});

setInterval(() => {
  $(".van-notice-bar__wrap .van-notice-bar__content").css({
    "transition-duration": "0s",
    transform: "translateX(0)",
  });
  setTimeout(() => {
    $(".van-notice-bar__wrap .van-notice-bar__content").css({
      "transition-duration": "48.9715s",
      transform: "translateX(-2448.57px)",
    });
  }, 100);
}, 48000);

$(".van-button--default").click(function (e) {
  e.preventDefault();
  $(".van-popup-vf, .van-overlay").fadeOut(100);
});

$(".circular").click(function (e) {
  e.preventDefault();
  $(".van-popup-vf, .van-overlay").fadeIn(100);
});

let selectPageTime = Number($("html").attr("data-dpr"));

$(`.game-betting .box .item:eq(${selectPageTime - 1})`).addClass("action");
$(`.game-betting .box .item:eq(${selectPageTime - 1}) .img`).addClass(
  "block-click",
);
$(`.game-betting .box .item .img .van-image img`).attr(
  "src",
  "/images/3-minutes-timer-stopwatch-countdown-260nw-1676521363.png",
);
$(
  `.game-betting .box .item:eq(${selectPageTime - 1}) .img .van-image img`,
).attr("src", "/images/360_F_331298353_73gUe2q6b36bwaCv1EDAHxbToOlUYZRV.jpg");

// on window load

// ------------------ Tab handling Logic -------------------

const TAB_NAME_MAP = {
  GAME_HISTORY: "GAME_HISTORY",
  TREND: "TREND",
  MY_BETS: "MY_BETS",
};

const setActiveTab = (selectedTabName) => {
  $("#game_history_tab").removeClass("active");
  $("#trend_tab").removeClass("active");
  $("#my_bets_tab").removeClass("active");

  $("#game_history_tab_button .tab_nav_button_inner").removeClass("action");
  $("#trend_tab_button .tab_nav_button_inner").removeClass("action");
  $("#my_bets_tab_button .tab_nav_button_inner").removeClass("action");
  if (TAB_NAME_MAP.GAME_HISTORY === selectedTabName) {
    $("#game_history_tab").addClass("active");
    $("#game_history_tab_button .tab_nav_button_inner").addClass("action");
  }
  if (TAB_NAME_MAP.TREND === selectedTabName) {
    $("#trend_tab").addClass("active");
    $("#trend_tab_button .tab_nav_button_inner").addClass("action");
  }
  if (TAB_NAME_MAP.MY_BETS === selectedTabName) {
    $("#my_bets_tab").addClass("active");
    $("#my_bets_tab_button .tab_nav_button_inner").addClass("action");
  }
};

$("#game_history_tab_button").click(function (e) {
  e.preventDefault();

  setActiveTab(TAB_NAME_MAP.GAME_HISTORY);

  initGameHistoryTab();
});

$("#trend_tab_button").click(function (e) {
  e.preventDefault();

  setActiveTab(TAB_NAME_MAP.TREND);

  $.ajax({
    type: "POST",
    url: "/api/webapi/GetNoaverageEmerdList",
    data: {
      typeid: GAME_TYPE_ID,
      pageno: "0",
      pageto: "10",
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      let list_orders = response.data.gameslist;
      showTrendData(list_orders);
    },
  });
});

$("#my_bets_tab_button").click(function (e) {
  e.preventDefault();

  setActiveTab(TAB_NAME_MAP.MY_BETS);

  initMyBets();
});

// ------------------ Tab handling Logic -------------------end

//------------------helpers-------------------
const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

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
    ":" +
    ampm
  );
}

var socket = io();
var pageno = 0;
var limit = 10;
var page = 1;

socket.on("data-server", function (msg) {
  if (msg.data[0].game != GAME_NAME) {
    console.error(
      `Received"${msg.data[0].game}" in the place of wingo from socket request`,
    );
    return;
  }

  $(".Loading").fadeIn(0);

  const newGame = msg?.data?.[0];
  const lastGame = msg?.data?.[1];

  $.ajax({
    type: "POST",
    url: "/api/webapi/GetMyEmerdList",
    data: {
      typeid: GAME_TYPE_ID,
      pageno: "0",
      pageto: "10",
      language: "vi",
    },
    dataType: "json",
    success: function (response) {
      let data = response.data.gameslist;

      setActiveTab(TAB_NAME_MAP.MY_BETS);
      showMyBetsData(data);

      let lastGame = data[0];

      const STATUS_MAP = {
        WIN: "win",
        LOSS: "loss",
        NONE: "none",
      };

      const displayResultHandler = ({ status, amount, period, result }) => {
        let modal = document.getElementById("result_modal");
        let modalAmount = document.getElementById("modal_amount");

        modal.classList.add("open");

        $(".modal-result_img").addClass(`n${result || 0}`);
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

      $("#number_result__myBet").text(response.page);
      // Nested AJAX call
      $.ajax({
        type: "POST",
        url: "/api/webapi/GetNoaverageEmerdList",
        data: {
          typeid: GAME_TYPE_ID,
          pageno: "0",
          pageto: "10",
          language: "vi",
        },
        dataType: "json",
        success: function (response) {
          let list_orders = response.data.gameslist;
          // Assuming firstGame is defined somewhere in your code
          // console.log(lastGame && lastGame.stage, list_orders[1].period)
          // console.log(lastGame, list_orders[0])
          // console.log(lastGame, list_orders[1])
          // console.log(lastGame, list_orders[2])
          if (lastGame && lastGame.stage === list_orders[0].period) {
            if (lastGame.get == 0) {
              displayResultHandler({
                status: STATUS_MAP.LOSS,
                amount: lastGame.money,
                period: list_orders[0].period,
                result: list_orders[0].amount,
              });
            } else {
              displayResultHandler({
                status: STATUS_MAP.WIN,
                amount: lastGame.get,
                period: list_orders[0].period,
                result: list_orders[0].amount,
              });
            }
          } else {
            displayResultHandler({
              status: STATUS_MAP.NONE,
              period: list_orders[0].period,
              result: list_orders[0].amount,
            });
          }

          $("#period").text(response.period);
          $(".TimeLeft__C-num").html(`
                  <div data-v-55cb6917="" class="n${response?.data?.gameslist[0]?.amount || 0}"></div>
                  <div data-v-55cb6917="" class="n${response?.data?.gameslist[1]?.amount || 0}"></div>
                  <div data-v-55cb6917="" class="n${response?.data?.gameslist[2]?.amount || 0}"></div>
                  <div data-v-55cb6917="" class="n${response?.data?.gameslist[3]?.amount || 0}"></div>
                  <div data-v-55cb6917="" class="n${response?.data?.gameslist[4]?.amount || 0}"></div>
               `);
          $("#number_result__gameHistory").text(response.page);
          showGameHistoryData(list_orders);
          showTrendData(list_orders);
        },
      });
    },
  });

  $("#period").text(newGame.period);

  fetch("/api/webapi/GetUserInfo")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === false) {
        unsetCookie();
        return false;
      }
      $("#balance_amount").text(`₹ ${data.data.money_user}.00 `);
    });

  $(".Loading").fadeOut(0);
});
