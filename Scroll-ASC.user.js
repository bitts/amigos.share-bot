// ==UserScript==
// @name            Amigos-Share Club Hacks to User
// @description     Hacks to Amigos-share Club - Comunidade de Compartilhamentos de arquivos via Torrent
// @author          Marcelo_Valvassori_Bittencourt
// @copyright     	2019, Marcelo_Valvassori_Bittencourt (https://openuserjs.org/users/Marcelo_Valvassori_Bittencourt)
// @namespace       mbitts.com
// @homepageURL     https://openuserjs.org/users/Marcelo_Valvassori_Bittencourt
// @supportURL      http://mbitts.com/amigos-share/
// @icon            https://cliente.amigos-share.club/favicon.ico
// @include         https://cliente.amigos-share.club/*
// @run-at          document-start
// @version         0.0.2
// @license       	MIT
// @noframes
// ==/UserScript==

var mn = {

    init : function(){
        mn._goToTop();
        mn._getIDuser();

        setTimeout(function(){
            mn._exibePaginacao();
        },100);
    },

    _backToTop : function() {
        var scrollTrigger = 100;
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
            $('#back-to-top').addClass('show');
        } else {
            $('#back-to-top').removeClass('show');
        }
    },

    _goToTop : function(){
        $(window).on('scroll', function () {
            if ($('#back-to-top').length) {
                mn._backToTop();
            }
        });

        if ($('#back-to-top').length) {
            $('#back-to-top').on('click', function (e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 700);
            });
        }else {
            $('body').append(
                $('<a />',{'href':'#','id':'back-to-top','title':'Para o topo'})
                    .addClass('btn btn-default btn-xs')
                    .append( $('<i />').addClass('fa fa-arrow-up') )
                    .on('click', function (e) {
                        e.preventDefault();
                        $('html,body').animate({
                            scrollTop: 0
                        }, 700);
                    })
            );
        }
    },

    _exibePaginacao : function(){
        if( $('.pagination').length > 0){
            var page = 0;
            var url_pagination = window.location.search.replace('?','').replace(/&page=\d/g,'');
            var win = $(window);
            var npg = 0;
            var ths = $('body');

            $('.pagination li a.page-link').map(function(){
                var lnk = $(this).attr('href').split('?')[1];
                var vars = [], hash;
                if(lnk){
                    var hashes = lnk.split('&');
                    for(var i = 0; i < hashes.length; i++){
                        hash = hashes[i].split('=');
                        vars.push(hash[0]);
                        vars[hash[0]] = hash[1];
                    }
                    page = (parseInt(page) > parseInt(vars['page']))?page:vars['page'];
                }
            });

            if(page > 0){
                win.scroll(function() {
                    if ($(document).height() - win.height() == win.scrollTop()) {
                        if(npg < page){
                            npg++;
                            $.ajax({
                                url: 'torrents-search.php?'+ url_pagination +'&page='+ npg ,
                                dataType: 'html',
                                success: function(html) {
                                    $(html).find('div.card-body ul.list-group li').each(function(){
                                        let li = $(this);
                                        ths.find('.list-group li:last').after(li);
                                    });
                                    let pgnt = $(html).find('div.card-body .pagination').html();
                                    ths.find('div.card-body .pagination').html(pgnt)
                                }
                            });
                        }
                    }
                });
            }
        }
    },

    _getIDuser : function(){
        var userID = parseFloat(/(id=)(.*)(&)/.exec($("a[href^='account-details.php']").attr('href'))[2]);
        if(!isNaN(userID) && (typeof userID !== 'undefined') && userID > 0)return userID;
        else {
            $('<div />').text('Não foi possível pegar o ID do usuário');
            return 0;
        }
    }

};


(function() {
    $(document).ready(function(){
        mn.init();
    });
})();
