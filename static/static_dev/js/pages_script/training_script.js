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
                    var completed_tests_container = document.querySelector('#progress');
                    var condition_container = document.querySelector('#condition_test');
                    var test_block = document.querySelector('#test_block .list-group');
                    var answer_elements = document.querySelectorAll('#test_block .list-group a');
                    var completed_test = document.querySelector('#progress p');
                    var condition = document.querySelector('#condition_test h3');
                    var button = document.querySelector('.next-test-btn');




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








            },
            error: function () {
                console.log('Error');
            }
        })


    });

});