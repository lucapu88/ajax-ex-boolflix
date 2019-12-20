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
// Milestone 3:
// In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
// Dovremo prendere quindi l’URL base delle immagini di TMDB:
// https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare
// (troviamo tutte le dimensioni possibili a questo link:
// https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400 ) per poi aggiungere la parte finale dell’URL passata dall’API.
// Milestone 4:
// Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp,creando un layout completo simil-Netflix:
// ● Un header che contiene logo e search bar
// ● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma di “card” in cui lo sfondo è rappresentato dall’immagine di copertina ( consigliola poster_path con w342 )
// ● Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview

$(document).ready(function(){
  $('.home').click(function(){ //se clicco sulla scritta BOOLFLIX
    location.reload(); //ricarico la pagina
    //$('.searchReaults-container').empty(); //svuoto il contenitore
  });
  $('button').click(function(){ // al click sul pulsante cerca
    trovaFilm(); //applico la mia funzione creata
  });
  $('.searchMovie').keypress(function(event) { //quando si è in posizione dell'input e viene premuto INVIO
    var testoRicerca = $('.searchMovie').val(); //recupero ciò che viene scritto nell'input
    if (event.which == 13 && testoRicerca != 0) { // se viene premuto INVIO (che corrisponde al numero 13 della mappatura dei tasti) e se nell'input c'è scritto qualcosa
      trovaFilm(); //applico la mia funzione creata
    }
  });
  $(document).on('mouseenter', '.searchReaults', function(){ //quando sono con il mouse sul div che contiene la card del film/serie
    $(this).children('.image').removeClass('active'); //nascondo l'immagine
    $(this).children('.info').addClass('active'); //mostro i dettagli
  });
  $(document).on('mouseleave', '.searchReaults', function(){ //quando esco con il mouse dal div che contiene la card del film/serie
    $(this).children('.info').removeClass('active'); //nascondo i dettagli
    $(this).children('.image').addClass('active'); //mostro l'immagine
  });
});

