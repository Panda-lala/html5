var baseUrl = getBaseUrl();

$(function () {
    var intervalID, curLi;
    var oLis = $("#j_tabNav2 li").not('.tbnav');
    var oDivs = $(".sub-con");
    var tenderId = $("#j_tabNav2").attr('tender_id');
    /*gonggao(1)  biangeng(1)  zhaobiao(1)  my_file(1,6,1)  dayi(1)  chengqing(2)*/
    var funcAry = ['gonggao', 'biangeng', 'zhaobiao', 'my_file', 'dayi', 'chengqing', 'bidResult'];
    for (var i = 0; i < oLis.length; i++) {
        (function (index) {
            oLis[index].onclick = function () {
                var cName = "";
                for (var j = 0; j < oLis.length; j++) {
                    cName = oLis[j].className;
                    oLis[j].className = cName.replace('selected', '');
                    oDivs[j].className = "sub-con";
                }
                cName = oLis[index].className;
                //点击之后不再显示变更样式
                if (cName == "active") {
                    cName = "";
                }
                oLis[index].className = cName + " selected";
                oDivs[index].className = "sub-con cur-sub-con";
                if (index == 3) {
                    eval(funcAry[index] + '(' + tenderId + ',' + oLis[index].getAttribute('wheel') + ')');
                } else {
                    eval(funcAry[index] + '(' + tenderId + ')');
                    if (index == 1) {
                        checkChangeStatus('ViewChangement');
                    } else if (index == 4) {
                        checkChangeStatus('ViewBidQuestion');
                    } else if (index == 5) {
                        checkChangeStatus('ViewBidClarification');
                    }
                }
            }
        })(i)
    }
    paramTabChange();
})

//定标
function bidResult(tender_id) {
    $.ajax({
        url: "index.php?act=tender_bids&op=result_bid&tender_id=" + tender_id,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.resultCode == 1000) {
                var str = '';
                var datas = data.value.data;
                for (var i = 0; i < datas.length; i++) {
                    str += '<p class="bid_result">恭喜您，在"' + datas[i].list_name + '"，' + (datas[i].area == '' ? '' : (datas[i].area + '城市')) + ' 中标！</p>';
                }
                $('.result_content').empty().append(str);
            }
        }
    })
}

/*公告文件*/
function gonggao(tender_id) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=bid_notices&tender_id=" + tender_id,
        success: function (json) {
            var data = json.value.data, strFiles = '', myFiles = '';

            createEditor('txtNotice', data.announcement);

            /*公告附件*/
            var fujian = data.notice_attach;
            if (fujian != null) {
                $.each(fujian, function (i, item) {
                    strFiles += '<li class="attachli"><a href="' + item.file_path + '" title = "' + item.file_name + '.' + item.file_ext + '" target="_blank"><img src="' + baseUrl + 'enterprise/images/tb_fujian.png" alt=""/>' + item.file_name + '.' + item.file_ext + '</a></li>';
                })
            } else {
                strFiles += '<li>&nbsp;暂无附件</li>';
            }
            $('.noticefiles').empty().append(strFiles);

            /*我的附件*/
            var myfujian = data.signup_attach;
            if (myfujian != null) {
                var imgContent = getNowFormatDate($(".deadline").attr('date'));
                $.each(myfujian, function (i, item) {
                    if (imgContent != "" && getNowFormatDate() < imgContent) {
                        myFiles += '<li class="attachli"><a href="' + item.file_path + '" title="' + item.file_name + '.' + item.file_ext + '" target="_blank"><img src="' + baseUrl + 'enterprise/images/tb_fujian.png" alt=""/>' + item.file_name + '.' + item.file_ext + '</a><span class="delimg" onclick="delet(this,' + item.id + ',' + tender_id + ')"></span></li>';
                    } else {
                        myFiles += '<li class="attachli"><a href="' + item.file_path + '" title="' + item.file_name + '.' + item.file_ext + '" target="_blank"><img src="' + baseUrl + 'enterprise/images/tb_fujian.png" alt=""/>' + item.file_name + '.' + item.file_ext + '</a></li>';
                    }
                });
            } else {
                myFiles += '<li>&nbsp;暂无附件</li>'
            }
            $('.myfiles').empty().append(myFiles);
        }
    });
}

/*删除附件*/
function delet(obj, id, tender_id) {
    var $obj = $(obj);
    if (window.confirm("确定删除该附件吗？")) {
        $.ajax({
            type: "POST",
            async: false,
            url: "index.php?act=tender_bids&op=attach_delete",
            data: {'attach_id': id, 'tender_id': tender_id},
            dataType: "json",
            success: function (json) {
                if (json.resultCode == 1000)
                    $obj.parent().remove();
                else
                    alert(json.message);
            }
        });
    }
}

function checkContent(obj) {
    if ($(obj).text().indexOf('招标文件') > -1) {
        $('.tabnav li').eq(2).click();
    } else {
        $('.tabnav li').eq(0).click();
    }
}

