function check_form(){return!0}$(function(){$("#mod_btn").click(function(){$.get({url:"/bookshelf/api/comment?action=get&password="+$("#password").val()+"&id="+$("#form_id").val(),success:function(r){if(0===r.ok)return void alert("오류 발생. 관리자에게 문의하세요.");if(2===r.ok)return void alert("잘못된 비밀번호. 당신 맞나요?");var t=r.result;$("#form_comment").val(t),$("#form_comment").parent().show(),$("#form_password").val($("#password").val()),$("form *").removeAttr("readonly"),$(".rating").starRating("setReadOnly",!1),$("#is_secret").show(),$("#password").parent().hide(),$("#ok_btn").parent().show(),$("#mod_btn").parent().hide()},error:function(){alert("error")}})}),$("#ok_btn").click(function(){$("#form_rating").val(2*$(".rating").starRating("getRating")),$("#is_secret input").prop("checked")?$('form input[name="is_secret"]').val(1):$('form input[name="is_secret"]').val(0),$("form").submit()}),$("#del_btn").click(function(){$.post({url:"/bookshelf/api/reading/delete",data:{id:$("#form_id").val(),password:$("#password").val()},success:function(r){switch(r.ok){case 0:alert("오류 발생. 관리자에게 문의."),console.error(r.error);break;case 1:window.location.replace("/bookshelf");break;case 2:alert("잘못된 비밀번호.")}},error:function(){alert("error")}})}),$("#can_btn").click(function(){$(".rating").starRating("setRating",parseInt($("#form_rating").val())/2),$(".rating").starRating("setReadOnly",!0),$("form *").attr("readonly",""),$("#password").removeAttr("readonly"),$("#is_secret").hide(),$("#password").parent().show(),$("#ok_btn").parent().hide(),$("#mod_btn").parent().show()})});