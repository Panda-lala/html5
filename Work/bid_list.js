$(function () {
    api_bid_list(0);

    //tab 切换
    $(".nav li").click(function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        $('#typeStatus').val($(this).find('a').attr('data-status'));
        api_bid_list();
    });

    $('#btnSearch').click(function () {
        api_bid_list()
    })
});

function api_bid_list() {
    $.ajax({
        url: createUrl('shop/index.php?act=tender_bids&op=bid_list'),
        type: "post",
        data: {
            tender_name: $.trim($('input[name="tender_name"]').val()),
            org_name: $.trim($('input[name="org_name"]').val()),
            start_time: $.trim($('input[name="start_time"]').val()),
            end_time: $.trim($('input[name="end_time"]').val()),
            status: $('#typeStatus').val()
        },
        dataType: "json",
        success: function (rs) {
            rs = JSON.stringify(rs);
            rs = rs.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            rs = JSON.parse(rs);
            if (rs.resultCode == 1000) {
                var pageSize = rs.value.data.get_value.PageSize; //每页出现的数量
                var totalCount = rs.value.data.get_value.TotalCount; //数据总条数
                var totalPage = Math.ceil(totalCount / pageSize); //得到总页数
                function appendData(data) {
                    var str = "";
                    $.each(data, function (index, value) {
                        var newindex = index + 1, newclass;
                        if (newindex % 2 == 0) {
                            newclass = 'noborder table-sil'
                        } else {
                            newclass = 'noborder'
                        }
                        str += '<tr class="' + newclass + '">';
                        str += '<td class="notice_img"></td>';
                        str += '<td class="notice_index">' + newindex + '</td>';
                        str += '<td class="on"><a href="' + value.bid_url + '">' + value.tender_name + '</a></td>';
                        str += '<td>' + value.org_name + '</td>';
                        str += '<td>' + value.create_time + '</td>';
                        str += '<td>' + value.enroll_status + '</td>';
                        str += '<td>' + value.tender_style + '</td>';
                        str += '<td>' + value.area_name + '</td>';
                        str += '</tr>';

                    });
                    $("#biuuu_city_list").empty().append(str);
                }

                appendData(rs.value.data.tender);
                laypage({
                    cont: "biuuu_city",
                    pages: totalPage,
                    skip: true,
                    skin: "molv",
                    groups: 2,
                    first: "首页",
                    last: "尾页",
                    prev: "<",
                    next: ">",
                    jump: function (e, first) {
                        $(".laypage_skip").val(1);
                        $(".laypage_skip").blur(function () {
                            if ($(this).val() == 0) {
                                $(this).val(1)
                            }
                        });

                        if (!first) {
                            $(".laypage_skip").val(e.curr);
                            $.ajax({
                                async: false,
                                type: "POST",
                                url: createUrl('shop/index.php?act=tender_bids&op=bid_list'),
                                data: {
                                    PageIndex: e.curr,
                                    tender_name: $.trim($('input[name="tender_name"]').val()),
                                    org_name: $.trim($('input[name="org_name"]').val()),
                                    start_time: $.trim($('input[name="start_time"]').val()),
                                    end_time: $.trim($('input[name="end_time"]').val()),
                                    status: $('#typeStatus').val()
                                },
                                dataType: "json",
                                success: function (data) {
                                    data = JSON.stringify(data);
                                    data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                    data = JSON.parse(data);
                                    appendData(data.value.data.tender);
                                }
                            })
                        }
                    }
                })
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown)
        },
        dataType: 'json'
    });
}