/*变更*/
function biangeng(tender_id) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=bid_modifys&tender_id=" + tender_id,
        data: {'tender_id': tender_id},
        success: function (json) {
            if (json.resultCode != 1000) {
                $("#tbChange").empty().append('<tr><th>暂无变更内容</th></tr>')
                return;
            }
            var data = json.value.data.modify;
            var cont = '';
            $.each(data, function (i, item) {
                var newindex = i + 1;
                var newclass;
                if (newindex % 2 == 0) {
                    newclass = 'noborder table-sil'
                } else {
                    newclass = 'noborder'
                }
                ;
                cont += '<tr class="' + newclass + '">';
                cont += '<td>' + newindex + '</td>';
                cont += '<td>' + item.happentime + '</td>';
                cont += '<td>' + item.type + '</td>';
                cont += '<td>' + item.remark + '</td>';
                cont += '<td><a data-changeId="' + item.change_id + '" class="z-details">查看详情</a></td>';
                cont += '</tr>';
            });
            $("#tbChange tbody").empty().append(cont);
            $(".z-details").click(function () {
                $(this).parent().parent().addClass('select').siblings().removeClass('select');
                var change_id = $(this).attr('data-changeId');
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "index.php?act=tender_bids&op=bid_modify_detail&tender_id=" + tender_id + "&change_id=" + change_id,
                    success: function (json) {
                        if (json.resultCode = 1000) {
                            var data = json.value.data;
                            var cont = '<h2 class="change_title">变更详情</h2><ul class="change_detail">';

                            if (data.date != undefined) {
                                cont += '<li><h1>投标截止时间变更:</h1><p class="c1">变更后:' + data.date.current_date + '</p><p>变更前:' + data.date.origin_date + '</p></li>';
                            }
                            if (data.summary != undefined) {
                                cont += '<li><h1>' + data.type + '内容或原因变更:</h1><a style="position: absolute; right: 0; top: 10px;text-decoration: underline;" onclick="checkContent(this)">查看原始' + data.type + '内容</a><div class="change_detail_con">' + data.summary.changed_summary + '</div></li>';
                            }
                            if (data.attach != undefined) {
                                cont += '<li><h1>' + data.type + '附件变更:<span style="display:none">查看原始招标文件</span></h1><p>'
                                for (var i = 0; i < data.attach.length; i++) {
                                    cont += '<a href="' + data.attach[i].file_path + '"><img src="' + getBaseUrl() + 'enterprise/images/tb_fujian.png" alt="">' + data.attach[i].file_name + '.' + data.attach[i].file_ext + '</a>';
                                }
                                cont += '</p></li>';
                            }
                            if (data.list != undefined) {
                                cont += '<li><h1>清单变更:</h1><p><a href="' + createUrl("shop/index.php?act=tender_bids&op=bid_detail&tender_id=" + tender_id) + '">查看最新清单</a></p></li>';
                            }
                            cont += '</ul>';

                            $('.change_content').empty().append(cont);
                            $(".change_detail li").addClass("change_detail_xian");
                            $(".change_detail li:last").removeClass("change_detail_xian");
                        }
                    }
                });
            });

        }
    });
}

/*招标文件*/
function zhaobiao(tender_id) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=bid_filess",
        data: {'tender_id': tender_id},
        success: function (datas) {
            if (datas.resultCode != 1000) {
                $('#tbBusiness').empty().append('<tr><th>暂无商务条款</th></tr>');
                return;
            }
            var data = datas.value.data;
            var tenderFiles = '', fixedContent = '', bussContent = '', floatContent = '';

            createEditor('txtTender', data.tender_content);

            if (data.attach != null) {
                $.each(data.attach, function (i, item) {
                    tenderFiles += '<li class="attachli"><a href="' + item.file_path + '" title="' + item.file_name + '" target="_blank"><img src="' + baseUrl + 'enterprise/images/tb_fujian.png" alt=""/>' + item.file_name + '</a></li>';
                })
            } else {
                tenderFiles += '<li>&nbsp;暂无附件</li>';
            }
            $(".tenderfiles").empty().append(tenderFiles);

            /*采购清单*/
            var detail = data.detail;
            var template = detail.list;
            var content = detail.content;

            var str = '<div class="list_template">';//模版导航
            var strContent = '';//数据表格内容
            for (var i = 0; i < template.length; i++) {
                for (var j = 0; j < content.length; j++) {
                    if (template[i].id == content[j].id) {
                        var columns = content[j].data.columnData;
                        var dataContent = content[j].data.data;
                        strContent += '<div class="city_bg"><table cellspacing="0" style="display: table;"><thead><tr class="nobg">';

                        var strHeader = '', strTbody = '';
                        for (var o = 0; o < dataContent.length; o++) {
                            if (o % 2 == 0) {
                                strTbody += '<tr class="table-oil">';
                            } else {
                                strTbody += '<tr class="table-sil">';
                            }
                            for (var k = 0; k < columns.length; k++) {
                                //只显示可显示字段
                                if (columns[k].visible == false) {
                                    continue;
                                }
                                //渲染表头和数据
                                if (o == 0)
                                    strHeader += '<th>' + columns[k].headerText + '</th>';
                                strTbody += '<td>' + (dataContent[o][columns[k].columnName] == null ? '' : dataContent[o][columns[k].columnName]) + '</td>';
                            }
                            strTbody += '</tr>';
                        }

                        strContent += strHeader + '</tr></thead><tbody>' + strTbody;
                        strContent += '</tbody></table></div>';
                        break;
                    }
                }
                str += '<a title="' + template[i].name + '"><span>' + template[i].name + '</span></a>';
            }
            str += '</div>';

            $('.zhaobiao .list_template').empty().append(str);
            $('.zhaobiao .template_content_wrap').empty().append(strContent);

            //切换模版
            $('.zhaobiao .list_template a').on('click', function () {
                var i = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $('.zhaobiao .city_bg').eq(i).show().siblings().hide();
            });
            $('.zhaobiao .list_template a').eq(0).click();

            /*商务、技术条款*/

            //has_business_terms 1商务条款显示 0不显示
            var businessStr = '', tecStr = '';
            var business = data.terms;

            for (var bIndex = 0; bIndex < business.length; bIndex++) {
                var item = business[bIndex];
                if (item.terms_type == 0) {
                    businessStr += '<tr data="' + item.id + '"><td>' + item.terms + '</td><td>' + item.standard + '</td><td>' + item.remark + '</td></tr>'
                } else {
                    tecStr += '<tr data="' + item.id + '"><td>' + item.terms + '</td><td>' + item.standard + '</td><td>' + item.remark + '</td></tr>'
                }
            }
            if (businessStr != '') {
                $('#tbBusiness').empty().append('<thead><tr class="nobg"><th>商务条款</th><th>标注</th><th class="state">说明</th></tr></thead><tbody>' + businessStr + '</tbody>');
                $('#tbBusiness tbody tr').each(function (index, item) {
                    if (index % 2 != 0) {
                        $(this).addClass('table-sil');
                    }
                })
            }
            else
                $('#tbBusiness').empty().append('<tr><th>暂无商务条款</th></tr>');

            if (tecStr != '') {
                $('#tbTech').empty().append('<thead><tr class="nobg"><th>技术条款</th><th>标注</th><th class="state">说明</th></tr></thead><tbody>' + tecStr + '</tbody>');
                $('#tbTech tbody tr').each(function (index, item) {
                    if (index % 2 != 0) {
                        $(this).addClass('table-sil');
                    }
                })
            }
            else
                $('#tbTech').empty().append('<tr><th>暂无技术条款</th></tr>');
        }
    });
}

