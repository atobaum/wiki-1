/**
 * Created by Le Reveur on 2017-05-04.
 */
$(function(){
    $('#mod_btn').click(function(){
        $('#form_comment').parent().show();

        $('form *').removeAttr('readonly');
        $('.rating').starRating('setReadOnly', false);

        $('#is_secret').show();
        $('#ok_btn').parent().show();
        $('#mod_btn').parent().hide();
    });

    $('#ok_btn').click(function(){
        $('#form_rating').val($('.rating').starRating('getRating')*2);
        if ($('#is_secret input').prop('checked'))
            $('form input[name="is_secret"]').val(1);
        else {
            $('form input[name="is_secret"]').val(0);
        }
        $('form').submit();
    });

    $('#del_btn').click(function(){
        $.post({
            url: '/bookshelf/api/reading/delete',
            data: {
                id: $('#form_id').val(),
                password: $('#password').val()
            },
            success: function(res){
                switch(res.ok){
                    case 0:
                        alert('오류 발생. 관리자에게 문의.');
                        console.error(res.error);
                        break;
                    case 1:
                        window.location.replace("/bookshelf");
                        break;
                    case 2:
                        alert('잘못된 비밀번호.');
                        break;
                }
            },
            error: function(){
                alert('error');
            }
        });
    });

    $('#can_btn').click(function(){
        $('.rating').starRating('setRating', parseInt($('#form_rating').val()) / 2);
        $('.rating').starRating('setReadOnly', true);
        $('form *').attr('readonly', '');
        $('#password').removeAttr('readonly');

        $('#is_secret').hide();

        $('#password').parent().show();
        $('#ok_btn').parent().hide();
        $('#mod_btn').parent().show();
    });
});


function check_form(){
    return true;
}

