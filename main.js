// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto
// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)

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
        'query' : filmCercato,
        'language' : 'it'
      },
      method : 'get',
      success : function(data) {
        var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
        for (var i = 0; i < filmResults.length; i++) { //vado a scorrere per tutta la lunghezza dell'array
          var titolo = filmResults[i].title //creo una var per il titolo del film
          var votoNum = Math.round(filmResults[i].vote_average / 2); //creo una var che dimezza il voto e lo arrotonda
          if (titolo.toLowerCase().includes(filmCercato.toLowerCase())) { // se ciò che abbiamo digitato nell'input corrisponde ad titolo presente nell'API
           var context = { //creo la variabile con il contenuto che andrà nel template.
              titolo : '<h2>' + filmResults[i].title + '</h2>',
              titolo_originale : filmResults[i].original_title,
              lingua : filmResults[i].original_language,
              voto : '<i class="fas fa-star"></i>'.repeat(votoNum), //ripete la stella per il numero del voto
              voto_restante : '<i class="far fa-star"></i>'.repeat(5 - votoNum) //aggiunge la stella per il risultato di 5 meno il numero del voto
            }
            var risultatoRicerca = template_function(context); // utilizzando la funzione generata da handlebars, creo l'html finale
            $('.searchReaults-container').append(risultatoRicerca); // infine vado ad appendere nel container il mio template che si ripeterà fino alla lunghezza dell'array results contenuto nell'API
            $('.searchMovie').val(''); //resetto l'input con una stringa vuota
          }
          // if (data.total_results == 0) { //se non c'è nessun film con il nome digitato
          //   $('.searchReaults-container').append('Nessun risultato trovato');
          //   console.log('oook');
          // }
        }
      },
      error : function() {
        alert('error');
      }
    });
  }
}

function stampaRisultato(){

}