/*我的投标文件*/
function my_file(tender_id, wheel) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=bid_my_filess",
        data: {'tender_id': tender_id, "wheel": wheel},
        success: function (my_data) {
            if (my_data.resultCode != 1000) {
                $(".mytenderfiles").empty().append('<li>&nbsp;暂无附件</li>');
                $('#tbMyBusiness').empty().append('<tr><th>暂无商务条款</th></tr>');
                return;
            }

            var data = my_data.value.data;
            var myFiles = '', fixedContent = '';

            //投标说明  暂时隐藏
            //$('#txtMyTender').parent().css('display', 'none');
            createEditor('txtMyTender', data.description, 'readOnly');

            //采购清单
            var detail = data.bidlist;
            var template = detail.list;
            var content = detail.content;

            var str = '';//模版导航
            var strContent = '';//数据表格内容
            var statusSrc = '', isDisabled = '', strAdjust = '';
            if (getNowFormatDate() >= getNowFormatDate($(".deadline").attr('date'))) {
                isDisabled = 'disabled';
            }
            for (var i = 0; i < template.length; i++) {
                var isAdjust = '';
                var adjustFlag = template[i].need_adjust_price;

                if (adjustFlag != undefined && adjustFlag == 0) {
                    isAdjust = 'disabled';
                }

                //需要调价的模版
                if (adjustFlag == 1) {
                    strAdjust += '<a data-index="' + i + '" title="' + template[i].name + '"><span>' + template[i].name + '</span></a>'
                }

                var flag = true, count = 0, countRecord = 0;// 判断清单填写状态标示
                for (var j = 0; j < content.length; j++) {
                    if (template[i].id == content[j].id) {
                        var columns = content[j].data.columnData;
                        var datas = content[j].data.data;
                        strContent += '<div class="city_bg"><table cellspacing="0" style="display: table;"><thead><tr class="nobg">';

                        var isEditeNum = 0;//可编辑列数
                        for (var p = 0; p < columns.length; p++) {
                            if (columns[p].enableEdit == true) {
                                isEditeNum++;
                            }
                        }

                        var strHeader = '', strTbody = '';
                        countRecord = datas.length * isEditeNum;

                        for (var o = 0; o < datas.length; o++) {
                            if (o % 2 == 0) {
                                strTbody += '<tr class="table-oil">';
                            } else {
                                strTbody += '<tr class="table-sil">';
                            }
                            for (var k = 0; k < columns.length; k++) {
                                //只显示可显示字段
                                if (columns[k].visible == false) {
                                    continue;
                                }
                                //渲染表头和数据
                                if (columns[k].enableEdit == true) {
                                    if (o == 0)
                                        strHeader += '<th class = "titlebold">' + columns[k].headerText + '</th>';
                                    if (columns[k].isRequired && (datas[o][columns[k].columnName] == '' || datas[o][columns[k].columnName] == null)) {
                                        flag = false;
                                        count++;
                                    } else {
                                        flag = flag && true;
                                    }
                                    strTbody += '<td><input data-coltype = "' + columns[k].columnType + '" data-required = "' + columns[k].isRequired + '" ' + isAdjust + ' ' + isDisabled + ' data-coluname="' + columns[k].columnName + '" data-id="' + datas[o]["id"] + '" type = "text" class= "price" value = "' + (datas[o][columns[k].columnName] == null ? '' : datas[o][columns[k].columnName]) + '" style = "border: none;" ></td>';
                                } else {
                                    if (o == 0)
                                        strHeader += '<th>' + columns[k].headerText + '</th>';
                                    strTbody += '<td>' + (datas[o][columns[k].columnName] == null ? '' : datas[o][columns[k].columnName]) + '</td>';
                                }
                            }
                            strTbody += '</tr>';
                        }

                        strContent += strHeader + '</tr></thead><tbody>' + strTbody;
                        strContent += '</tbody></table></div>';
                        break;
                    }
                }
                if (flag) {
                    statusSrc = getBaseUrl() + 'enterprise/images/Blue.png';
                } else if (!flag && count > 0 && count < countRecord) {
                    statusSrc = getBaseUrl() + 'enterprise/images/Grey.png';
                } else if (!flag && count == countRecord) {
                    statusSrc = getBaseUrl() + 'enterprise/images/Red.png';
                }
                str += '<a data-id="' + template[i].id + '" title="' + template[i].name + '"><span>' + template[i].name + '</span><i><img src="' + statusSrc + '"></i></a>';
            }
            str += '';

            if (strAdjust)
                $('.toubiao .adjust_template').empty().append('<span style="font-weight: bold;">需调价清单：</span>' + strAdjust);
            else
                $('.toubiao .adjust_template').hide();

            $('.toubiao .list_template_title').empty().append(str);
            $('.toubiao .template_content_wrap').empty().append(strContent);

            if (getNowFormatDate() > getNowFormatDate($(".deadline").attr('date'))) {
                $('.save_list_btn').hide();
            }
            //保存清单
            $('.toubiao .save_list_btn').unbind('click').on('click',function (ev) {
                if (saveList('btn')) {
                    alert('保存成功！');
                }
            })

            $('.toubiao .adjust_template a').unbind('click').on('click', function () {
                var index = $(this).attr('data-index');
                $(this).addClass('active').siblings().removeClass('active');
                $('.toubiao .list_template_title a').eq(index).click();
            })

            //切换模版
            $('.toubiao .list_template_title a').unbind('click').on('click', function () {
                if (getNowFormatDate() < getNowFormatDate($(".deadline").attr('date'))) {
                    if (!saveList('tab')) {
                        return false;
                    }
                }
                var i = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $('.toubiao .city_bg').eq(i).show().siblings().hide();

                var aObj = $('.toubiao .adjust_template a');
                for (var oIndex = 0; oIndex < aObj.length; oIndex++) {
                    aObj.removeClass('active');
                    if (i == aObj[oIndex].getAttribute('data-index')) {
                        aObj[oIndex].className = 'active';
                        break;
                    }
                }
            });

            if ($('.toubiao .list_template_title a').length > 0) {
                $('.toubiao .list_template_title a').eq(0).addClass('active');
                $('.toubiao .city_bg').eq(0).show();
            }

            /*附件*/
            if (data.attach != null) {
                var imgContent = getNowFormatDate($(".deadline").attr('date'));
                $.each(data.attach, function (i, item) {
                    if (imgContent != "" && getNowFormatDate() < imgContent) {
                        myFiles += '<li class="attachli"><a href="' + item.file_path + '" target="_blank" title="' + item.file_name + '" target="_blank"><img src="' + baseUrl + 'enterprise/images/tb_fujian.png" alt=""/>' + item.file_name + '</a><span class="delimg" onclick="delet(this,' + item.id + ',' + tender_id + ')"></span></li>'
                    } else {
                        myFiles += '<li class="attachli"><a href="' + item.file_path + '" target="_blank" title="' + item.file_name + '" target="_blank"><img src="' + baseUrl + 'enterprise/images/tb_fujian.png" alt=""/>' + item.file_name + '</a></li>'
                    }
                });
            } else {
                myFiles += '<li>&nbsp;暂无附件</li>';
            }
            $(".mytenderfiles").empty().append(myFiles);

            //has_business_terms 1商务条款显示 0不显示
            var businessStr = '', tecStr = '';
            var business = data.terms;

            for (var bIndex = 0; bIndex < business.length; bIndex++) {
                var item = business[bIndex];
                if (item.terms_type == 0) {
                    businessStr += '<tr data="' + item.id + '"><td>' + item.business_item + '</td><td>' + item.standard + '</td><td>' + item.remark + '</td><td><input type="text" value="' + (item.terms == null ? "" : item.terms) + '"/></td></tr>'
                } else {
                    tecStr += '<tr data="' + item.id + '"><td>' + item.business_item + '</td><td>' + item.standard + '</td><td>' + item.remark + '</td><td><input type="text" value="' + (item.terms == null ? "" : item.terms) + '"/></td></tr>'
                }
            }
            if (businessStr != '') {
                $('#tbMyBusiness').empty().append('<thead><tr class="nobg"><th>商务条款</th><th>标注</th><th class="state">说明</th><th class="titlebold">供应商说明</th></tr></thead><tbody>' + businessStr + '</tbody>');
                $('#tbMyBusiness tbody tr').each(function (index, item) {
                    if (index % 2 != 0) {
                        $(this).addClass('table-sil');
                    }
                })
            }
            else
                $('#tbMyBusiness').empty().append('<tr><th>暂无商务条款</th></tr>');

            if (tecStr != '') {
                $('#tbMyTech').empty().append('<thead><tr class="nobg"><th>技术条款</th><th>标注</th><th class="state">说明</th><th class="titlebold">供应商说明</th></tr></thead><tbody>' + tecStr + '</tbody>');
                $('#tbMyTech tbody tr').each(function (index, item) {
                    if (index % 2 != 0) {
                        $(this).addClass('table-sil');
                    }
                })
            }
            else
                $('#tbMyTech').empty().append('<tr><th>暂无技术条款</th></tr>');
        },
        complete: function () {
            $('#tbMyFixed').find('tr').each(function () {
                var stu = $(this).find('td').eq(3).find('input').val();
                /*如果为Null*/
                if (stu == 'null') {
                    $(this).find('td').eq(3).find('input').val('');
                }

            });
            $("#tbMyFloat").find('tr').each(function () {
                if ($(this).find('td').eq(7).find('input').val() == 'null') {
                    $(this).find('td').eq(7).find('input').val('')
                }
            })

        }

    });
}

