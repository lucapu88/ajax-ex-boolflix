// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

//devo far si che la parola digitata nell'input corrisponda ad un film presente nell'api_key
//se il film è presente mi devono apparire le info
$(document).ready(function(){
  $('button').click(function(){ // al click sul pulsante cerca
    $('.searchReaults').remove(); //ad ogni nuova ricerca, si cancella la precedente
    trovaFilm(); //applico la mia funzione creata
  });
  $('.searchMovie').keypress(function(event) { //quando si è in posizione dell'input e viene premuto INVIO
    var testoRicerca = $('.searchMovie').val(); //recupero ciò che viene scritto nell'input
    if (event.which == 13 && testoRicerca != 0) { // se viene premuto INVIO (che corrisponde al numero 13 della mappatura dei tasti) e se nell'input c'è scritto qualcosa
      $('.searchReaults').remove(); //ad ogni nuova ricerca, si cancella la precedente
      trovaFilm(); //applico la mia funzione creata
    }
  });
});

//funzione che va a prendermi un film da un API tramite ciò che scrivo all'interno dell'input
function trovaFilm() {
  var template_html = $('#myTemplate').html();//recupero il codice html del template
  var template_function = Handlebars.compile(template_html);//do in pasto a handlebars il codice html
  var filmCercato = $('.searchMovie').val(); // creo una variabile che mi prende il val della ricerca
  if (filmCercato.length != 0) { //se ho scritto qualcosa nella ricerca interpello l'ajax
    $.ajax({
      url : 'https://api.themoviedb.org/3/search/movie',
      data : {
        'api_key' : API_KEY,
        'query' : filmCercato
      },
      method : 'get',
      success : function(data) {
        var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
        for (var i = 0; i < filmResults.length; i++) { //vado a scorrere per tutta la lunghezza dell'array
          var titolo = filmResults[i].title //creo una var per il titolo del film
          if (titolo.toLowerCase().includes(filmCercato.toLowerCase())) { // se ciò che abbiamo digitato nell'input corrisponde ad titolo presente nell'API
           var context = { //creo la variabile con il contenuto che andrà nel template.
              titolo : filmResults[i].title,
              titolo_originale : filmResults[i].original_title,
              lingua : filmResults[i].original_language,
              voto : filmResults[i].vote_average
            }
            var risultatoRicerca = template_function(context); // utilizzando la funzione generata da handlebars, creo l'html finale
            $('body').append(risultatoRicerca); // infine vado ad appendere nel container il mio template che si ripeterà fino alla lunghezza dell'array results contenuto nell'API
            $('.searchMovie').val(''); //resetto l'input con una stringa vuota
          }
          // if (filmResults.length == 0) { //se non c'è nessun film con il nome digitato
          //   $('body').append('<h2>Nessun risultato trovato</h2>');
          //   console.log('oook');
          // }
        }
      },
      error : function() {

      }
    });
  }
}
