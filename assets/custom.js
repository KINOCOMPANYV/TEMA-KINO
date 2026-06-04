/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

if (window.matchMedia("(max-width: 768px)").matches) {
  	window.onscroll = function() {
      var pageOffset = document.documentElement.scrollTop || document.body.scrollTop,
          btn = document.getElementById('scrollToTop');
      if (btn) btn.style.display = pageOffset > 1200 ? 'block' : 'none';
	}
} 




$(".block-swatch__radio, .variant-swatch__radio").change(function () {
  setTimeout(function () { parcelamento(); }, 150);
});

function increaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById('number').value = value;
}

function decreaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value < 1 ? value = 1 : '';
  value--;
  document.getElementById('number').value = value;
}

$('.options:first-child').addClass('active')

$(".options").each(function(index) {
    $(this).on("click", function(){
      $('.options.active .selector-desconto').text($('.options.active .selector-desconto').attr('cup'))
      $('.options').removeClass('active')
      $(this).addClass('active')
      $('.options.active .selector-desconto').append(' APLICADO')
      $('.precode').remove()
      $('.price--compare').remove()      
      $('.price-list').append('<p class="precode">' + $(this).find('.valortot span').text() + '</p>')
      $('.price').text($(this).find('.valortot b').text())     
      
      $('.price .selector-desconto').remove()
      
      var cupom = $('.options.active .selector-desconto').text()
      
      if(cupom != '')
      $('.price').append('<p class="selector-desconto">' + cupom + '</p>')
      
      setTimeout(function(){ parcelamento2() }, 100);
    });
});

/*
$(".options").each(function( index ) {
  	$(this).find('#iddavariante').val()
  	var valor = parseFloat($(this).find('.valorunico b').text().replace('R$ ', '').trim())
   	var divisao =  parseInt($(this).find('.iddavariante').attr('qtd'))
    var calc = valor / divisao
    $(this).find('.valorunico b').text('R$ ' + calc.toFixed(2).replace('.', ','))
});
*/


$(".options").each(function( index ) {
  var valor = parseFloat($(this).find('.valorunico b').text().replace('R$ ', '').trim())
  var menor = $('.options:first-child .valorunico b').text().replace('R$ ', '').replace(',', '.').trim()
  var result = ((valor - menor)*100 / valor) * (-1);
  var porcenta = 'CUPOM ' + result.toFixed(0).replace('.', ',') + '% OFF'
  $(this).find('.selector-desconto').attr('cup', porcenta )
  $(this).find('.selector-desconto').text(porcenta)  
});

$(".product-form").each(function () {
    $(this).on('click', '.botaocmprar', function (event) {
      	var arraydeprodutos = [];
        event.stopImmediatePropagation();
        var idproduto = parseInt($('.options.active .iddavariante').attr('val'))
        var qtdproduto = parseInt($('.options.active .iddavariante').attr('qtd'))
        arraydeprodutos.push({
            id: idproduto,
            quantity: qtdproduto
        });
        console.log(arraydeprodutos)

        data = {
            items: arraydeprodutos
        }
        $.ajax({
            type: 'POST',
            url: '/cart/add',
            data: data,
            dataType: 'json',
            success: function (data) {
                setTimeout(function () {
            		//jQuery('.opencarrinho')[0].click();
            		window.location.href = '/cart'
                }, 500);                
            }
        });       
    });
})

