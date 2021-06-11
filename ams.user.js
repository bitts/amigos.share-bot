// ==UserScript==
// @name            Amigos-Share Tanks
// @namespace       http://tampermonkey.net/
// @license         MIT
// @version         1.0.0
// @description     Percorrendo torrents baixados e realizando a agradecimento
// @author          Marcelo_Valvassori_Bittencourt
// @copyright       2021, Marcelo Valvassori Bittencourt (https://openuserjs.org/users/marcelo.valvassori)
// @namespace       mbitts.com
// @homepageURL     https://openuserjs.org/users/marcelo.valvassori
// @match           https://cliente.amigos-share.club/account-details.php?id=*&action=baixados
// @grant           none
// @contributionURL https://github.com/bitts/ams-bot.js

// ==/UserScript==

var myId = prompt("Informe o seu ID de usuario: ");
var page = 0;
var lms = 'https://cliente.amigos-share.club/';

$('.pagination').find('a').map(function(){
	var lnk = $(this).attr('href');
	var vars = [], hash;
	var hashes = lnk.split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	page = (parseInt(page) > parseInt(vars['page']))?page:vars['page'];
});

var i = parseInt(prompt("Comecar pela pagina de numero: ", 0));
page = parseInt(prompt("Ir ate a pagina de numero: ", page));

if(page){
	for(; i <= page; i++){
		console.log('Total de Paginas: '+ page, '| Lendo pagina: '+ i);
		$.ajax({
			url: lms+'account-details.php',
			data: {'action': 'baixados', 'id': myId, 'page': i},
			type: "get",
			success: function(data){
				//console.log(data);
				console.log('Varrendo arquivos baixados, procurando arquivos nao avaliados.');
				
				$(data).find('ul.list-group li').map(function(){ 
          var file = $(this).find('div.list-group-item-content').find('.tooltips').find('a').text();
  				var id = $(this).find('a:last').attr('href').replace('download.php?id=','');
					if(id){
						console.log('Avaliando o arquivo de identificador: ', id);
						if(id && $.isNumeric(id) ){
							$.ajax({
								url: lms+'thanks.php',
								data : {'id': id },
								type: "get",
								success: function(dataR){
                  if(dataR){
                    var retorno = $(dataR).find('body').find('div.container-fluid > div.row').find('div:last').find('div.card-body').text();
                    console.log('Arquivo avaliado | ID: '+ id +' | file: '+ file +'| Retorno: '+ retorno);
                  }
								},
                complete : function(data){
                  //console.log('complete', data.responseText);
                  if(data.responseText){
                    var resposta = $(data.responseText).find('body').find('div.container-fluid > div.row').find('div:last').find('div.card-body').text();
                    console.log('Arquivo avaliado | ID: '+ id +' | file: '+ file +'| Retorno: '+ resposta);
                  }
                  
								},
								error: function(err){
									console.log(err)
								}
							});
							
						}else console.log('Nao foi possivel identificar ID do arquivo.');
					}
          
				});
			},
			error: function(err){
				console.log(err)
			}
		});
	}
}