/*招标答疑*/
function dayi(tender_id) {
    var questionValue = $("#questionBox").find('textarea').val();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=question_answers",
        data: {'tender_id': tender_id, 'submitcontent': questionValue},
        success: function (json) {
            if (json.resultCode != 1000) {
                return false;
            }
            var data = json.value.data.data || [], content = '';
            $.each(data, function (i, item1) {
                content += '<div class="commentBox"><div class="mycomment"><span class="asktime">提问时间：' + item1.create_time + '</span>';
                if (item1.can_inquiry === 1) {
                    content += '<a class="btnContinue" href="javascript:void(0)" onclick="askContinue(this,' + tender_id + ',' + item1.ques_id + ')">继续提问</a>';
                }

                content += (item1.is_answer == 1) ? '<span class="response">已解答</span>' : '<span class="unsolved">未解答</span>';
                content += '</div><div class="clear:both"></div><div class="question"><p class="quescontent"><span class="questionname">问题:</span>' + item1.ques_content + '</p>';

                //初始问题回复
                $.each(item1.answer, function (j, item2) {
                    content += '<div class="replay"><p><a href="javascript:void(0)" class="replybutton">回复:</a>' + item2.answer_content + '</p></div><div class="time"><ul class="attachment">';
                    $.each(item2.attachments, function (k, item3) {
                        content += '<li><span>' + item3.name + '</span><a href="' + item3.url + '" target="_blank">下载</a></li>';
                    });
                    content += '</ul><p>回复时间：<span>' + item2.create_time + '</span></p></div>';
                });
                content += '</div>'

                //追问问题
                $.each(item1.quechildlist, function (j, item2) {
                    content += '<div class="question"><p class="quescontent"><span class="questionname">追问:</span>' + item2.ques_content + '</p>';

                    //追问问题回复
                    $.each(item2.answer, function (k, item3) {
                        content += '<div class="replay"><p><a href="javascript:void(0)" class="replybutton">回复:</a>' + item3.answer_content + '</p></div><div class="time"><ul class="attachment">';
                        $.each(item3.attachments, function (m, item4) {
                            content += '<li><span>' + item4.name + '</span><a href="' + item4.url + '" target="_blank">下载</a></li>';
                        });
                        content += '</ul><p>回复时间：<span>' + item3.create_time + '</span></p></div>';
                    });
                    content += '</div>';
                });
                content += '</div>';
            });
            $('.comment').empty().append(content);
        },
        error: function (json) {

        }
    });
}

