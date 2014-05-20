/*
**
**  Typewrite.js — v. 0.1
**
**  Copyright 2014, Andreas Nymark
**  Licensed under a MIT license, http://ibuypink.com/mit-license/
**
*/
var typewrite = ( function() {
    "use strict";
    
    var settings = {
        selector: '[data-typewrite]', // selector
        $: '', // reference for dom elements
        attr: 'data-typewrite', // attribute container word, seperated with ,
        tw: [], // reference for all contstructors
        delay: 4000, // interval to change word
        speed: 60
    };

    /* Constructor with references */
    var Typewrite = function ( el, words, delay ) {
        var t = this;
        t.el = el;
        t.delay = delay;
        t.timer = false;
        t.words = words.split( ',' );
        t.counterWord = 0;
        t.counterLetter = 0;  
        t.currentWord = "";  
        t.currentWordLength = 0;  
        t.intWord; 
        t.intLetter;
        t.start();        
    };
  
    Typewrite.prototype = {
        constructor: Typewrite,
      
        /* Change word and keep track on what's active */
        changeWord: function() {
            var t = this;
            t.countWord();
            t.intLetter = setInterval( function() {
                t.typing();
            }, settings.speed );  
        },
        
        /* Writes the word, using substr to add 
        ** letters each interval. */
        typing: function() {
            var t = this;
            
            t.currentWord += t.words[ t.counterWord ].substr( t.counterLetter, 1 );
            t.el.innerHTML = t.currentWord; 
            t.counterLetter ++; 
            
            if( t.counterLetter === t.currentWordLength ) {
                t.resetTyping();
            };

        },
        
        /* Reset typing, removes letter interval and 
        ** resets currentWord */
        resetTyping: function() {
            var t = this;
            t.currentWord = "";
            t.counterLetter = 0;
            clearInterval( t.intLetter );
        },
        
        /* Appoint new word and set length of
        ** current word */
        countWord: function() {
            var t = this;
            t.counterWord ++;    
            if( t.counterWord === t.words.length ) { 
                t.counterWord = 0;
            } 
            t.currentWordLength = t.words[ t.counterWord ].length;
        },

        /* Stop and clear intervals and reset everyting.
        ** Used with window event handler */        
        stop: function() {
            var t = this;
            t.el.innerHTML = t.words[ t.counterWord ]; 
            t.timer = false;
            clearInterval( t.intWord );
            clearInterval( t.intLetter );
            t.resetTyping();
        },

        /* Start; sets timeout */ 
        start: function() {
            var t = this;
            if ( t.timer === false ) {
                t.timer = true;
                t.timeout = setTimeout( function() {
                    t.intWord = setInterval( function() {
                        t.changeWord();
                    }, settings.delay );
                }, t.delay );
            }
        }
    };
  
  
    /* Initate. Set selector and loop, and push to 
    ** array tw, for reference */ 
    var init = function() {
        settings.$ = document.querySelectorAll( settings.selector );
        for ( var i = 0; i < settings.$.length; i++ ) {
            var el = settings.$[ i ],
                words = el.getAttribute( settings.attr ),
                delay = ( i * 280 );
        
            // Settings.tw -> reference    
            settings.tw.push( new Typewrite( el, words, delay ) );            
        }
    };
  
    /* Event listeners. When user change tab och 
    ** window, we kill intervals and restart when 
    ** focus is back. */
    window.addEventListener( 'focus', function() {
        for ( var i = 0; i < settings.tw.length; i ++ ) {
            settings.tw[ i ].start();
        }
    }, false );
    window.addEventListener( 'blur', function() {
        for ( var i = 0; i < settings.tw.length; i ++ ) {
            settings.tw[ i ].stop();
        }
    }, false );
    

    return {
        init: init
    };
}());
typewrite.init();
