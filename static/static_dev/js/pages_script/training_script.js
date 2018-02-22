"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var name_form = document.querySelector('.form');

    name_form.addEventListener('submit', function (event) {
        event.preventDefault();
        //hide form
        var user_name_form = document.querySelector('.initial-form');
        user_name_form.className += ' hide_element';
        setTimeout(function(){ user_name_form.className += ' delete_element'}, 300);
        var user_name = document.querySelector('#user_name').value;
        var csrf_token = document.querySelector('.form [name="csrfmiddlewaretoken"]').value;
        var Url = name_form.getAttribute('action');
        var data = {};
        data["csrfmiddlewaretoken"] = csrf_token;
        data["user_name"] = user_name;
        $.ajax({
            url: Url,
            type: 'POST',
            data: data,
            cache: true,
            success:function (data) {
                //show test block
                function test_block() {
                    var test_data = data['tests'];
                    var current_test = 1;
                    var nmb_test = test_data['correct_answers'].length;
                    var nmb_correct_test = 0;

                    //html el
                    var completed_tests_container = document.querySelector('#test_block .progress_task');
                    var condition_container = document.querySelector('#test_block .condition');
                    var test_block = document.querySelector('#test_block .list-group');
                    var answer_elements = document.querySelectorAll('#test_block .list-group a');
                    var completed_test = document.querySelector('#test_block .progress_task p');
                    var condition = document.querySelector('.condition h3');
                    var button = document.querySelector('#test_block .next-test-btn');



                    function display_test() {
                        document.querySelector('#test_block').classList.toggle('delete_element');

                        filling_elements();

                        setTimeout(change_visibility_test_block, 300);

                        for (var test_index = 0; test_index < 4; test_index++) {
                            answer_elements[test_index].addEventListener('click', show_result)
                        }
                    }

                    display_test();

                    function filling_elements() {
                        var question = test_data['questions'][current_test - 1];
                        var variant_answers = test_data['answers'][current_test - 1];

                        completed_test.innerHTML = "Тест: " + current_test + "/" + nmb_test;
                        condition.innerHTML = question;

                        for (var test_index = 0; test_index < 4; test_index++) {
                            answer_elements[test_index].innerHTML = variant_answers[test_index];
                        }
                    }

                    function change_visibility_test_block() {
                        completed_tests_container.classList.toggle('show_element');
                        condition_container.classList.toggle('show_element');
                        test_block.classList.toggle('show_test_block');
                    }

                    function check_result(el, current_answer) {
                        var answer = el.getAttribute('data-answer');

                        if (parseInt(answer) === current_answer) {
                            nmb_correct_test++;
                            return 1;
                        }
                        return 0;
                    }

                    function show_result(event) {
                        var correct_answer = test_data['correct_answers'][current_test - 1];
                        var result = check_result(event.target, correct_answer);

                        if (result == 1) {
                            event.target.classList.replace('list-group-item-light', 'list-group-item-success');
                        }
                        else {
                            //show what is correct answer
                            test_block.children[correct_answer - 1].classList.replace('list-group-item-light', 'list-group-item-success');
                            event.target.classList.replace('list-group-item-light', 'list-group-item-danger');
                        }

                        change_visibility_button();

                        //remove listeners for others elements
                        for (var test_index = 0; test_index < 4; test_index++) {
                            answer_elements[test_index].removeEventListener('click', show_result)
                        }
                    }

                    function change_visibility_button() {
                        button.classList.toggle('hide_element');

                        button.addEventListener('click', next_test);
                    }

                    function next_test() {
                        current_test++;

                        //hide button
                        button.classList.toggle('hide_element');

                        change_visibility_test_block();

                        if(current_test <= nmb_test) {

                            setTimeout(filling_elements, 800);

                            setTimeout(change_visibility_test_block, 800);

                            for (var test_index = 0; test_index < 4; test_index++) {
                                answer_elements[test_index].addEventListener('click', show_result);
                                answer_elements[test_index].classList = 'list-group-item list-group-item-action list-group-item-light';
                            }
                        }
                        else{

                            setTimeout(function(){
                                document.querySelector('#test_block').classList.toggle('delete_element')
                                }
                            ,800);

                            return nmb_correct_test;
                        }
                        button.removeEventListener('click', next_test);
                    }
                }

                // test_block();

                function connection_definition() {
                    var connection_definition_data = data['connections_definition'];
                    var concepts = connection_definition_data['concepts'];
                    var definitions = connection_definition_data['definitions'];

                    var current_connection = 0;
                    var nmb_connections = concepts.length;
                    var accept_el = {
                        id: '#drop-1,#drop-2,#drop-3,#drop-4'
                    };
                    var correct_filled_block = {
                        value: 0
                    };

                    //html el
                    var connection_block = document.querySelector('#connection_definition');
                    var progress = document.querySelector('#connection_definition .progress_task');
                    var condition = document.querySelector('#connection_definition .condition');
                    var concepts_block = document.querySelector('#connection_definition #concepts_block');
                    var concepts_elements = document.querySelectorAll('#connection_definition #concepts_block li');
                    var dropzones_block = document.querySelector('#connection_definition #dropzones_block');
                    var dropzones_elements = document.querySelectorAll('#connection_definition #dropzones_block li');
                    var definition_block = document.querySelector('#connection_definition #definition_block');
                    var definition_elements = document.querySelectorAll('#connection_definition #definition_block li');
                    var button = document.querySelector('#connection_definition .next-test-btn');


                    connection_block.classList.remove('delete_element');


                    interact('.dropzone').dropzone({
                        // only accept elements matching this CSS selector
                        accept: accept_el['id'],
                        // Require a 25% element overlap for a drop to be possible
                        overlap: 0.25,
                        // listen for drop related events:
                        ondropactivate: function (event) {
                            event.target.classList.add('drop-active');
                        },
                        ondragenter: function (event) {
                            var draggableElement = event.relatedTarget,
                                dropzoneElement = event.target;

                            if (validate_position(draggableElement, dropzoneElement)) {
                                // feedback the possibility of a drop
                                dropzoneElement.classList.add('drop-target');
                            }
                            else {
                                dropzoneElement.classList.add('cant-drop');
                            }
                        },
                        ondragleave: function (event) {
                            event.target.classList.remove('drop-target');
                            event.relatedTarget.classList.remove('can-drop');
                            event.target.classList.remove('cant-drop');
                        },
                        ondrop: function (event) {
                            var draggableElement = event.relatedTarget,
                                dropzoneElement = event.target;

                            if (validate_position(draggableElement, dropzoneElement)) {
                                correct_filled_block['value']++;
                                remove_drag_element(draggableElement, dropzoneElement);

                                align_element(dropzoneElement, draggableElement);

                                if (correct_filled_block['value'] === 4) {
                                    show_button();
                                }
                            }
                            else {
                                dropzoneElement.classList.remove('cant-drop');

                                draggableElement.style.transform =
                                    'translate( 0, 0)';
                                draggableElement.setAttribute('data-x', 0);
                                draggableElement.setAttribute('data-y', 0);
                            }
                        },
                        ondropdeactivate: function (event) {
                            // remove active dropzone feedback
                            event.target.classList.remove('drop-active');
                            event.target.classList.remove('drop-target');
                        }
                    });
                    interact('.draggable').draggable({
                        // enable inertial throwing
                        inertia: true,
                        // keep the element within the area of it's parent
                        restrict: {
                            restriction: ".connection_block",
                            endOnly: true,
                            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                        },
                        // enable autoScroll
                        autoScroll: true,
                        // call this function on every dragmove event
                        onmove: dragMoveListener
                    });

                    function validate_position(draggable_el, dropzone_el) {
                        var nmb_question = draggable_el.getAttribute('data-definition'),
                            nmb_dropzone = dropzone_el.getAttribute('data-dropzone');

                        if (nmb_question === nmb_dropzone) {
                            return true
                        }
                        return false
                    }

                    function remove_drag_element(draggable_el, dropzone) {
                        draggable_el.classList.remove('draggable');
                        dropzone.classList.remove('dropzone');
                    }

                    function align_element(dropzone, draggable_el) {
                        var box_dropzone = dropzone.getBoundingClientRect(),
                            box_draggable_el = draggable_el.getBoundingClientRect();

                        draggable_el.style.left = (box_dropzone.left - box_draggable_el.left) + 'px';
                        draggable_el.style.top = (box_dropzone.top - box_draggable_el.top) + 'px';
                    }

                    function dragMoveListener(event) {
                        var target = event.target,
                            // keep the dragged position in the data-x/data-y attributes
                            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // translate the element
                        target.style.webkitTransform =
                            target.style.transform =
                                'translate(' + x + 'px, ' + y + 'px)';

                        // update the posiion attributes
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }

                    function show_button() {
                        button.classList.remove('hide_element');


                        button.addEventListener('click', next_task);
                    }

                    function next_task() {
                        current_connection++;

                        correct_filled_block['value'] = 0;

                        var current_task = current_connection + 1;

                        hide_connection_block();
                        //hide button
                        button.classList.add('hide_element');
                        if(current_task <= nmb_connections) {
                            setTimeout(restart_connection, 1000);
                            setTimeout(fill_elements, 1000);
                            setTimeout(show_connection_block, 1000);
                        }
                        else{
                            setTimeout(function(){
                                connection_block.classList.add('delete_element')
                            }, 1000);
                        }
                    }

                    function show_connection_block() {
                        //show title block
                        progress.classList.add('show_element');
                        condition.classList.add('show_element');

                        //show connection_definition block
                        concepts_block.style.left = '0';
                        dropzones_block.style.opacity = '1';
                        definition_block.style.right = '0';
                    }
                    setTimeout(show_connection_block, 500);

                    function fill_elements() {
                        document.querySelector('#connection_definition .progress_task p').innerHTML = "Завдання: " + (current_connection + 1) + '/' + nmb_connections;

                        var keys = [];
                        for(var item in definitions[current_connection]){
                            keys.push(item);
                        }
                        var answers_id = [];
                        for(var key of keys){
                            answers_id.push(key.slice(-1));
                        }

                        for (var i = 0;i < 4; i++){
                            concepts_elements[i].innerHTML = concepts[current_connection][i];

                            definition_elements[i].innerHTML = definitions[current_connection][keys[i]];

                            definition_elements[i].setAttribute('data-definition', answers_id[i]);
                        }

                    }
                    //first activate
                    fill_elements();

                    function restart_connection() {

                        for(var draggable_el of definition_elements) {
                            draggable_el.style.transform =
                                'translate( 0, 0)';

                            //move to start position dtaggable element
                            draggable_el.setAttribute('data-x', 0);
                            draggable_el.setAttribute('data-y', 0);
                            draggable_el.style.left = 0;
                            draggable_el.style.top = 0;

                            //activate draggable element
                            draggable_el.classList.add('draggable');
                        }

                        //activate dropzones
                        for(var dropzone of dropzones_elements){
                            dropzone.classList.add('dropzone');
                        }
                    }

                    function hide_connection_block() {
                        progress.classList.remove('show_element');
                        condition.classList.remove('show_element');

                        //show connection_definition block
                        concepts_block.style.left = '-100%';
                        dropzones_block.style.opacity = '0';
                        definition_block.style.right = '-100%';
                    }
                }
                // setTimeout(connection_definition, 1000);
                    function exercise_block(){
                        var exercises = data['exercises'];
                        var correct_answers = exercises['correct_answers'];
                        var hints = exercises['hints'];
                        var resolving_hints = exercises['resolving_hints'];
                        var data_task = {
                            current_task: 0,
                            nmb_mistakes: 0
                        };
                        var nmb_exercises = exercises['titles'].length;



                        //html el
                        var exercises_block = document.querySelector('#exercises');
                        var progress_block = document.querySelector('#exercises .progress_block');
                        var hint_block = document.querySelector('#exercises .hint_container');
                        var condition_block = document.querySelector('#exercises .condition_block');
                        var input_block = document.querySelector('#exercises .answer_container');
                        var input = document.getElementById('answer');
                        var check_result_button = document.querySelector('#exercises .input-group .btn');
                        var button = document.querySelector('#exercises .next-test-btn');


                        exercises_block.classList.remove('delete_element');


                        function toggle_visibility_block() {
                            progress_block.classList.toggle('progress_task');
                            condition_block.classList.toggle('condition');
                            input_block.classList.toggle('show_answer_container');
                        }
                        setTimeout(toggle_visibility_block, 50);

                        function fill_exercises_block() {
                            exercises_block.firstElementChild.innerHTML = "Задача " + (data_task["current_task"] + 1) + "/" + nmb_exercises;

                            document.querySelector('#exercises .condition_block div h3').innerHTML = exercises['titles'][data_task['current_task']];
                            document.querySelector('#exercises .condition_block div h4').innerHTML = exercises['conditions'][data_task['current_task']];
                        }
                        fill_exercises_block();


                        function toggle_visibility_hint_block() {
                            hint_block.classList.toggle('show_hint_container');
                        }


                        input_block.addEventListener('transitionend', set_event_listener);

                        function set_event_listener(){
                            input_block.removeEventListener('transitionend', set_event_listener);

                            check_result_button.addEventListener('click', check_result);
                        }


                        function check_result(event) {
                            var correct_answer = parseFloat(correct_answers[data_task['current_task']].toFixed(2));
                            var cur_answer = parseFloat(parseFloat(input.value).toFixed(2));

                            if(!isNaN(cur_answer)){
                                event.preventDefault();

                                if(((correct_answer + 0.1) >= cur_answer) && (cur_answer >= (correct_answer - 0.1))){
                                    input.classList.remove('is-invalid');
                                    input.classList.add('is-valid');
                                    input.setAttribute('disabled', 'disabled');
                                    check_result_button.setAttribute('disabled', 'disabled');


                                    button.classList.remove('hide_element');
                                }
                                else{
                                    data_task['nmb_mistakes'] += 1;

                                    input.classList.add('is-invalid');
                                    //добавь сплющивание формы при неверном ответе

                                    if(data_task['nmb_mistakes'] == 1 ){
                                        document.querySelector('#exercises .card').innerHTML = hints[data_task['current_task']];
                                        toggle_visibility_hint_block()
                                    }

                                    if(data_task['nmb_mistakes'] == 2 ){
                                        document.querySelector('#exercises .card').innerHTML = resolving_hints[data_task['current_task']];
                                    }




                                }



                            }


                        }


                    }
                    exercise_block();




            },
            error: function () {
                console.log('Error');
            }
        })


    });

});