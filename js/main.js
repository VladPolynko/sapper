var bombs_arr = [];
var fields_arr = [];
var fields = 10;
var bombs = 10;
var prefix_for_id = 'id';

var turn_arr = [];
var passed = [];

var start_game_el = document.getElementById('start_game');
var element_fieldOn = document.getElementById('load_sapper');

start_game_el.onclick = function () {// start
    start();
};

function start() {
    document.getElementById('load_sapper').innerHTML = '';
    fields_arr = [];
    bombs_arr = [];
    passed = [];
    generation_field();
    append_field();
}

function generation_field() {
    for (var i = 0; i < fields; i++) {
        fields_arr[i] = [];

        for (var j = 0; j < fields; j++) {
            fields_arr[i][j] = 0;
        }
    }
    generation_bomb();
}

function generation_bomb() {
    for (var i = 0; i < bombs; i++) {

        var randLo1 = getRandomInt(0, fields - 1);
        var randLo2 = getRandomInt(0, fields - 1);
        var randLo = [randLo1, randLo2]; //data-x: 10 data-y: 2

        if (!(search_arr(randLo, bombs_arr))) { // повоторяеться ли значение в массиве или нет (проверка на повторене)
            bombs_arr.push(randLo);
        } else {
            --i;
        }
    }

    for (var i = 0; i < bombs_arr.length; i++) {
        fields_arr[bombs_arr[i][0]][bombs_arr[i][1]] = 'b'
    }
}

//--------------------------------------------------end chain generation_field

function append_field() {
    help_hint();

    for (var i = 0; i < fields; i++) {
        var li = document.createElement('li');
        var idName_l = 'itemLi' + [i];
        li.id = idName_l;
        load_sapper.appendChild(li);
        var elementFromAppend = document.getElementById(idName_l);

        for (var j = 0; j < fields; j++) {
            var div = document.createElement('div');
            div.id = prefix_for_id + i + j;

            if (fields_arr[i][j] == 0) {
                div.setAttribute("xy", i + " " + j); // добавляем дата атребуты
                div.className = 'box';
                elementFromAppend.appendChild(div);
            } else if (fields_arr[i][j] == "b") {
                div.setAttribute("xy", i + " " + j); // добавляем дата атребуты
                div.className = 'box'; //TODO devMod rename "box" => "b"
                elementFromAppend.appendChild(div);
            } else {
                div.setAttribute("xy", i + " " + j); // добавляем дата атребуты
                div.className = 'box';
                div.innerHTML = fields_arr[i][j];
                elementFromAppend.appendChild(div);
            }
        }
    }
}

function help_hint() {
    for (var z = 0; z < bombs_arr.length; z++) {
        var coords_bomb = bombs_arr[z];
        var a = coords_bomb[0] - 1;
        var b = coords_bomb[1] - 1;

        for (var i = 0; i < 3; i++) {

            for (var j = 0; j < 3; j++) {

                if (fields_arr[a + i] != undefined) {

                    if (fields_arr[a + i][b + j] >= 0) {
                        ++fields_arr[a + i][b + j];
                    }
                }
            }
        }
    }
}

//-------------------------------events

element_fieldOn.onclick = function (e) {
    var e_loc = e.target.getAttribute('xy');
    if (search_status_in_massive(e_loc) >= 0 && e.target.className == "box" && e.which == 1) {
        zone_discovery(e_loc.split(" "));
    }

    var elm_for_add_Class = document.getElementById(prefix_for_id + '' + e_loc.split(' ')[0] + '' + e_loc.split(' ')[1]);

    if (search_status_in_massive(e_loc) == 'b' && e.which == 1 && !(elm_for_add_Class.classList.contains("flag"))) {
        elm_for_add_Class.classList.remove("box");
        elm_for_add_Class.classList.add("b_active");
        alert('---KBOOOOOMM! \n YOU GAME OVER!');
        start();
    }

    if ((search_status_in_massive(e_loc) == 'b' || search_status_in_massive(e_loc) >= 0 ) && e.which == 2) {
        var elm_for_add_Class = document.getElementById(prefix_for_id + '' + e_loc.split(' ')[0] + '' + e_loc.split(' ')[1]);
        elm_for_add_Class.classList.toggle("flag");
    }
};

function zone_discovery(xy) {
    if (fields_arr[xy[0]][xy[1]] == 0) {
        turn_arr.push(xy);
    }

    if (fields_arr[xy[0]][xy[1]] > 0) {
        passed.push(xy);
        var elm_for_add_Class = document.getElementById(prefix_for_id + '' + xy[0] + '' + xy[1]);
        elm_for_add_Class.classList.remove("box");
        elm_for_add_Class.classList.add("box_active");
    }

    mediocre_func();
}

function mediocre_func() {
    if (turn_arr[0]) {
        discovery(turn_arr[0])
    } else {
        win();
    }
}

function discovery(coords) {
    var coords_loc = coords;
    var a = coords_loc[0] - 1;
    var b = coords_loc[1] - 1;

    for (var i = 0; i < 3; i++) {

        for (var j = 0; j < 3; j++) {
            var elm_for_add_Class = document.getElementById(prefix_for_id + '' + (a + i) + '' + (b + j));

            if (fields_arr[a + i] != undefined) {

                if (fields_arr[a + i][b + j] >= 0 && !(elm_for_add_Class.classList.contains("flag"))) {
                    elm_for_add_Class.classList.remove("box");
                    elm_for_add_Class.classList.add("box_active");
                }

                if (fields_arr[a + i][b + j] == 0 && (i != 1 || j != 1) && !(elm_for_add_Class.classList.contains("flag"))) {

                    if (fields_arr[a + i][b + j] == 0) { // добавляем в очередь все след квадратики

                        if (!(search_arr((((a + i) + ' ' + (b + j)).split(' ')), passed))) {   //проверяем нету ли такого значения в passed
                            turn_arr.push(((a + i) + ' ' + (b + j)).split(' ')); //добавляем в очередь
                        }
                        passed.push(((a + i) + ' ' + (b + j)).split(' '));
                    }
                }
            }
        }
    }

    passed.push(turn_arr[0]); // добавляем в массив те что уже были использованы
    turn_arr = turn_arr.slice(1); //удаления значения что уже прошел
    setTimeout(mediocre_func, 1);
}

function win() {
    if (element_fieldOn.getElementsByClassName('box').length === 0) {
        alert('TO WIN');
        start();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function search_arr(target, array) {// посик совпадений в массиве
    for (var p in array) {

        if (array[p][0] == target[0] && array[p][1] == target[1]) {
            return true
        }
    }

    return false
}

function search_status_in_massive(targetXY) {
    if (targetXY) {   // проверка на наличие
        var targetXY_loc = targetXY.split(" ");

        if (fields_arr[targetXY_loc[0]][targetXY_loc[1]] == 'b') {
            return 'b'
        }

        if (fields_arr[targetXY_loc[0]][targetXY_loc[1]] == 0) {
            return '0'
        }

        if (fields_arr[targetXY_loc[0]][targetXY_loc[1]] > 0) {
            return fields_arr[targetXY_loc[0]][targetXY_loc[1]]
        } else {
            return false
        }
    }
}


