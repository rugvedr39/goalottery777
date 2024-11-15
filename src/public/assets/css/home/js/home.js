	$(document).ready(function () {
			$('.van-sidebar-item').click(function(){
				$('.van-sidebar-item--select').removeClass('van-sidebar-item--select');
				$(this).addClass('van-sidebar-item--select');
				var id = $(this).attr('id');
				$('.gameListGrid__container > .active').removeClass('active');
				$('.' + id).addClass('active');
			})
			$('.gameListGrid__container [data-origin]').each(function(){
				$(this).removeAttr('data-origin');
			})
			$('.gameListGrid__container [data-img]').each(function(){
				$(this).removeAttr('data-img');
			})
			function alertMess(text, sic) {
				$('body').append(
					`
					<div data-v-1dcba851="" class="msg">
						<div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${text} </div>
					</div>
					`
				);
				setTimeout(() => {
					$('.msg .msg-content').removeClass('v-enter-active v-enter-to');
					$('.msg .msg-content').addClass('v-leave-active v-leave-to');
					setTimeout(() => {
						$('.msg').remove();
					}, 100);
					sic.removeClass('block-click');
				}, 1000);
			}
			
			let count = 0;
			let element = document.querySelector('.van-swipe__track');
			setInterval(() => {
				let getWBody = $('.navbar').width();
				$(`.van-swipe__indicator`).removeClass('van-swipe__indicator--active');
				$(`.van-swipe__indicator`).css("backgroundColor", "");
				$(`.van-swipe__indicator:eq(${count})`).addClass('van-swipe__indicator--active');
				$(`.van-swipe__indicator:eq(${count})`).css("backgroundColor", "rgb(242, 65, 59)");
				if (element) {
					if (count == 0) {
						element.style = `width: 1448px; transition-duration: 500ms; transform: translateX(-${getWBody}px);`;
					} else if (count == 1) {
						element.style = `width: 1448px; transition-duration: 500ms; transform: translateX(-${getWBody * 2}px);`;
					} else if (count == 2) {
						element.style = `width: 1448px; transition-duration: 500ms; transform: translateX(-${getWBody * 3}px);`;
					} else if (count == 3) {
						count = -1;
						element.style = `width: 1448px; transition-duration: 0ms; transform: translateX(0px);`;
					}
				}
				count++;
			}, 2500);

			function cownDownTimer() {
				let countDownDate = new Date("2023-08-01T23:59:59.9999999+07:00").getTime();
				setInterval(function () {
					let now = new Date().getTime();
					let distance = now - countDownDate;
					let days = Math.floor(distance / (1000 * 60 * 60 * 24));
					let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					let seconds = Math.floor((distance % (1000 * 60)) / 1000);

					$('.list-flip_nums .flip-num:eq(0) .top').text((days < 10) ? `0${days}` : days);
					$('.list-flip_nums .flip-num:eq(0) .bottom-card').removeClass('flipX');
					$('.list-flip_nums .flip-num:eq(0) .back .c-tc').text((days + 1 < 10) ? `0${days + 1}` : days + 1);
					if (seconds >= 59 && minutes >= 59 && hours >= 23) {
						setTimeout(() => {
							$('.list-flip_nums .flip-num:eq(0) .bottom-card').addClass('flipX');
						}, 100);
					}

					$('.list-flip_nums .flip-num:eq(1) .top').text((hours < 10) ? `0${hours}` : hours);
					$('.list-flip_nums .flip-num:eq(1) .bottom-card').removeClass('flipX');
					$('.list-flip_nums .flip-num:eq(1) .back .c-tc').text((hours + 1 < 10) ? `0${hours + 1}` : hours + 1);
					if (seconds >= 59 && minutes >= 59) {
						setTimeout(() => {
							$('.list-flip_nums .flip-num:eq(1) .bottom-card').addClass('flipX');
						}, 100);
					}

					$('.list-flip_nums .flip-num:eq(2) .top').text((minutes < 10) ? `0${minutes}` : minutes);
					$('.list-flip_nums .flip-num:eq(2) .bottom-card').removeClass('flipX');
					$('.list-flip_nums .flip-num:eq(2) .back .c-tc').text((minutes + 1 < 10) ? `0${minutes + 1}` : minutes + 1);
					if (seconds >= 59) {
						setTimeout(() => {
							$('.list-flip_nums .flip-num:eq(2) .bottom-card').addClass('flipX');
						}, 100);
					}

					$('.list-flip_nums .flip-num:eq(3) .bottom-card').removeClass('flipX');
					$('.list-flip_nums .flip-num:eq(3) .top').text((seconds < 10) ? `0${seconds}` : seconds);
					$('.list-flip_nums .flip-num:eq(3) .back .c-tc').text((seconds + 1 < 10) ? `0${seconds + 1}` : seconds + 1);
					setTimeout(() => {
						$('.list-flip_nums .flip-num:eq(3) .bottom-card').addClass('flipX');
					}, 100);
				}, 1000);
			};
			cownDownTimer();
		});
		
		CreatMemJoin();
		let translate = 0;
		let count = 0;
		let top_recharge = -358;
		setInterval(() => {
			count += 1;
			translate -= 40;
			top_recharge -= 180;
			$('#wingo').css({
				'transform': `translateY(${translate}px)`,
			});
			$('#k5d').css({
				'transform': `translateY(${translate}px)`,
			});

			$('#k3').css({
				'transform': `translateY(${translate}px)`,
			});

			$('#top-recharge').css({
				'transform': `translateY(${top_recharge}px)`,
			});
			if(count == 3) {
				count = 0;
				translate = 40;
				top_recharge = -358;
				CreatMemJoin();
			};
		}, 3000);
		$('.launch-game').click(function () {
                let platform = "html5-desktop";
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    platform = "html5";
                }
                let game_code = $(this).attr('data');
                let product_type = $(this).attr('type');
                $('.Loading').fadeIn(0);
                $.ajax({
                    type: 'POST',
                    url: '/api/webapi/launchgame',
                    data: {
						product_type,
                        game_code,
                        platform,
                    },
                    dataType: 'json',
                    success: function (res) {
                        let { result } = res;
						console.log(res.status)
                        if (res.status == 0) {
                            window.open(res.game_url, '_blank');
                        } else {
                            $('.van-overlay').addClass('open');
                        }
                        $('.Loading').fadeOut(0);
                    },
                });
            });