function askContinue(obj, tender_id, ques_id) {
    var content = '<div class="askContinueBox"><textarea rows="10" cols="30" name=""></textarea><a onclick="continueSubmit(this,' + tender_id + ',' + ques_id + ')" href="javascript:void(0);">提交</a></div>';
    if ($(obj).parents('.commentBox').find('.askContinueBox').length == 0) {
        $(obj).parents('.commentBox').append(content);
    }
}

/*招标答疑-继续提问-提交*/
function continueSubmit(obj, tender_id, ques_id) {
    var textArea = $(obj).siblings('textarea');
    var textareaVal = $.trim(textArea.val());
    if (textareaVal == '') {
        alert("问题不能为空！");
        textArea.focus();
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=questions",
        data: {'tender_id': tender_id, 'parent_ques_id': ques_id, 'question_content': textareaVal},
        success: function (json) {
            if (json.resultCode == 1000 && json.value) {
                var data = json.value.data;
                var content = '<div class="question"><p class="quescontent"><span class="questionname">追问:</span>' + data.ques_content + '</p></div>';
                if (data.is_answer == 1) {
                    dayi(tender_id);
                } else {
                    $(obj).parents('.commentBox').find('.question:last').after(content).siblings('.mycomment').find('.response').html('未解答').attr('class', 'unsolved');
                }
                $(obj).parent().remove();
                alert("提交成功！");
            } else {
                alert(json.message);
            }
        }
    });
}

/*招标答疑提交*/
function dayi_sub(tender_id) {
    var questionValue = $.trim($("#questionBox").find('textarea').val());
    if (questionValue == "") {
        alert("问题不能为空！");
        $("#questionBox").find('textarea').focus();
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=questions",
        data: {'tender_id': tender_id, 'question_content': questionValue},
        success: function (json) {
            var data = json.value.data || null;
            if (json.resultCode == 1000 && data) {
                var str = $(".questionname:last").text();
                var index = str.match(/\d+(\.\d+)?/g);
                var content = '';
                content += '<div class="commentBox"><div class="mycomment">提问时间： <span>' + data.create_time + '</span><span class="questionreply"></span>';
                content += '<a class="btnContinue" href="javascript:void(0)" onclick="askContinue(this,' + tender_id + ',' + data.ques_id + ')">继续提问</a>';
                content += '<span class="unsolved">未解答</span>';
                content += '</div>';
                content += '<div style="clear:both;"></div>';
                content += '<div class="question"><p class="quescontent"><span class="questionname">问题:</span>' + data.ques_content;
                content += '</p></div></div>';
                $(".comment").prepend(content);
                $("#questionBox").find('textarea').val("");
                alert("提交成功！");
            }
        }
    });

    function replyappend() {
        $(".box").find('button').click(function () {
            var responsevalue = $("#response").find("textarea").val();
            var content = '';
            content += '';
            content += ' <div class="question"><p><span class="questionname">问题:</span>';
            content += '</p></div>';
            $(this).parents('.mycomment').append(content);
            $("#response").hide();
        })
    }

    //replyappend();
}

