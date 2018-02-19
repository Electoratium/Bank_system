"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var name_form = document.querySelector('.form');

    function connection_definition() {


        var accept_el = {
            id: '#drop-1,#drop-2,#drop-3,#drop-4'
        };
        var correct_filled_block = 0;

        //html el
        var progress = document.querySelector('#connection_definition .progress_task');
        var condition = document.querySelector('#connection_definition .condition');
        var concepts_block = document.querySelector('#connection_definition #concepts_block');
        var dropzones_block = document.querySelector('#connection_definition #dropzones_block');
        var definition_block = document.querySelector('#connection_definition #definition_block');
        var button = document.querySelector('#connection_definition .next-test-btn');


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
                    // draggableElement.classList.add('can-drop');
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
                    correct_filled_block++;
                    remove_drag_element(draggableElement, dropzoneElement);

                    align_element(dropzoneElement, draggableElement);

                    if (correct_filled_block == 4) {
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
            button.classList.toggle('hide_element');


            // button.addEventListener('click', next_test);
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



        setTimeout(show_connection_block, 1000);

        function hide_connection_block() {
            progress.classList.remove('show_element');
            condition.classList.remove('show_element');

            //show connection_definition block
            concepts_block.style.left = '-100%';
            dropzones_block.style.opacity = '0';
            definition_block.style.right = '-100%';
        }

        setTimeout(hide_connection_block, 3000)


    }
    connection_definition();



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

                // test_block()








            },
            error: function () {
                console.log('Error');
            }
        })


    });

});