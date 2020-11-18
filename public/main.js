var ws = new WebSocket("ws://localhost:1337");
var _playing = false;
var first_touch = true;
var pattern = 'WAWAWAWAWA';
var time = 20000;
var score = 0;
var indeks = 0;


var setScore = (s) => {
    score = s;
    document.getElementById('s1s').innerHTML = score;
}
var setIndeks = (v) => {
    indeks = v;
    document.getElementById('c1').innerHTML = pattern[indeks];
}

var zasvetli_na_indeksu = (uboo) => {
    let mapa = [
        {
            t: 'pointt6_1',
            f: 'point5_1'
        },
        {
            t: 'pointt5_1',
            f: 'point4_1'
        },
        {
            t: 'pointt6_1',
            f: 'point5_1'
        },
        {
            t: 'pointt4_1',
            f: 'point3_1'
        },
        {
            t: 'pointt6_1',
            f: 'point5_1'
        },
        {
            t: 'pointt3_1',
            f: 'point2_1'
        },
        {
            t: 'pointt6_1',
            f: 'point5_1'
        },
        {
            t: 'pointt2_1',
            f: 'point1_1'
        },
        {
            t: 'pointt6_1',
            f: 'point5_1'
        },
        {
            t: 'pointt1_1',
            f: 'point1_1'
        }
    ];
    let elem = document.getElementById(mapa[indeks][uboo?'t':'f']);
    elem.style.backgroundColor = uboo?'#0F0':'#F00';
    elem.style.opacity = '1';
    setTimeout(() => {elem.style.opacity = '0';}, 700);
}

var getCurrentMove = () => {
    return pattern[indeks];
}

var setPlaying = (bv) => {
    _playing = bv;
    document.getElementById('playing').style.backgroundColor = bv?'#00FF0066':'#FF000066';
}


var startTimer = () => {
    var intr = setInterval(() => {
        time-=100
        document.getElementById('t1').innerHTML = `00:${Math.floor(time/1000)<10?`0${Math.floor(time/1000)}`:Math.floor(time/1000)}:${(time%1000)/10<10?`0${(time%1000)/10}`:(time%1000)/10}`
        if(time <= 0) {
            setPlaying(false);
            clearInterval(intr);
        }
    }, 100);
    return;
}


document.addEventListener('keydown', function(e) {
    if(!_playing) return;

    if (first_touch) {
        first_touch = false;
        startTimer();
    }

    
    if (e.key.toUpperCase() == getCurrentMove()) {
        zasvetli_na_indeksu(true);
        setIndeks(indeks+1);
        if (indeks >= pattern.length) {setScore(score + 1); setIndeks(0);};
    } else {
        zasvetli_na_indeksu(false);
        setIndeks(0);
    }
}); 

ws.onmessage = function (event) {
    // Prikaz neprijatelja
    let data = JSON.parse(event.data);
    switch(data.type) {
        case 'connected':
            // Protivnik connected
            break;

        case 'pattern':
            // Stigao patern oblika 'asdad'...
            document.getElementById('p1').innerHTML = data.data.split('')[0];
            document.getElementById('p2').innerHTML = data.data.split('')[1];
            document.getElementById('p3').innerHTML = data.data.split('')[2];
            document.getElementById('p4').innerHTML = data.data.split('')[3];
            document.getElementById('p5').innerHTML = data.data.split('')[4];
            pattern = `W${data.data.split('')[0]}W${data.data.split('')[1]}W${data.data.split('')[2]}W${data.data.split('')[3]}W${data.data.split('')[4]}`
            break;

        case 'start':
            setPlaying(true);
            first_touch = true;
            break;

        case 'move':
            // Protivnik odigrao potez
            break;
        
        default:
            break;
    }
}
var generated_code = '';
var lista = [
    'point1_1',
    'point2_1',
    'point3_1',
    'point4_1',
    'point5_1',
    'pointt1_1',
    'pointt2_1',
    'pointt3_1',
    'pointt4_1',
    'pointt5_1',
    'pointt6_1',
    'point1_2',
    'point2_2',
    'point3_2',
    'point4_2',
    'point5_2',
    'pointt1_2',
    'pointt2_2',
    'pointt3_2',
    'pointt4_2',
    'pointt5_2',
    'pointt6_2',
].reverse();


setIndeks(0);
setPlaying(false);
