var classData = null;

function rendor(cat_id)
{
    if(classData == null) {

            if ($("span.charu").length > 0) {
                //get_left_nav();
                $.ajax({
                    url: '/shop/index.php?act=api&op=get_class',
                    type: 'GET',
                    async: false,
                    success: function (res) {
                        if (res.code == 1000) {
                            classData = res.data;
                            if(typeof classData.first != 'undefined') {
                                for (var i = 0; i < classData.first.length; i++) {
                                    var str = "";
                                    var v = classData.first;
                                    var v1 = v[i].gc_id;//一级栏目id
                                    str += '<div class="sub-class" cat_menu_id=' + v1 + '><div class="sub-class-content"><div class="recommend-class"></div>';
                                    if(typeof v[i].second != 'undefined') {
                                        for (var g = 0; g < v[i].second.length; g++) {
                                            var v2 = v[i].second[g].gc_name;//二级栏目名称
                                            str += '<dl><dt><h3><a href="/shop/cate-' + v[i].second[g].gc_id + '-0-0-0-0-0-0-0-0-0.html">' + v2 + '</a></h3><span class="zx-nav-more"><a href="/shop/cate-' + v[i].second[g].gc_id + '-0-0-0-0-0-0-0-0-0.html">更多</a></span></dt><dd class="goods-class">';
                                            if(typeof v[i].second[g].third != 'undefined') {
                                                for (var s = 0; s < v[i].second[g].third.length; s++) {
                                                    var v3 = v[i].second[g].third[s].gc_name;//三级栏目名称
                                                    str += '<a href="/shop/cate-' + v[i].second[g].third[s].gc_id + '-0-0-0-0-0-0-0-0-0.html">' + v3 + '</a>';
                                                }
                                            }
                                            str += '</dd></dl>'
                                        }
                                    }
                                    str += '</div><div class="sub-class-right"><div class="adv-promotions"></div></div></div>';


                                    $('.menu').find("li[cat_id='" + v1 + "']").find('.charu').append(str);

                                    // $('.charu').eq(i).append(str);

                                    $('.menu li').find("div[cat_menu_id='" + v1 + "']").hide();
                                    if(cat_id == v1) {
                                        $('.menu li').find("div[cat_menu_id='" + v1 + "']").show();
                                    }
                                }
                            }
                            /*
                             $(".menu li").mouseover(function () {
                             $(this).find('dl').each(function (index, item) {
                             if ($(this).find('dd').height() >56) {
                             $(this).find('dd').css({'height': '56px', 'overflow': 'hidden'});
                             $(this).find('.zx-nav-more').empty().append('<a href="javascript:void(0)">更多</a>');
                             }
                             })
                             })
                             */
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.getResponseHeader('url')) {
                            window.location = XMLHttpRequest.getResponseHeader('url');
                        }
                    },
                    dataType: 'json'
                });

        }

    }

    // window.console.log(classData);

}

$(function () {
    /*左侧导航加样式开始*/
    $(".menu li").mouseover(function () {
        $('.zmenu').addClass('zmenuhover');
    });
    $(".menu li").mouseout(function () {
        $('.zmenu').removeClass('zmenuhover');
    });
    /*左侧导航加样式结束*/

    $(".menu li").hover(function() {
        var cat_id = $(this).attr('cat_id');
        rendor(cat_id);
    });

})

function createUrl(path) {
    return  window.location.protocol + '//' + window.location.host + '/' + path.replace(/^[\/]*/, '');
}