/*招标澄清*/
function chengqing(tender_id) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php?act=tender_bids&op=clarify_answers",
        data: {'tender_id': tender_id},
        success: function (json) {
            if (json.resultCode != 1000) {
                return false;
            }
            var data = json.value.data.data || [], content = '';
            $.each(data, function (i, item1) {
                content += '<div class="comment"><div class="top"><div class="wenti"><p>发起人:&nbsp;' + item1.org_name + '<span>' + item1.create_time + '</span></p></div><div class="hf replybutton"><a href="javascript:void(0)" onclick="commit(this)">回复</a></div>';

                content += (item1.is_reply == 1) ? '<span class="ydy">已回复</span>' : '<span class="unresponse">未回复</span>';
                content += '</div><dl class="ask" data="' + item1.ques_id + '"><dt class="ask-title">问题：</dt><dd class="ask-con">' + item1.ques_content + '</dd></dl>';

                //初始问题回复
                $.each(item1.answer, function (j, item2) {
                    content += '<dl class="answer"><dt class="ask-title">回复：</dt><dd class="ask-con"><div class="content">' + item2.answer_content + '</div><div class="date-answer"><ul class="attachment">';
                    $.each(item2.attachments, function (k, item3) {
                        content += '<li><span>' + item3.name + '</span><a href="' + item3.url + '" target="_blank">下载</a></li>';
                    });
                    content += '</ul><p>回复时间：<span>' + item2.create_time + '</span></p></div></dd></dl>';
                });

                //追问问题
                $.each(item1.quechildlist, function (j, item2) {
                    content += '<dl class="ask" data="' + item2.ques_id + '"><dt class="ask-title">追问：</dt><dd class="ask-con">' + item2.ques_content + '</dd></dl>';

                    //追问问题回复
                    $.each(item2.answer, function (k, item3) {
                        content += '<dl class="answer"><dt class="ask-title">回复：</dt><dd class="ask-con"><div class="content">' + item3.answer_content + '</div><div class="date-answer"><ul class="attachment">';
                        $.each(item3.attachments, function (m, item4) {
                            content += '<li><span>' + item4.name + '</span><a href="' + item4.url + '" target="_blank">下载</a></li>';
                        });
                        content += '</ul><p>回复时间：<span>' + item3.create_time + '</span></p></div></dd></dl>';
                    });
                });
                content += '</div>'
            });
            content += '<div id="response" style="display:none"><textarea></textarea><form id="myupload" action="http://api.jc.yzw.cn.qa:8000/UploadHandler.ashx" method="post" enctype="multipart/form-data"><div class="demo"><div class="btn"><span>上传附件</span><input id="fileupload" type="file" name="attach_file" /></div><div class="progress"><span class="bar"></span><span class="percent">0%</span></div><div class="showContent"></div></div></form><button class="button" type="button">提交</button></div>';
            $('#questionContent').empty().append(content);
        },
        complete: function () {
            $('body').off('click', '.button');

            /*招标澄清提交*/
            $('body').on('click', '.button', function () {
                var val = $("#response").find('textarea').val().replace(/(^\s+)|(\s+$)/g, "");
                var attachments = new Array();
                $('#myupload').find('.files').each(function (index, element) {
                    var oAtta = {
                        'name': $(element).find('a').text(),
                        'url': $(element).find('a').attr('href')
                    };
                    attachments.push(oAtta);
                });

                if (val == "") {
                    alert('回复内容不能为空！');
                    $("#response").find('textarea').focus().select();
                    return;
                } else if (val.length > 500) {
                    alert('回复内容过长！');
                    $("#response").find('textarea').focus().select();
                    return;
                }
                var oComment = $(this).parents('.comment');
                var ques_id = oComment.find('.ask:last').attr('data');
                var objData = {
                    'tender_id': tender_id,
                    'ques_id': ques_id,
                    'answer_content': val
                };
                if (attachments.length > 0) {
                    objData.attachments = attachments;
                }

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: false,
                    url: "index.php?act=tender_bids&op=clarifys",
                    data: objData,
                    success: function (data) {
                        $("#response").hide().children('textarea').val('').siblings('form').find('.showContent').html('');
                        /*var strReply = '<dl class="answer"><dt class="ask-title">回复：</dt><dd class="ask-con"><div class="content">' + data.value.data.answer_content + '</div>';
                         strReply += '<div class="date-answer"><ul class="attachment"><li><span>附件附件.doc</span><a href="#" target="_blank">预览</a><a href="#">下载</a></li></ul>';
                         strReply += '<p>回复时间：<span>' + data.value.data.create_time + '</span></p></div></dd></dl>';*/
                        if (data.resultCode != 1000) {
                            alert(data.message);
                            return false;
                        }
                        var oData = data.value.data;
                        var content = '<dl class="answer"><dt class="ask-title">回复：</dt><dd class="ask-con"><div class="content">' + oData.answer_content + '</div><div class="date-answer"><ul class="attachment">';
                        $.each(oData.attachments, function (index, val) {
                            content += '<li><span>' + val.name + '</span><a href="' + val.url + '" target="_blank">下载</a></li>';
                        });
                        content += '</ul><p>回复时间：<span>' + oData.create_time + '</span></p></div></dd></dl>';
                        oComment.append(content).siblings('.top > span').attr('class', 'ydy').text('已回复');//回复内容
                    }

                })
            })
        }
    })
}

/*招标澄清 回复*/
function commit(obj) {
    $("#response").find("textarea").val("");
    var replyparent = $(obj).parent().parent().parent();
    if ($("#response").css('display') == "block" && $(obj).parents('.comment').find('#response').length > 0) {
        $("#response").hide();
    } else {
        replyparent.append($("#response"));
        $("#response").show().children('textarea').focus();
    }
}

