var overdue, maintenance, calendarid, opts;
// 开始的年月日
var start_y_m_d = "";
var cur_data_start = '';
// 结束的年月日
var end_y_m_d = "";
var cur_data_end = '';
//年，月
var yy_year = '';
var yy_month = '';
var wenkFun = {
    jcalendar_week: function(options) {
        var _this = this;
        var defaults = {
            element: "#jcalendar_week",
            dayclick: function(date, obj) {
                //day点击事件
                $(obj).addClass("calendar_day_act").siblings().removeClass("calendar_day_act");
            },
            Backclick: function(date) {},
            dayaddclass: function(date) {
                return null;
            },
            showbtn: true,
        };
        opts = $.extend(defaults, options);
        calendarid = $(opts.element);
        addDOM();

        function addDOM() {
            calendarid.html("");
            var before_btn = opts.showbtn ? '<button class="switch_month beforem_btn"><span class="maintenance-pullWest"></span></button>' : '';
            var after_btn = opts.showbtn ? '<button class="switch_month afterm_btn"><span class="maintenance-pullRight"></span></button>' : '';
            // var header_dom = '<div class="flex_i calendar_header ">'+
            // 			before_btn+
            // 			'<div class="flex_auto calendar_info" onclick="$(\'#pop\').show();"></div>'+
            // 			after_btn+
            // 		'</div>';
            var header_doms = '<div class="flex_i calendar_header ">' +
                before_btn +
                '<div class="text_center flex_auto"><span class="calendar_info"></span>' +
                '<span class="back_span" title="回到今天">今天</span></div>' +
                after_btn +
                '</div>';
            var week_dom = '<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>';
            var week_bar_dom = '<ul class="calendar_tr calendar_week">' + week_dom + '</ul>';
            var day_bar_dom = '<ul class="calendar_tr calendar_day_bar"></ul>';
            calendarid.prepend(header_doms + week_bar_dom + day_bar_dom);
        }
        //获取今天
        var todaydate = function() {
                var nstr = new Date();
                var ynow = nstr.getFullYear();
                var mnow = nstr.getMonth();
                var dnow = nstr.getDate();
                return [ynow, mnow, dnow];
            }
            //判断是否为闰年
        var is_leap = function(year) {
                return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
            }
            //获取周第一天日期方法
        _this.weekfirstdate = function(year, weeknum) {
            //获取当年月份天数数组
            var m_days = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            //获取当年第一天是周几
            var newyear_week = (new Date(year, 0, 1)).getDay();
            //新年到周第一天的总天数
            var week_day;
            if (newyear_week < 5) {
                //新年第一天算年内第一周[周四在本年]
                week_day = 7 * (weeknum - 2) + (7 - newyear_week + 1);
            } else {
                //新年第一天是上年最后一周
                week_day = 7 * (weeknum - 1) + (7 - newyear_week + 1);
            }
            var startmouch;
            for (var i = 0; i < m_days.length; i++) {
                startmouch = i;
                if (week_day > m_days[i]) {
                    week_day -= m_days[i];
                    if (i == m_days.length - 1) {
                        year++;
                        startmouch = 0;
                    }
                } else {
                    break;
                }
            }
            return [year, startmouch, week_day];
        }

        //设置周日历
        var setdaydata = function(year, weeknum, Data_obj) {
            yy_year = year;
            yy_month = weeknum;
            //获取月份天数数组
            var m_days = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            //获取周第一天日期
            var datastart = _this.weekfirstdate(year, weeknum);
            //根据日期判断显示正确的数据（比如传入的值比总周数大）
            var trueweeknum = _this.getweeknum(datastart[0], datastart[1], datastart[2]);
            calendarid.attr({
                "year": trueweeknum[0],
                "weeknum": trueweeknum[1]
            })
            $("#setyear").val(trueweeknum[0]);
            $("#setweek").val(trueweeknum[1]);
            // 开始的年月日
            // var start_y_m_d=datastart[0]+"年"+(datastart[1]+1)+"月"+datastart[2];
            // console.log(datastart[0]+"年"+(datastart[1]+1)+"月"+datastart[2])
            // calendarid.find(".calendar_info").html(trueweeknum[1]+'周/'+trueweeknum[0]);
            // calendarid.find(".calendar_info").html(start_y_m_d+"~"+start_y_m_d);

            var week_day = "";
            var isdayaddclass = false;


            if (opts.dayaddclass() !== null) {
                isdayaddclass = true;
            }
            var dayaddclass = "";
            var newdate;

            //后台是否传回数据
            var isData = false;

            for (var i = 0; i < 14; i++) {
                newdate = new Date(datastart[0], datastart[1], datastart[2] + i);
                //月份
                var month_this = newdate.getMonth() + 1;
                if (month_this < 10) {
                    month_this = "0" + month_this
                }

                //天数
                var day_this = newdate.getDate();
                var day_this_show = newdate.getDate();
                if (day_this < 10) {
                    day_this = "0" + day_this;
                    day_this_show = "0" + day_this_show;
                }

                if (isdayaddclass) {
                    dayaddclass = " " + opts.dayaddclass(newdate.getFullYear() + '-' + month_this + '-' + day_this);
                }
                var istoday = '';
                var hava_i = '';
                var todayarr = todaydate();
                if (newdate.getFullYear() == todayarr[0] && newdate.getMonth() == todayarr[1] && newdate.getDate() == todayarr[2]) {
                    istoday = '<span class="today_i">' + day_this + '</span>';
                }

                if (Data_obj) {
                    var maintenance = Data_obj.maintenance;
                    var overdue = Data_obj.overdue;
                    //有数据
                    isData = true;
                    for (var q = 0; q <= maintenance.length; q++) {
                        if (maintenance[q]) {
                            var maintenance_day = maintenance[q].bespeak.substring(maintenance[q].bespeak.length - 2, maintenance[q].bespeak.length)
                            if (maintenance_day == day_this_show) {
                                hava_i = '<span class="have_i"></span>';
                            }
                        }
                    }

                    for (var w = 0; w <= overdue.length; w++) {
                        if (overdue[w]) {
                            var ss_day = overdue[w].bespeak.substring(overdue[w].bespeak.length - 2, overdue[w].bespeak.length)
                            if (ss_day == day_this_show) {
                                $(".calendar_day_i").addClass('cur_color')
                                day_this_show = '逾期'
                            }
                        }
                    }

                } else {
                    //无数据
                    isData = false;
                }

                //			if(31==day_this_show){
                //				hava_i='<span class="have_i"></span>';
                //			}
                //			if(25==day_this_show){
                //				$(".calendar_day_i").addClass('cur_color')
                //				day_this_show='逾期'
                //			}
                if (day_this_show == '逾期') {
                    if (istoday) {
                        week_day += '<li title="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '" class="calendar_day' + dayaddclass + '" ' +
                            'date="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '">' +
                            '<span class="calendar_day_i cur_color">' + day_this_show + '</span>' + hava_i +
                            '</li>';
                    } else {
                        week_day += '<li title="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '" class="calendar_day' + dayaddclass + '" ' +
                            'date="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '">' +
                            '<span class="calendar_day_i cur_color">' + day_this_show + '</span>' + istoday + hava_i +
                            '</li>';
                    }

                } else {
                    week_day += '<li title="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '" class="calendar_day' + dayaddclass + '" ' +
                        'date="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '">' +
                        '<span class="calendar_day_i">' + day_this + '</span>' + istoday + hava_i +
                        '</li>';
                }

                if (i == 0) {
                    start_y_m_d = newdate.getFullYear() + '-' + month_this + '-' + day_this;
                    cur_data_start = newdate.getFullYear() + '年' + month_this + '月' + day_this;
                }
                if (i == 13) {
                    end_y_m_d = newdate.getFullYear() + '-' + month_this + '-' + day_this;
                    cur_data_end = newdate.getFullYear() + '年' + month_this + '月' + day_this;
                }
            }
            newdate = null;
            calendarid.find(".calendar_info").html(cur_data_start + "-" + cur_data_end);
            calendarid.find(".calendar_day_bar").html(week_day);
        }
        _this.getDatas = function() {
            var timr = {
                start_y_m_d: start_y_m_d,
                end_y_m_d: end_y_m_d
            }
            return timr
        }
        _this.setCode = function(obj) {
            return obj
        }
        _this.setWeeks = function(year, weeknum, Data_obj) {
            _this.confirmweek(year, weeknum, Data_obj)
        }

        //传入日期为当年第几周
        _this.getweeknum = function(year, month, day) {
            //获取月份天数数组
            var m_days = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var newtonowday = 0;
            for (var i = 0; i < month; i++) {
                newtonowday += m_days[i];
            }
            newtonowday += day;
            //获取当年第一天是周几
            var newyear_week = (new Date(year, 0, 1)).getDay();
            var fdaynothisy = false;
            //新年到周第一天的总天数
            if (newyear_week < 5) {
                //新年第一天算年内第一周[周四在本年]
                newtonowday += newyear_week;
                if (newyear_week == 0 && m_days[2] == 29) {
                    fdaynothisy = true;
                }
            } else {
                //新年第一天是上年最后一周
                fdaynothisy = true;
                newtonowday -= (7 - newyear_week);
            }
            var weeknum_result = Math.ceil(newtonowday / 7);
            var weekyear = year;
            if (weeknum_result == 0) {
                var beforeyear_fweek = (new Date(weekyear - 1, 0, 1)).getDay();
                if (beforeyear_fweek < 5 && beforeyear_fweek > 1 && fdaynothisy) {
                    weeknum_result = 53;
                } else {
                    weeknum_result = 52;
                }
                weekyear--;
            } else if (weeknum_result > 52) {
                var year_lweek = (new Date(year, 11, 31)).getDay();
                if (year_lweek > 3 && newyear_week < 5) {
                    weeknum_result = 53;
                } else {
                    weekyear++;
                    weeknum_result = 1;
                }
            }
            return [weekyear, weeknum_result];
        }

        //DOM添加
        _this.confirmweek = function(year, weeknum, Data_obj) {
            if (!year) year = $("#setyear").val();
            if (!weeknum) weeknum = $("#setweek").val();
            if (weeknum < 1) weeknum = 1;

            setdaydata(year, weeknum, Data_obj);

            //上一周
            calendarid.find(".beforem_btn").off("click").on("click", function() {
                    var beforew = weeknum - 2;
                    var beforeweekfirst = _this.weekfirstdate(year, beforew);
                    var beforeweekdata = _this.getweeknum(beforeweekfirst[0], beforeweekfirst[1], beforeweekfirst[2]);
                    _this.confirmweek(beforeweekdata[0], beforeweekdata[1]);

                    opts.direction(beforeweekdata[0], beforeweekdata[1]);
                })
                //下一周
            calendarid.find(".afterm_btn").off("click").on("click", function() {
                    var afterw = weeknum + 2;
                    var afterweekfirst = _this.weekfirstdate(year, afterw);
                    var afterweekdata = _this.getweeknum(afterweekfirst[0], afterweekfirst[1], afterweekfirst[2]);
                    _this.confirmweek(afterweekdata[0], afterweekdata[1]);

                    opts.direction(afterweekdata[0], afterweekdata[1]);
                })
                //本周
            calendarid.find(".back_span").off("click").on("click", function() {
                    opts.Backclick($(this).attr("date"));
                    _this.nowweek()
                })
                //day点击事件
            calendarid.find(".calendar_day").on("click", function() {
                var obj = $(this);
                opts.dayclick(obj.attr("date"), this);
            })
        }

        //本周
        _this.nowweek = function(obj) {
            var todayarr = todaydate();
            var weekdata = _this.getweeknum(todayarr[0], todayarr[1], todayarr[2]);
            if (!obj) {
                _this.confirmweek(weekdata[0], weekdata[1]);
            } else {
                _this.confirmweek(weekdata[0], weekdata[1], obj);
            }
        }
        _this.nowweek()
    },
    getDatas() {
        var timr = {
            start_y_m_d: start_y_m_d,
            end_y_m_d: end_y_m_d
        }
        return timr
    },
    //获取今天
    todaydate: function() {
        var nstr = new Date();
        var ynow = nstr.getFullYear();
        var mnow = nstr.getMonth();
        var dnow = nstr.getDate();
        return [ynow, mnow, dnow];
    },
    //本周
    newweek: function(obj) {
        var todayarr = wenkFun.todaydate();
        var weekdata = wenkFun.getweeknum(todayarr[0], todayarr[1], todayarr[2]);
        if (!obj) {
            wenkFun.confirmweek(weekdata[0], weekdata[1]);
        } else {
            wenkFun.confirmweek(weekdata[0], weekdata[1], obj);
        }
    },
    //DOM添加
    confirmweek: function(year, weeknum, Data_obj) {
        if (!year) year = $("#setyear").val();
        if (!weeknum) weeknum = $("#setweek").val();
        if (weeknum < 1) weeknum = 1;
        setdaydata(year, weeknum, Data_obj);
        //上一周
        calendarid.find(".beforem_btn").off("click").on("click", function() {
                var beforew = weeknum - 2;
                var beforeweekfirst = wenkFun.weekfirstdate(year, beforew);
                var beforeweekdata = wenkFun.getweeknum(beforeweekfirst[0], beforeweekfirst[1], beforeweekfirst[2]);
                wenkFun.confirmweek(beforeweekdata[0], beforeweekdata[1]);

                opts.direction(beforeweekdata[0], beforeweekdata[1]);
            })
            //下一周
        calendarid.find(".afterm_btn").off("click").on("click", function() {
                var afterw = weeknum + 2;
                var afterweekfirst = wenkFun.weekfirstdate(year, afterw);
                var afterweekdata = wenkFun.getweeknum(afterweekfirst[0], afterweekfirst[1], afterweekfirst[2]);
                wenkFun.confirmweek(afterweekdata[0], afterweekdata[1]);

                opts.direction(afterweekdata[0], afterweekdata[1]);
            })
            //本周
        calendarid.find(".back_span").off("click").on("click", function() {
                opts.Backclick($(this).attr("date"));
                wenkFun.newweek()
            })
            //day点击事件
        calendarid.find(".calendar_day").on("click", function() {
            var obj = $(this);
            opts.dayclick(obj.attr("date"), this);
        })
    },
    //设置周日历
    setdaydata: function(year, weeknum, Data_obj) {
        yy_year = year;
        yy_month = weeknum;
        //获取月份天数数组
        var m_days = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //获取周第一天日期
        var datastart = wenkFun.weekfirstdate(year, weeknum);
        //根据日期判断显示正确的数据（比如传入的值比总周数大）
        var trueweeknum = wenkFun.getweeknum(datastart[0], datastart[1], datastart[2]);
        calendarid.attr({
            "year": trueweeknum[0],
            "weeknum": trueweeknum[1]
        })
        $("#setyear").val(trueweeknum[0]);
        $("#setweek").val(trueweeknum[1]);
        // 开始的年月日
        // var start_y_m_d=datastart[0]+"年"+(datastart[1]+1)+"月"+datastart[2];
        // console.log(datastart[0]+"年"+(datastart[1]+1)+"月"+datastart[2])
        // calendarid.find(".calendar_info").html(trueweeknum[1]+'周/'+trueweeknum[0]);
        // calendarid.find(".calendar_info").html(start_y_m_d+"~"+start_y_m_d);

        var week_day = "";
        var isdayaddclass = false;


        if (opts.dayaddclass() !== null) {
            isdayaddclass = true;
        }
        var dayaddclass = "";
        var newdate;

        //后台是否传回数据
        var isData = false;

        for (var i = 0; i < 14; i++) {
            newdate = new Date(datastart[0], datastart[1], datastart[2] + i);
            //月份
            var month_this = newdate.getMonth() + 1;
            if (month_this < 10) {
                month_this = "0" + month_this
            }

            //天数
            var day_this = newdate.getDate();
            var day_this_show = newdate.getDate();
            if (day_this < 10) {
                day_this = "0" + day_this;
                day_this_show = "0" + day_this_show;
            }

            if (isdayaddclass) {
                dayaddclass = " " + opts.dayaddclass(newdate.getFullYear() + '-' + month_this + '-' + day_this);
            }
            var istoday = '';
            var hava_i = '';
            var todayarr = todaydate();
            if (newdate.getFullYear() == todayarr[0] && newdate.getMonth() == todayarr[1] && newdate.getDate() == todayarr[2]) {
                istoday = '<span class="today_i">' + day_this + '</span>';
            }

            if (Data_obj) {
                var maintenance = Data_obj.maintenance;
                var overdue = Data_obj.overdue;
                //有数据
                isData = true;
                for (var q = 0; q <= maintenance.length; q++) {
                    if (maintenance[q]) {
                        var maintenance_day = maintenance[q].bespeak.substring(maintenance[q].bespeak.length - 2, maintenance[q].bespeak.length)
                        if (maintenance_day == day_this_show) {
                            hava_i = '<span class="have_i"></span>';
                        }
                    }
                }

                for (var w = 0; w <= overdue.length; w++) {
                    if (overdue[w]) {
                        var ss_day = overdue[w].bespeak.substring(overdue[w].bespeak.length - 2, overdue[w].bespeak.length)
                        if (ss_day == day_this_show) {
                            $(".calendar_day_i").addClass('cur_color')
                            day_this_show = '逾期'
                        }
                    }
                }

            } else {
                //无数据
                isData = false;
            }
            if (day_this_show == '逾期') {
                if (istoday) {
                    week_day += '<li title="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '" class="calendar_day' + dayaddclass + '" ' +
                        'date="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '">' +
                        '<span class="calendar_day_i cur_color">' + day_this_show + '</span>' + hava_i +
                        '</li>';
                } else {
                    week_day += '<li title="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '" class="calendar_day' + dayaddclass + '" ' +
                        'date="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '">' +
                        '<span class="calendar_day_i cur_color">' + day_this_show + '</span>' + istoday + hava_i +
                        '</li>';
                }

            } else {
                week_day += '<li title="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '" class="calendar_day' + dayaddclass + '" ' +
                    'date="' + newdate.getFullYear() + '-' + month_this + '-' + day_this + '">' +
                    '<span class="calendar_day_i">' + day_this + '</span>' + istoday + hava_i +
                    '</li>';
            }

            if (i == 0) {
                start_y_m_d = newdate.getFullYear() + '-' + month_this + '-' + day_this;
                cur_data_start = newdate.getFullYear() + '年' + month_this + '月' + day_this;
            }
            if (i == 13) {
                end_y_m_d = newdate.getFullYear() + '-' + month_this + '-' + day_this;
                cur_data_end = newdate.getFullYear() + '年' + month_this + '月' + day_this;
            }
        }
        newdate = null;
        calendarid.find(".calendar_info").html(cur_data_start + "-" + cur_data_end);
        calendarid.find(".calendar_day_bar").html(week_day);
    },
    //判断是否为闰年
    is_leap: function(year) {
        return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
    },
    //获取周第一天日期方法
    weekfirstdate: function(year, weeknum) {
        //获取当年月份天数数组
        var m_days = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //获取当年第一天是周几
        var newyear_week = (new Date(year, 0, 1)).getDay();
        //新年到周第一天的总天数
        var week_day;
        if (newyear_week < 5) {
            //新年第一天算年内第一周[周四在本年]
            week_day = 7 * (weeknum - 2) + (7 - newyear_week + 1);
        } else {
            //新年第一天是上年最后一周
            week_day = 7 * (weeknum - 1) + (7 - newyear_week + 1);
        }
        var startmouch;
        for (var i = 0; i < m_days.length; i++) {
            startmouch = i;
            if (week_day > m_days[i]) {
                week_day -= m_days[i];
                if (i == m_days.length - 1) {
                    year++;
                    startmouch = 0;
                }
            } else {
                break;
            }
        }
        return [year, startmouch, week_day];
    },
    //传入日期为当年第几周
    getweeknum(year, month, day) {
        //获取月份天数数组
        var m_days = [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var newtonowday = 0;
        for (var i = 0; i < month; i++) {
            newtonowday += m_days[i];
        }
        newtonowday += day;
        //获取当年第一天是周几
        var newyear_week = (new Date(year, 0, 1)).getDay();
        var fdaynothisy = false;
        //新年到周第一天的总天数
        if (newyear_week < 5) {
            //新年第一天算年内第一周[周四在本年]
            newtonowday += newyear_week;
            if (newyear_week == 0 && m_days[2] == 29) {
                fdaynothisy = true;
            }
        } else {
            //新年第一天是上年最后一周
            fdaynothisy = true;
            newtonowday -= (7 - newyear_week);
        }
        var weeknum_result = Math.ceil(newtonowday / 7);
        var weekyear = year;
        if (weeknum_result == 0) {
            var beforeyear_fweek = (new Date(weekyear - 1, 0, 1)).getDay();
            if (beforeyear_fweek < 5 && beforeyear_fweek > 1 && fdaynothisy) {
                weeknum_result = 53;
            } else {
                weeknum_result = 52;
            }
            weekyear--;
        } else if (weeknum_result > 52) {
            var year_lweek = (new Date(year, 11, 31)).getDay();
            if (year_lweek > 3 && newyear_week < 5) {
                weeknum_result = 53;
            } else {
                weekyear++;
                weeknum_result = 1;
            }
        }
        return [weekyear, weeknum_result];
    }

}
export default wenkFun