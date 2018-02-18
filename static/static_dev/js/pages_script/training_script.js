"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var name_form = document.querySelector('.form');




    var accept_el = {
        id: '#drop-1,#drop-2,#drop-3,#drop-4'
    };

    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      accept: accept_el['id'],

      // Require a 25% element overlap for a drop to be possible
      overlap: 0.25,
      // checker: function (dragEvent, event, dropped, dropzone, dropEl, draggable, draggableElement) {
      //     var nmb_question = draggableElement.getAttribute('data-definition');
      //     var nmb_dropzone = dropEl.getAttribute('data-dropzone');
      //
      //
      //     console.log(nmb_dropzone);
      //     console.log(nmb_question);
      //
      //
      //     return true
      //   // return dropped && !dropElement.hasChildNodes();
      // },

      // listen for drop related events:
      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {

        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;





        if (validate_position(draggableElement, dropzoneElement)) {
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');

            // var height_drag_el = parseInt((getComputedStyle(draggableElement).height).slice(0,-2)) + 20;
            // dropzoneElement.style.height = height_drag_el + 'px';
        }
        else{
            dropzoneElement.classList.add('cant-drop');
        }
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.target.classList.remove('cant-drop');
      },
      ondrop: function (event) {
          var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

          if(validate_position(draggableElement, dropzoneElement)){
              remove_drag_eleement(draggableElement, dropzoneElement);

              // align_element(dropzoneElement, draggableElement);
              
          }
          else{

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
    // restrict: {
    //   restriction: "parent",
    //   endOnly: true,
    //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    // },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,

    // вызов ф-и когда опустил элемент
    // onend: function (event) {
    //
    // }
    });
    
    function validate_position(draggable_el, dropzone_el) {
         var nmb_question = draggable_el.getAttribute('data-definition'),
            nmb_dropzone = dropzone_el.getAttribute('data-dropzone');


         if (nmb_question === nmb_dropzone ){
             return true
         }
         return false
    }

    function remove_drag_eleement(draggable_el, dropzone) {
        draggable_el.classList.remove('draggable');
        dropzone.classList.remove('dropzone');
    }
    // function align_element(dropzone, draggable_el) {
    //     var box_dropzone = dropzone.getBoundingClientRect(),
    //         box_draggable_el =  draggable_el.getBoundingClientRect();
    //     var dropzone_coords = {
    //         box: dropzone.getBoundingClientRect(),
    //         coords:{
    //             top: box_dropzone.top,
    //             left: box_dropzone.left
    //         }
    //     };
    //
    //     var draggable_el_coords = {
    //         coords: {
    //             top: box_draggable_el.top,
    //             left: box_draggable_el.left
    //         }
    //     };
    //
    //
    //
    // }
    
    
    
    function dragMoveListener (event) {
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
    // window.dragMoveListener = dragMoveListener;









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

                // test_block()








            },
            error: function () {
                console.log('Error');
            }
        })


    });

});