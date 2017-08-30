(function() {
	var datepicker = {};
	var monthData;
	var wrapper;

	datepicker.getMonthData = function(year, month) {

		var ret = [];

		// 参数校验
		if (!year || !month) {
			var today = new Date();
			year = today.getFullYear();
			month = today.getMonth() + 1;
		}

		// 当月第一天
		var firstDay = new Date(year, month-1, 1);

		//  当月第一天的星期
		var firstDayWeekDay = firstDay.getDay();
		if (firstDayWeekDay === 0) {
			firstDayWeekDay = 7;
		}

		// 重新取年份和月份
		year = firstDay.getFullYear();
		month = firstDay.getMonth() + 1;

		// 上月最后一天
		var lastDayOfLastMonth = new Date(year, month-1, 0);
		var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

		// 显示的上一个月的日期天数
		var prevMonthDayCount = firstDayWeekDay -1;


		// 当月最后一天
		var lastDay = new Date(year, month, 0);
		var lastDate = lastDay.getDate();

		for (var i = 0; i < 7*6; i++) {
			var date = i +1 - prevMonthDayCount;
			var showDate = date;
			var thisMonth = month;

			// 上一个月
			if (date <= 0) {
				thisMonth = month - 1;
				showDate = lastDateOfLastMonth + date;
			}
			// 下一个月
			else if(date > lastDate){
				thisMonth = month + 1;
				showDate = showDate - lastDate;
			}

			if(thisMonth ===0 ) {
				thisMonth = 12;
			}
			if(thisMonth ===13 ) {
				thisMonth = 1;
			}

			ret.push({
				month:thisMonth,
				date:date,
				showDate: showDate
			});
		}


		return {
			year: year,
			month: month,
			days: ret
		};
	}


	datepicker.buildUI = function(year, month) {
		monthData = datepicker.getMonthData(year, month);
		if (!year || !month) {
			var today = new Date();
			year = today.getFullYear();
			month = today.getMonth() + 1;
		}
		var lastDay = new Date(year, month, 0);
		var maxDate = lastDay.getDate();
		console.log('maxDate :' + maxDate);
		// console.log(monthData);
		var html  =  '<div class="ui-datepicker-header">'+
						'<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-btn-prev">&lt;</a>'+
						'<span class="ui-datepicker-curr-month">'+ monthData.year +'-'+ monthData.month +'</span>'+
						'<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-btn-next">&gt;</a>'+
					'</div>'+
					'<div class="ui-datepicker-body">'+
						'<table>'+
							'<thead>'+
								'<tr>'+
									'<th>周一</th>'+
									'<th>周二</th>'+
									'<th>周三</th>'+
									'<th>周四</th>'+
									'<th>周五</th>'+
									'<th>周六</th>'+
									'<th>周日</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody>';

		for(var i = 0;  i < monthData.days.length; i++){
			var date = monthData.days[i];
			// 周一
			if (i%7 === 0) {
				html += '<tr>';
			}
			if (date.date <= 0) {
				html += '<td><a data-date="'+ date.date+'" href="javascript:;" class="day prev">' + date.showDate + '</td>';
			}else if(date.date > maxDate){
				html += '<td><a data-date="'+ date.date+'" href="javascript:;" class="day next">' + date.showDate + '</td>';
			}else{
				html += '<td><a data-date="'+ date.date+'" href="javascript:;" class="day">' + date.showDate + '</td>';
			}
			
			// 周日
			if (i%7 === 6) {
				html += '</tr>';
			}
		}

		html += '</tbody>'+'</table>'+'</div>';

		// console.log(html);

		return html;
	}

	// 根据点击的方向，获知 month
	datepicker.render = function(direction) {
		var year, month;
		if (monthData) {
			year = monthData.year;
			month = monthData.month;
		}
		
		if (direction === 'prev') {
			month = month -1;
		}
		if (direction === 'next') {
			month = month + 1;
		}

		var html = datepicker.buildUI(year, month);
		wrapper = document.querySelector('.ui-datepicker-wrapper');
		if (!wrapper) {
			wrapper = document.createElement('div');
			document.body.appendChild(wrapper);
			wrapper.className = 'ui-datepicker-wrapper';
		}
		wrapper.innerHTML = html;
		
	}

	datepicker.init = function() {
		datepicker.render();

		// 切换月份，重新绘制日期
		wrapper.addEventListener('click', function(e) {
			var target = e.target;
			if (!target.classList.contains('ui-datepicker-btn')) {
				return;
			}
			// 上一个月
			if (target.classList.contains('ui-datepicker-btn-prev')) {
				datepicker.render('prev');
			}
			// 下一月
			else if(target.classList.contains('ui-datepicker-btn-next')) {
				datepicker.render('next');
			}
		}, false);

		// 点击日期
		wrapper.addEventListener('click', function(e) {
			var target = e.target;
			if (target.tagName.toLowerCase() !== 'a' || target.parentNode.tagName.toLowerCase()!== 'td') {
				return;
			}
			var date = new Date(monthData.year, monthData.month-1 , target.dataset.date);
			// console.log(date);
			console.log(format(date));

		},false)
	}

	function format(date) {
		var ret = '';
		var padding = function(num) {
			if (num <= 9) {
				return '0' + num;
			}
			return num;
		}
		ret += date.getFullYear() + '-';
		ret += padding(date.getMonth() + 1) + '-';
		ret += padding(date.getDate());

		return ret;
	}


	// 挂载到 window 对象上
	window.datepicker = datepicker;
})();