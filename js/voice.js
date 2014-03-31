//http://stiltsoft.com/blog/2013/05/google-chrome-how-to-use-the-web-speech-api/
var recognition;
var textArea;
var textAreaID;
var interimResult = '';
var bEncendido = true;

/** Extendemos jQuery **/

(function($) {

    insertAtCaret = function(areaId,text) {
        var txtarea = document.getElementById(areaId);
        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false ) );
        if (br == "ie") {
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart ('character', -txtarea.value.length);
            strPos = range.text.length;
        }
        else if (br == "ff") strPos = txtarea.selectionStart;

        var front = (txtarea.value).substring(0,strPos);
        var back = (txtarea.value).substring(strPos,txtarea.value.length);
        txtarea.value=front+text+back;
        strPos = strPos + text.length;
        if (br == "ie") {
            txtarea.focus();
            range = document.selection.createRange();
            range.moveStart ('character', -txtarea.value.length);
            range.moveStart ('character', strPos);
            range.moveEnd ('character', 0);
            range.select();
        }
        else if (br == "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
    };

    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };

    $.fn.setCursorPosition = function(pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

})(jQuery);

/** END **/


/** Logica **/
(function($) {
    $(document).ready(function() {
    	if(InitSpeechRecognition()){
    		console.log("Funcion InitSpeechRecognition ejecutada con exito.");
    	}

        
        //textArea = document.getElementById("speech-page-content");
        textArea = $('#speech-page-content');
        textAreaID = "speech-page-content";

        /*$('.speech-mic').click(function(){
            startRecognition();
        });

        $('.speech-mic-works').click(function(){
            recognition.stop();
        });*/

        var startRecognition = function() {
            //$('.speech-content-mic').removeClass('speech-mic').addClass('speech-mic-works');
            textArea.value = "SHARINGAN";
            textArea.focus();
            recognition.start();
            console.log("Recognition started!");
        };

        recognition.onresult = RecognitionHandler;

        recognition.onend = function() {
            $('.speech-content-mic').removeClass('speech-mic-works').addClass('speech-mic');
        };

        //
        startRecognition();
    });
})(jQuery);

/*******************************/

function InitSpeechRecognition(){
		try {
            recognition = new webkitSpeechRecognition();
        } catch(e) {
            console.log("Failed to create webkitSpeechRecognition object!");
            return false;
        }

	if(recognition){
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "es";
		return true;
	}else{
		console.log("Failed to create webkitSpeechRecognition object!");
		return false;
	}
}

function RecognitionHandler(event){
    /*var pos = textArea.getCursorPosition() - interimResult.length;
    textArea.val(textArea.val().replace(interimResult, ''));
    interimResult = '';
    textArea.setCursorPosition(pos);
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            insertAtCaret(textAreaID, event.results[i][0].transcript);
        } else {
            isFinished = false;
            insertAtCaret(textAreaID, event.results[i][0].transcript + '\u200B');
            interimResult += event.results[i][0].transcript + '\u200B';
        }
    }*/


    //for(var i = event.resultIndex; i < event.results.length; ++i){
        var i = event.resultIndex;
        if(event.results[i].isFinal){ // Nos aseguramos de que sea el ultimo call del index al evento.
            var transcription = event.results[i][0].transcript.toLowerCase();
            console.log("-----onresult triggered!-----");

            if(transcription == "reanudar"){
                bEncendido = true;
                console.log("encendido");
                return;
            }
            if(transcription == "detener"){
                bEncendido = false;
                console.log("apagado");
                return;
            }
            if(bEncendido){
                switch(transcription){
                    case "hola":
                        console.log("HOLA LEO!");
                    break;
                    default:
                        console.log("No le hemos entendido!");
                    break;
                }
                console.log("Resultado en index " + event.resultIndex + ": " + event.results[i][0].transcript);
            }
            console.log("-----------------------------");
        //}
        }
        
}

function NavigationSpeaker(){
    this.play = function(sound){
        switch(sound.toLowerCase()){
            case "intro":
            break;
            case "detenido":
            break;
            case "reanudado":
            break;
            default:
            console.log("'NavigationSpeaker' doesn't understand '"+ sound +"' command.");
            break;
        }
    }
}