//funzione che va a prendermi un Film o una SerieTV da un API tramite ciò che scrivo all'interno dell'input
function trovaFilm() {
  var filmCercato = $('.searchMovie').val(); // creo una variabile che mi prende il val della ricerca
  //qui sotto c'è la chiamata ajax nel caso in cui si prende un FILM
  if (filmCercato.length != 0) { //se ho scritto qualcosa nella ricerca interpello l'ajax
    $('.searchReaults-container').empty(); //svuoto il contenitore nel caso è stata già fatta una ricerca
    var urlMDb = 'https://api.themoviedb.org/3';
    var apiMovie = '/search/movie'; //API per la ricerca di un film
    $.ajax({
      url : urlMDb + apiMovie,
      data : {
        'api_key' : API_KEY,
        'query' : filmCercato,
        'language' : 'it'
      },
      method : 'get',
      success : function(data) {
        console.log(data); //tengo il log per verificare gli elementi stampati
        if (data.total_results > 0) { //se ci sono risultati nella ricerca
          var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
          creaTemplate(filmResults); //applico la mia funzione creata
        } else { //se non ci sono risultati
          $('.searchReaults-container').empty(); //svuoto il contenitore nel caso è stata già fatta una ricerca
          $('.searchReaults-container').append('Nessun risultato trovato per Film'); //appendo un messaggio
          //$('.searchMovie').val(''); //resetto l'input con una stringa vuota (opzionale: io l'ho commentato perchè secondo me l'utente, nel caso sbaglia a digitare, deve vedere ciò che ha scritto per poi correggersi)
        }
      },
      error : function() {
        alert('error');
      }
    });
  }
  //qui sotto c'è la chiamata ajax nel caso in cui si prende una SERIE
  if (filmCercato.length != 0) { //se ho scritto qualcosa nella ricerca interpello l'ajax
    $('.searchReaults-container').empty(); //svuoto il contenitore nel caso è stata già fatta una ricerca
    var urlMDb = 'https://api.themoviedb.org/3';
    var apiTV = '/search/tv'; //API per la ricerca di una SerieTV
    $.ajax({
      url : urlMDb + apiTV,
      data : {
        'api_key' : API_KEY,
        'query' : filmCercato,
        'language' : 'it'
      },
      method : 'get',
      success : function(data) {
        console.log(data); //tengo il log per verificare gli elementi stampati
        if (data.total_results > 0) { //se ci sono risultati nella ricerca
          var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
          creaTemplate(filmResults); //applico la mia funzione creata
        } else { //se non ci sono risultati
          $('.searchReaults-container').empty(); //svuoto il contenitore nel caso è stata già fatta una ricerca
          $('.searchReaults-container').append('Nessun risultato trovato per SerieTV'); //appendo un messaggio
          //$('.searchMovie').val(''); //resetto l'input con una stringa vuota (opzionale: io l'ho commentato perchè secondo me l'utente, nel caso sbaglia a digitare, deve vedere ciò che ha scritto per poi correggersi)
        }
      },
      error : function() {
        alert('error');
      }
    });
  }
};
//funzione che mi prende gli oggetti da un array e mi stampa il template in html
function creaTemplate(filmResults){
  var template_html = $('#myTemplate').html();//recupero il codice html del template
  var template_function = Handlebars.compile(template_html);//do in pasto a handlebars il codice html
  for (var i = 0; i < filmResults.length; i++) { //vado a scorrere per tutta la lunghezza dell'array
    filmResults[i];
    if (filmResults[i].hasOwnProperty('title')) { //se nell'array è definita la proprietà .title (e quindi è un Film)
      var titolo = filmResults[i].title; //creo una var per il titolo del Film
      var type = 'Film'; //creo una var per indicare che è un Film
      var date = filmResults[i].release_date; //creo una var per indicare la data di rilascio Film
      var titolo_originale = filmResults[i].original_title; //creo una var per il titolo originale del film
    }
    else { //se nell'array NON è definita la proprietà .title (e quindi se non è un film, è una SerieTV)
      var titolo = filmResults[i].name;  //creo una var per il titolo della SerieTV
      var type = 'SerieTV'; //creo una var per indicare che è una SerieTV
      var date = filmResults[i].first_air_date; //creo una var per indicare la data di rilascio SerieTV
      var titolo_originale = filmResults[i].original_name; //creo una var per il titolo originale della SerieTV
    }
    var votoNum = Math.round(filmResults[i].vote_average / 2); //creo una var che dimezza il voto e lo arrotonda
    if (filmResults[i].poster_path == null) { //se l'immagine di copertina non è presente
      var copertina = 'img/not-avaible-cover.png'; //creo una var che mi iserisce un'immagine dove c'è scritto che non è disponibile
    } else { //se l'immagine è presente
      var copertina = 'https://image.tmdb.org/t/p/w342' + filmResults[i].poster_path; //creo una var che mi concatena l'url base dell'immagine e il contenuto dell'oggetto
    }
    if (filmResults[i].overview == "") { //se non c'è scrita nessuna descrizione del film/serietv
      var trama = ' Momentaneamente non disponibile'; //la var trama indica che non è disponibile
    } else { //altrimenti se c'è scritto qualcosa
      var trama = filmResults[i].overview; //nella var ci va ciò che c'è scritto all'interno
    }
     var context = { //creo la variabile con il contenuto che andrà nel template.
        copertina: copertina,
        titolo : titolo,
        titolo_originale : titolo_originale,
        lingua : creaBandiere(filmResults[i].original_language), //richiamo la funzione che mi inserisce la bandiera della nazione corrispondente alla lingua
        date : date,
        tipologia: type,
        voto : '<i class="fas fa-star"></i>'.repeat(votoNum), //ripete la stella per il numero del voto
        voto_restante : '<i class="far fa-star"></i>'.repeat(5 - votoNum), //aggiunge la stella per il risultato di 5 meno il numero del voto
        descrizione : trama
      }
      var risultatoRicerca = template_function(context); // utilizzando la funzione generata da handlebars, creo l'html finale
      //devo creare una variabile che mi prende l'id del film
      //con questa variabile devo creare un api che contiene il cast del film
      //devo creare un array vuoto che andrà a contenere gli attori
      //la parte del cast sarà un array contenente il cast e quindi lo ciclo
      //da quel ciclo devo prendere gli attori e pusharli nell'array svuoto
      //da quell'array pieno di attori devo prenderne solo i primi 5

      $('.searchReaults-container').append(risultatoRicerca); // infine vado ad appendere nel container il mio template che si ripeterà fino alla lunghezza dell'array results contenuto nell'API
      //$('.searchMovie').val(''); //resetto l'input con una stringa vuota (opzionale: io l'ho commentato perchè secondo me l'utente, nel caso sbaglia a digitare, deve vedere ciò che ha scritto per poi correggersi)
  }
};
//funzione che mi stampa in html un'immagine al posto del valore di un oggetto
function creaBandiere(flag) {
  if (flag == 'en') { //se ciò che andiamo a richiamare nella funzione corrisponde a 'en' allora mi mette al posto di en un'immagine (stessa cosa per tutti gli altri qui sotto)
    return('img/uk.png');
  }
  if (flag == 'it') {
    return('img/Italy.png');
  }
  if (flag == 'pt') {
    return('img/portugal.png');
  }
  if (flag == 'de') {
    return('img/germany.png');
  }
  if (flag == 'fr') {
    return('img/france.png');
  }
  if (flag == 'es') {
    return('img/spain.png');
  }
  if (flag == 'ja') {
    return('img/japan.png');
  }
  return(flag); //infine se ciò che andiamo a richiamare nella funzione non corrisponde e nessuno di questi, mi ritorna la dicitura che aveva di default
};
