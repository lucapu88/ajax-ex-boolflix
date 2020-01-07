$(document).ready(function(){
  //chiamata ajax per creare una home page con i film del momento
  $.ajax({
    url : 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + API_KEY+ '&language=it-IT&page=1',
    method : 'get',
    success : function(data) {
      var filmResults = data.results;
      var film3 = []; //creo un array vuoto che conterrà le locandine dei film
      for (var i = 0; i < filmResults.length; i++) { //ciclo tutta la lunghezza dei risultati
        var imgFilm = '<img src="' + 'https://image.tmdb.org/t/p/w342' + filmResults[i].poster_path + '">'; //var che conterrà il tag dell'immagine
        if (filmResults[i].poster_path != null && filmResults[i].vote_average > 6) { //controllo prima che ci sia un'immagine come locandina e che il voto del film sia superiore a 6 (in modo da far uscire i film più votati)
          film3.push(imgFilm); //vado ad inserire nell'array la locandina
        }
      }
      console.log(film3);
      $('#slideshow > #film1').append(film3.slice(0,3)); //appendo nel primo div le prime 3 locandine dei film
      $('#slideshow > #film3').append(film3.slice(3,6)); //appendo nel terzo div le successive 3 locandine dei film
      $('#slideshow > #film5').append(film3.slice(6,9)); //appendo nel quinto div le altre successive 3 locandine dei film
    },
    error : function() {
      alert('popular Film home error');
    }
  });
  //chiamata ajax per creare una home page con le serie tv del momento.
  $.ajax({
    url : 'https://api.themoviedb.org/3/tv/popular?api_key=' + API_KEY+ '&language=it-IT&page=1',
    method : 'get',
    success : function(data) {
      var filmResults = data.results;
      var serie3 = []; //creo un array vuoto che conterrà le locandine dei film
      for (var i = 0; i < filmResults.length; i++) { //ciclo tutta la lunghezza dei risultati
        var imgSerie = '<img src="' + 'https://image.tmdb.org/t/p/w342' + filmResults[i].poster_path + '">'; //var che conterrà il tag dell'immagine
        if (filmResults[i].poster_path != null && filmResults[i].vote_average > 6) { //controllo prima che ci sia un'immagine come locandina e che il voto del film sia superiore a 6 (in modo da far uscire i film più votati)
          serie3.push(imgSerie); //vado ad inserire nell'array la locandina
        }
      }
      console.log(film3);
      $('#slideshow > #film2').append(serie3.slice(0,3)); //appendo nel secondo div le prime 3 locandine delle serie
      $('#slideshow > #film4').append(serie3.slice(3,6)); //appendo nel quarto div le successive 3 locandine delle serie
      $('#slideshow > #film6').append(serie3.slice(6,9)); //appendo nel sesto div le altre successive 3 locandine delle serie
    },
    error : function() {
      alert('popular SerieTV home error');
    }
  });
  //creo un carosello automatico che mostrerà (a gruppi di 3 immagini) ogni 3,5 secondi le locandine dei film e delle serie del momento
  var clock = setInterval(function(){ //apro la funzione che fa partire il mio timer
    var divActive = $('div.evident'); //dichiaro la var contenente il div visibile.
    var divNext = divActive.next('div'); //dichiaro la var contenente il div successivo.
    if (divNext.length == 0) { //controllo che ci sia un div e nel caso non c'è, riprende il div iniziale
     divNext = $('div.first'); //se non c'è un div successivo, si prende il primo
    }
    (divActive).removeClass('evident'); //rimuovo la classe evident al div
    (divNext).addClass('evident'); //aggiungo la classe evident al div
  }, 3500);
  $('.home').click(function(){ //se clicco sulla scritta BOOLFLIX
    location.reload(); //ricarico la pagina
    //$('.searchReaults-container').empty(); //svuoto il contenitore
  });
  $('button').click(function(){ // al click sul pulsante cerca
    trovaFilm(); //applico la mia funzione creata
    var typeSelect = $('.choise').val(''); //reimposto la select con il valore predefinito
  });
  $('.searchMovie').keypress(function(event) { //quando si è in posizione dell'input e viene premuto INVIO
    var testoRicerca = $('.searchMovie').val(); //recupero ciò che viene scritto nell'input
    if (event.which == 13 && testoRicerca != 0) { // se viene premuto INVIO (che corrisponde al numero 13 della mappatura dei tasti) e se nell'input c'è scritto qualcosa
      trovaFilm(); //applico la mia funzione creata
      var typeSelect = $('.choise').val(''); //reimposto la select con il valore predefinito
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
    if (typeSelect == '') { // se l'opzione scelta è uguale ad una stringa vuota, ovvero è impostato su 'Ordina per: Tutti i risultati' (che non ha val)
      $('.searchReaults').fadeIn(); //mostra tutto
    } else { //altrimenti se viene scelto 'Film' oppure 'SerieTV'
      $('.searchReaults').each(function(){ //vado a verificare per ogni singolo div
      var typeChoise = $(this).attr('data-type'); //creo una var che mi prende l'attributo del data corrispondente
      if (typeChoise.toLowerCase() == typeSelect.toLowerCase()) { //se l'attributo del typeChoise è uguale a una delle opzioni sella select
        $(this).fadeIn(); //allora lo mostro
      } else {
        $(this).fadeOut(); //altrimenti lo nascondo
      }
    });
    }
  });
});
//-------------------------------------FUNZIONI----------------------------------------------

//funzione che va a prendermi un Film/SerieTV da un API tramite ciò che scrivo all'interno dell'input e mi crea una select per sceglere la lingua
function trovaFilm() {
  var typeSelect = $('.choise_language').val() //creo una var che mi prende il value nell'option dentro il select
  if (typeSelect == '') { //se l'opzione scelta è uguale ad una stringa vuota, ovvero è impostato su 'Lingua di ricerca: (default ITA)' (che non ha val)
    var language = 'it'; //la lingua è di default in italiano
  }
  if (typeSelect == 'eng') { //se l'opzione scelta è uguale a 'eng'
    var language = 'en'; //la lingua di ricerca sarà in inglese
  }
  if (typeSelect == 'spa') { //se l'opzione scelta è uguale a 'spa'
    var language = 'es'; //la lingua di ricerca sarà in spagnolo
  }
  if (typeSelect == 'ger') { //se l'opzione scelta è uguale a 'ger'
    var language = 'de'; //la lingua di ricerca sarà in tedesco
  }
  if (typeSelect == 'fra') { //se l'opzione scelta è uguale a 'fra'
    var language = 'fr'; //la lingua di ricerca sarà in francese
  }
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
        'language' : language
      },
      method : 'get',
      success : function(data) {
        console.log('film:');
        console.log(data); //tengo il log per verificare gli elementi stampati
        if (data.total_results > 0) { //se ci sono risultati nella ricerca
          var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
          creaTemplate(filmResults); //applico la mia funzione creata per stampare i film/serietv
          creaCast(data); //applico la mia funzione per stampare il cast
        } else { //se non ci sono risultati
          $('.searchReaults-container').append('Nessun risultato trovato per Film'); //appendo un messaggio
          //$('.searchMovie').val(''); //resetto l'input con una stringa vuota (opzionale: io l'ho commentato perchè secondo me l'utente, nel caso sbaglia a digitare, deve vedere ciò che ha scritto per poi correggersi)
        }
      },
      error : function() {
        alert('film error');
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
        'language' : language
      },
      method : 'get',
      success : function(data) {
        console.log('SerieTV:');
        console.log(data); //tengo il log per verificare gli elementi stampati
        if (data.total_results > 0) { //se ci sono risultati nella ricerca
          var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
          creaTemplate(filmResults); //applico la mia funzione creata per stampare i film/serietv
          creaCast(data); //applico la mia funzione per stampare il cast
        } else { //se non ci sono risultati
          $('.searchReaults-container').append('Nessun risultato trovato per SerieTV'); //appendo un messaggio
          //$('.searchMovie').val(''); //resetto l'input con una stringa vuota (opzionale: io l'ho commentato perchè secondo me l'utente, nel caso sbaglia a digitare, deve vedere ciò che ha scritto per poi correggersi)
        }
      },
      error : function() {
        alert('serie error');
      }
    });
  }
} //FINE funzione trovaFilm
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
        descrizione : trama,
        id : filmResults[i].id
      }
      var risultatoRicerca = template_function(context); // utilizzando la funzione generata da handlebars, creo l'html finale
      $('.searchReaults-container').append(risultatoRicerca); // infine vado ad appendere nel container il mio template che si ripeterà fino alla lunghezza dell'array results contenuto nell'API
      $('.choise, .number').addClass('visible'); //rendo visibile le pagine, e la select per scegliere le opzioni
      //$('.searchMovie').val(''); //resetto l'input con una stringa vuota (opzionale: io l'ho commentato perchè secondo me l'utente, nel caso sbaglia a digitare, deve vedere ciò che ha scritto per poi correggersi)
  }
} //FINE funzione creaTemplate
//funzione che tramite una chiamata ajax mi va a recuperare i primi 5 attori del cast
function creaCast(data) {
  var filmResults = data.results; //creo una variabile che mi prende l'array dei risultati dentro l'API
  for (var i = 0; i < filmResults.length; i++) { //ciclo tutta la lunghezza dell'array contenente i film
    if (filmResults[i].hasOwnProperty('title')) { //se nell'array è definita la proprietà .title (e quindi è un Film)
      var apiMovCredits = '/movie/'; //API per un film
    } else { //se nell'array NON è definita la proprietà .title (e quindi se non è un film, è una SerieTV)
      var apiMovCredits = '/tv/'; //API per una serietv
    }
    var filmId = filmResults[i].id; //variabile che mi prende l'id del film/serie
    var urlMDb = 'https://api.themoviedb.org/3';
  }
    $.ajax({
      url : urlMDb + apiMovCredits + filmId + '/credits?api_key=' + API_KEY,
      method : 'get',
      success : function(data) {
        var actorResults = data.cast; //variabile che definisce l'array contenente i nomi degli attori
        var actors = []; //array che andrà a contenere tutti gli attori del film/serie
        if (actorResults.length == 0) { //se non ci sono risultati nel cast
            $('.searchReaults').find('.cast').append(' Cast non disponibile');//appendo un testo
        } else { //altrimenti se ci sono risultati nel cast
          for (var j = 0; j < actorResults.length && j < 5; j++) { //la parte del cast sarà un array contenente tutti i nomi degli attori e quindi lo ciclo
            actors.push(actorResults[j].name); //dal ciclo prendo gli attori e vado ad inserirli nell'array vuoto per 5 volte poichè mi servono solo i primi 5 (oppure potevo usare .slice(0,5) sulla var actors)
          }
          console.log(actors);
        }
        $('.searchReaults').find('.cast').append(actors); //in fine vado a cercare la classe cast nel div .searchReaults e vado ad appendere l'array contenente i 5 attori

          // if (actors == 0) { //se l'array data.cast contiene risultati
          //   //$('.searchReaults').each(function(){ //vado a verificare per ogni singolo div
          //     //$(this).find('.cast').text(fiveActors); //vado a cercare il cast nel div e ci metto come testo l'array contenente solo i 5 attori
          //     //se faccio append mi va ad inserire tutti gli array insieme in ogni div
          //     $('.searchReaults').find('.cast').append(' Cast non disponibile');
          //
          //   //});
          // } else { //altrimenti se è vuoto
          //   $('.searchReaults').find('.cast').append(actors);
          // }
      },
      error : function() {
        alert('cast error');
      }
    });
} //FINE funzione creaCast
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
}  //FINE funzione creaBandiere
