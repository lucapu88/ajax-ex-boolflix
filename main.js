$(document).ready(function(){
  $('.home').click(function(){ //se clicco sulla scritta BOOLFLIX
    location.reload(); //ricarico la pagina
    //$('.searchReaults-container').empty(); //svuoto il contenitore
  });
  $('button').click(function(){ // al click sul pulsante cerca
    trovaFilm(); //applico la mia funzione creata
    $('.choise').addClass('visible'); //rendo visibile la select per scegliere le opzioni
  });
  $('.searchMovie').keypress(function(event) { //quando si è in posizione dell'input e viene premuto INVIO
    var testoRicerca = $('.searchMovie').val(); //recupero ciò che viene scritto nell'input
    if (event.which == 13 && testoRicerca != 0) { // se viene premuto INVIO (che corrisponde al numero 13 della mappatura dei tasti) e se nell'input c'è scritto qualcosa
      trovaFilm(); //applico la mia funzione creata
      $('.choise').addClass('visible'); //rendo visibile la select per scegliere le opzioni
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
  $('.choise').change(function(){ //verifico quando viene cambiata l'opzione
    var typeSelect = $('.choise').val() //creo una var che mi prende il value nell'option dentro il select
    if (typeSelect == '') { // se l'opzione scelta è uguale ad una stringa vuota, ovvero è impostato su 'Ordina per...' (che non ha val)
      $('.searchReaults').fadeIn(); //mostra tutto
    } else { //altrimenti se viene scelto 'Film' oppure 'SerieTV'
      $('.searchReaults').each(function(){ //vado a verificare per ogni singolo div
      var typeChoise = $(this).attr('data-type'); //creo una var che mi prende l'attributo del data corrispondente
      if (typeChoise == typeSelect) { //se l'attributo del typeChoise è uguale a una delle opzioni sella select
        $(this).fadeIn(); //allora lo mostro
      } else {
        $(this).fadeOut(); //altrimenti lo nascondo
      }
    });
    }
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
      //con questa variabile devo creare una chiamata ajax con un api che contiene il cast del film
      //devo creare un array vuoto che andrà a contenere gli attori
      //la parte del cast sarà un array contenente il cast e quindi lo ciclo
      //da quel ciclo devo prendere gli attori e pusharli nell'array vuoto
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