/*获取附件数据*/ //公告文件传全部附件   我的投标文件只传新增附件 type | notice 公告  bids 投标文件
function getAttaches(type) {
    var strAttachs = '[';

    if (type == 'notice') { //公告附件
        if ($(".cur-sub-con .files a").length == 0 && $(".cur-sub-con .myfiles a").length == 0) {
            return null;
        }
        $(".cur-sub-con .myfiles a").each(function () {
            strAttachs += '{"file_name":"' + $(this).text() + '","file_path":"' + $(this).attr('href') + '"},';
        });
    } else {//我的投标文件附件
        if ($(".cur-sub-con .files a").length == 0) {
            return null;
        }
    }
    $(".cur-sub-con .files a").each(function () {
        strAttachs += '{"file_name":"' + $(this).text() + '","file_path":"' + $(this).attr('href') + '"},';
    });

    strAttachs = strAttachs.substring(0, strAttachs.length - 1);
    strAttachs += ']';
    return strAttachs;
}

//我要报名
function submitID(url1, url2, tender_id) {
    var parm = {};
    if (getAttaches('notice')) {
        parm = {
            "attach": JSON.parse(getAttaches('notice')),
            "tender_id": tender_id,
            "action_type": "SignUp",
            "deadline": $('.deadline').attr('date')
        };
    } else {
        parm = {"tender_id": tender_id, "action_type": "SignUp", "deadline": $('.deadline').attr('date')};
    }
    $.ajax({
        type: "post",
        url: url1,
        data: parm,
        dataType: "json",
        success: function (json) {
            if (json.resultCode != 1000) {
                alert(json.message);
            } else {
                window.location.href = url2;
            }
        }
    })
}

//更新变更提示
function checkChangeStatus(type) {
    $.ajax({
        type: "post",
        url: "index.php?act=tender_bids&op=change_status&tender_id=" + GetQueryString('tender_id'),
        dataType: "json",
        data: {"action_type": type},
        success: function (json) {
        },
        error: function (xhr, status, message) {
            console.log(message);
        }
    })
}

//签收招标文件
function getBidFiles(tenderId) {
    $.ajax({
        type: "post",
        url: "index.php?act=tender_bids&op=notice_enroll&tender_id=" + tenderId,
        dataType: "json",
        data: {"action_type": "SignTender"},
        success: function (json) {
            if (json.resultCode != 1000) {
                alert(json.message);
            } else {
                window.location.reload();
            }
        },
        error: function (xhr, status, message) {
            alert(message);
        }
    })
}

//签收招标结果
function signBids(tenderId) {
    $.ajax({
        type: "post",
        url: "index.php?act=tender_bids&op=change_status&tender_id=" + tenderId,
        dataType: "json",
        data: {"action_type": "ViewCalibration"},
        success: function (json) {
            if (json.resultCode != 1000) {
                alert(json.message);
            } else {
                window.location.reload();
            }
        },
        error: function (xhr, status, message) {
            alert(message);
        }
    })
}

//投标
function sub(tender_id, wheel) {
    var param = {};
    var float_Id = '';

    /*获取投标说明的val值*/
    var description = $('#txtMyTender').html();

    /*校验清单状态*/
    var listStatus = $('.toubiao .list_template img');
    var unDoes = 0;
    for (var i = 0; i < listStatus.length; i++) {
        if (listStatus[i].src.indexOf('Red.png') > -1) {
            unDoes++;
        }
    }
    if (unDoes == listStatus.length) {
        alert('请先填写采购清单！');
        return false;
    }

    saveList('tab');//默认保存下当前模版清单
    /*获取条款*/
    var strTerms = '';
    $('#tbMyBusiness tbody tr').each(function (i, tr) {
        var id = $(this).attr('data');
        if (id != undefined) {
            var values = $(this).find('input:eq(0)').val();
            strTerms += '{"id": ' + id + ',"terms": "' + values + '"},';
        }
    });
    $('#tbMyTech tbody tr').each(function (i, tr) {
        var id = $(this).attr('data');
        if (id != undefined) {
            var values = $(this).find('input:eq(0)').val();
            strTerms += '{"id": ' + id + ',"terms": "' + values + '"},';
        }
    });
    if (strTerms != '') {
        strTerms = strTerms.substring(0, strTerms.length - 1);
    }
    strTerms = '[' + strTerms + ']';

    if (getAttaches('bids')) {
        param = {
            "attach": JSON.parse(getAttaches('bids')),
            "tender_id": tender_id,
            "remark": description,
            "wheel": wheel,
            "action_type": 'Bid',
            "terms": JSON.parse(strTerms)
        };
    } else {
        param = {
            "tender_id": tender_id,
            "remark": description,
            "wheel": wheel,
            "action_type": 'Bid',
            "terms": JSON.parse(strTerms)
        };
    }

    $.ajax({
        type: "post",
        url: createUrl('shop/index.php?act=tender_bids&op=accepteds'),
        data: param,
        dataType: "json",
        success: function (json) {
            if (json.resultCode != 1000) {
                alert(json.message);
            } else {
                window.location.reload();
            }
        }
    })
}

/*签收公告*/
function validComName(tenderId) {
    $.ajax({
        type: "post",
        url: "index.php?act=tender_bids&op=notice_enroll&tender_id=" + tenderId,
        dataType: "json",
        data: {"action_type": "SignAnnouncement"},
        success: function (json) {
            if (json.resultCode != 1000) {
                alert(json.message);
            } else {
                window.location.reload();
            }
        },
        error: function (xhr, status, message) {
            alert(message);
        }
    })
}

/*创建编辑器*/
function createEditor(id, data, readOnly) {
    var editor = KindEditor.create('div[id="' + id + '"]', {
        resizeType: 0,
        width: '960px',
        height: '200px',
        afterBlur: function () {
            this.sync();
        },
        items: []
    });
    if (data == null) {
        data = '';
    }
    var strHtml = htmlDecode(data);
    editor.html(strHtml);
    $('#' + id).html(strHtml);
    if (!readOnly) {
        editor.readonly();
    }
    $('.ke-edit').prev().remove();
    $('.ke-edit').next().remove();
}

