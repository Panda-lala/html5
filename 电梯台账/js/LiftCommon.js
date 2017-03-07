/**
 * Created by zhaoxue on 16/8/17.电梯系统共用文件
 */

$(function () {
    var curDataPickerIndex = 0;


    //表格可编辑区域颜色区分

    $(".TableEditer tr td:nth-child(2)").addClass("bg-warning");
    $(".TableEditer tr td:nth-child(9)").addClass("bg-warning");
    $(".TableEditer tr td:nth-child(10)").addClass("bg-warning");
    $(".TableEditer tr td:nth-child(11)").css({"background-color": "#ffc09f"});

    //日期只显示年月

    $(".selectMonth").focus(function () {
        selectMonth();
    });

    var selectMonth = function () {
        WdatePicker({
            dateFmt: 'yyyy-MM',
            isShowToday: false,
            isShowClear: false
        })
    };

    //电梯台账日期

    $("._dateShow").click(function () {
        _ShowMonth();
    });

    var _ShowMonth = function () {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd',
            isShowToday: false,
            isShowClear: false
        })
    };

    //可编辑表格计划作业时间选择时分秒后同列一同取值


    $(".dayDate").click(function () {
        curDataPickerIndex = $('.dayDate').index(this);
        WdatePicker({
            dateFmt: 'HH:mm:ss',
            onpicking: function (dp) {
                if (!confirm('日期框原来的值为: ' + dp.cal.getDateStr() + ', 要用新选择的值:' + dp.cal.getNewDateStr() + '覆盖吗?')) return true;
                var _DateSame = dp.cal.getNewDateStr();
                $.each($('.dayDate'), function (i, item) {
                    if (i >= curDataPickerIndex) {
                        $(item).val(_DateSame);
                    }
                });
            }
        })
    });

    //可编辑表格计划作业时间总和选择时分秒后同列一同取值

    $(".num_dayDate").click(function () {
        curDataPickerIndex = $('.num_dayDate').index(this);
        WdatePicker({
            dateFmt: 'HH:mm:ss',
            onpicking: function (dp) {
                if (!confirm('日期框原来的值为: ' + dp.cal.getDateStr() + ', 要用新选择的值:' + dp.cal.getNewDateStr() + '覆盖吗?')) return true;
                var _DateSame = dp.cal.getNewDateStr();
                $.each($('.num_dayDate'), function (i, item) {
                    if (i >= curDataPickerIndex) {
                        $(item).val(_DateSame);
                    }
                });
            }
        })
    });


    //计划时间 开始

    $(".startime").click(function () {
        var d5222 = $dp.$('d5222');
        WdatePicker({
            dateFmt: 'yyyy-MM HH:mm:ss',
            onpicked: function () {
                d5222.focus();
            },
            maxDate: '#F{$dp.$D(\'d5222\')}'
        });
    });


    //计划时间 结束

    $(".endtime").click(function () {
        WdatePicker({
            dateFmt: 'yyyy-MM HH:mm:ss',
            minDate: '#F{$dp.$D(\'d5221\')}'
        });
    });


    //完成时间 开始

    $(".startime1").click(function () {
        var d5224 = $dp.$('d5224');
        WdatePicker({
            dateFmt: 'yyyy-MM HH:mm:ss',
            onpicked: function () {
                d5224.focus();
            },
            maxDate: '#F{$dp.$D(\'d5224\')}'
        });
    });


    //完成时间 结束

    $(".endtime1").click(function () {
        WdatePicker({
            dateFmt: 'yyyy-MM HH:mm:ss',
            minDate: '#F{$dp.$D(\'d5223\')}'
        });
    });


    //完结时间 开始

    $(".startime2").click(function () {
        var d5226 = $dp.$('d5226');
        WdatePicker({
            dateFmt: 'yyyy-MM HH:mm:ss',
            onpicked: function () {
                d5226.focus();
            },
            maxDate: '#F{$dp.$D(\'d5226\')}'
        });
    });


    //完结时间 结束

    $(".endtime2").click(function () {
        WdatePicker({
            dateFmt: 'yyyy-MM HH:mm:ss',
            minDate: '#F{$dp.$D(\'d5225\')}'
        });
    });

    //电梯台账

    $("._dateShow").click(function () {
        curDataPickerIndex = $('._dateShow').index(this);
        ShowMonth();
    });

    var ShowMonth = function () {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd',
            isShowToday: false,
            isShowClear: false,
            onpicking: function (dp) {
                if (!confirm('日期框原来的值为: ' + dp.cal.getDateStr() + ', 要用新选择的值:' + dp.cal.getNewDateStr() + '覆盖吗?')) return true;
                var DateSame = dp.cal.getNewDateStr();
                $.each($('._dateShow'), function (i, item) {
                    if (i >= curDataPickerIndex) {
                        $(item).val(DateSame);
                    }
                });
            }
        })
    };

    //维保单位弹窗

    $('#insert_lift,#insert_lift2,#insert_lift3').on('shown.bs.modal', function () {

        $('.input_maintenance').focus(function () {
            $('#maintenance').modal('show');
        });

        $(".modal-dialog").on('click', function () {
            $(':input[name=radio]').click(function () {
                $name = $(this).attr('data-name');
                $('.input_maintenance').val($name);
                $('#maintenance').modal('hide');
            });
        });
        $('.input_maintenance').val('');
    });


    //设施查询弹窗

    $('#insert_lift,#insert_lift2').on('shown.bs.modal', function () {

        $('.input-facility').focus(function () {
            $('#facility').modal('show');
        });

        $(".modal-dialog").on('click', function () {
            $(':input[name=sradio]').click(function () {
                _$name = $(this).attr('data-sname');
                $('.input-facility').val(_$name);
                $('#facility').modal('hide');
            });
        });
        $('.input-facility').val('');
    });

    //按住delete

    window.document.onkeydown = disableRefresh;
    function disableRefresh(evt) {
        evt = (evt) ? evt : window.event;
        if (evt.keyCode) {
            if (evt.keyCode == 8) {
                //do something
                $(".dateHide").removeClass("_dateShow");
                $(".WdayTable").hide();
            }
        }
    }


    $("#checkedAll").click(function () {
        checkedAll();
    });

    var checkedAll = function () {
        var oBtn = document.getElementById('checkedAll');
        //var aInput = document.getElementsByTagName('input');
        var aInput = $(':checkbox');
        var i = 0;
        for (i = 0; i < aInput.length; i++) {
            //aInput[i].checked=true;
            var e = aInput[i];
            e.checked = !e.checked;
        }
    }
    /*全选*/

    //上移

    var $up = $(".up");
    $up.click(function () {
        var $tr = $(this).parents("tr");
        if ($tr.index() != 0) {
            $tr.fadeOut(500).fadeIn(500);
            $tr.prev().before($tr);

        }
    });

    //下移

    var $down = $(".down");
    var len = $down.length;
    $down.click(function () {
        var $tr = $(this).parents("tr");
        if ($tr.index() != len - 1) {
            $tr.fadeOut(500).fadeIn(500);
            $tr.next().after($tr);
        }
    });


    //tag

    $(".sidebar-menu li a").on('click', function () {
        $(".ban").show().delay(250).hide(40);
        var a = "";
        var tag = true;
        var t = $(this).text();
        $('.tag li').each(function (index, ele) {
            var a = $(ele).find("a").text();
            if (t == a) {
                tag = false;
                $(ele).addClass('activetag').siblings().removeClass('activetag');
                return;
            }
        });

        var li_length = $('.tag li').length;
        if (tag) {
            if (li_length < 6) {
                $(".tag li").removeClass('activetag');
                $(".tag ul").append('<li uri="' + $(this).attr("uri") + '" class="activetag" ><a><i class="icon-right fa fa-folder-open fa-lg"></i>' + t + '</a><i class="icon-x fa fa-close"></i></li>');
            } else {
                alert('不能超过6个标签');
            }
        }

        $('.tag li').click(function () {
            $(this).addClass('activetag').siblings().removeClass('activetag');
            $("#myTabContent").load($(this).attr("uri"));
        });

        $(".icon-x").click(function () {
            $(this).parent().remove();
            $(".tag ul").each(function (i) {
                var x = $(".tag ul li").length;
                var y = $(this).children().last();
                alert(y);
                if (x == 0) {
                    $("#myTabContent").html("");
                } else {
                    $("#myTabContent").load(y.attr("uri"));
                }

            });
        });

    });

    //$(".TableEditer tbody tr td").first().empty().append("<a>下移</a>");
    //$(".TableEditer tbody tr td").last().empty().append("<a>44上移</a>");


});