//保存清单
function saveList(type) {
    var index = 0, flag = true;
    var activeTp = $('.list_template_title').find('.active');
    var param = '{"inventory_content":[{"id":' + activeTp.attr('data-id') + ', "data": [';
    var templates = $('.list_template_title').find('a');
    for (var i = 0; i < templates.length; i++) {
        if (templates[i].className == 'active') {
            index = i;
            break;
        }
    }

    var listSatus = true, count = 0;// 判断清单填写状态标示 count统计不为空的个数
    var textItem = $('.toubiao .city_bg').eq(index).find('input[data-required=true]');

    if (textItem.attr('disabled') == 'disabled') {//不可编辑时候，不进行保存
        if (type == 'tab')
            return true;
        else
            return false;
    }

    textItem.each(function (index, item) {
        var value = $(item).val();
        var type = $(item).attr('data-coltype');
        if (type == 'text') {
            if ($.trim(value) != '')
                count++;
        } else { //number
            var reg = /^(-?\d+)(\.\d+)?$/;
            if (value != '' && !reg.test(value)) {
                alert('请输入数字！');
                $(item).focus();
                flag = false;
                return false;
            } else if (value)
                count++;
        }
        if ($.trim(value) == '') {
            if (type == "text")
                value = '';
            else
                value = null;
            listSatus = false;
        }

        if (type == 'text')
            param += '{"id": ' + $(item).attr("data-id") + ', "' + $(item).attr("data-coluname") + '": "' + value + '"},';
        else
            param += '{"id": ' + $(item).attr("data-id") + ', "' + $(item).attr("data-coluname") + '": ' + value + '},';
    })
    param = param.substr(0, param.length - 1);
    param += ']}]}';

    if (textItem.length == 0) {
        if ($('#shopnc_op').val() == 'bid_adjustment') {
            return true;
        }
        //alert('暂无可保存清单！');
        return false;
    }

    if (flag) {
        $.ajax({
            url: 'index.php?act=tender_bids&op=inventory_add&tender_id=' + GetQueryString('tender_id'),
            type: 'post',
            dataType: 'json',
            data: JSON.parse(param),
            success: function (data) {
                if (data.resultCode == 1000) {
                    var statusSrc = "";
                    if (listSatus) {
                        statusSrc = getBaseUrl() + 'enterprise/images/Blue.png';
                    } else if (!listSatus && count > 0) {
                        statusSrc = getBaseUrl() + 'enterprise/images/Grey.png';
                    } else if (!listSatus && count == 0) {
                        statusSrc = getBaseUrl() + 'enterprise/images/Red.png';
                    }
                    activeTp.find('img').attr('src', statusSrc);
                }
            },
            error: function (xhr, status, msg) {
                console.log(msg);
            }
        })
        return true;
    } else {
        return false;
    }
}

/*获取当前时间 或 日期格格式转换*/
function getNowFormatDate(ns) {
    var date;
    if (ns) {
        date = new Date(parseInt(ns) * 1000)
    } else {
        date = new Date();
    }

    var seperator1 = "-", seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
        + " " + (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + seperator2 + (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes()))
        + seperator2 + (date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()));
    return currentdate;
}

/*不同参数显示对应的tab数*/
function paramTabChange() {
    // 公告/变更
    var parmsAry1 = ['bid_sign', 'bid_receive', 'bid_enroll', 'bid_check'];
    //投标文件空白显示
    var parmsAry2 = ['bid_receiving'];
    //招标文件显示内容
    var parmsAry3 = ['bid_istender']
    //招标答疑五个
    //var parmsAry4 = ['bid_going']
    //全部显示
    var parmsAry5 = ['bid_accepted', 'bid_adjustment', 'bid_result', 'bid_resulted'];
    //url参数
    var parme = $('#shopnc_op').val();
    var oLis = $(".tabnav li");

    if (parme == "bid_sign") {
        $(".tabnav li").eq(0).addClass('selected').css("display", "block");
        $('.sub-con').eq(0).hide();
    } else if (parmsAry1.indexOf(parme) > -1) {
        $(".tabnav li:lt(2)").css("display", "block");
        oLis[0].click();
    } else if (parmsAry2.indexOf(parme) > -1) {
        $(".tabnav li:lt(3)").css("display", "block");
        $('.sub-con').eq(2).html('');
        oLis[2].click();
    } else if (parmsAry3.indexOf(parme) > -1) {
        //$(".tabnav li:lt(3)").css("display", "block");
        //oLis[2].click();
        $(".tabnav li:lt(5)").css("display", "block");
        oLis[2].click();
    }
    //else if (parmsAry4.indexOf(parme) > -1) {
    //    $(".tabnav li:lt(5)").css("display", "block");
    //    oLis[3].click();
    //}
    else if (parmsAry5.indexOf(parme) > -1) {
        $(".tabnav li").css("display", "block");
        var imgContent = getNowFormatDate($(".deadline").attr('date'));
        if (parme == 'bid_accepted' && getNowFormatDate() < imgContent) {
            $(".tabnav li").eq(5).css('display', 'none');
        }
        if (parme != 'bid_resulted') {
            $(".tabnav li").eq(6).css('display', 'none');
        }
        oLis[3].click();
    }
}

/*获取url参数*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

//兼容ie8不支持indexOf
Array.prototype.indexOf = function (elt) {
    var len = this.length >>> 0;
    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0) from += len;
    for (; from < len; from++) {
        if (from in this && this[from] === elt) return from;
    }
    return -1;
}

function htmlEncode(s) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(s));
    return div.innerHTML;
}

function htmlDecode(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.innerText || div.textContent;
}