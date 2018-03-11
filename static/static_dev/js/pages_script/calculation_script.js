"use strict";

$(document).ready(function(){
    var form = $('#form_variant');

    form.on('submit',function (event) {
        event.preventDefault();

        document.querySelector('.calculation_container').classList.remove('remove_content');

        //element[0] -  csrf token
        var variant = this.elements[1].value;
        var coef;
        if(variant < 10){
            coef = parseFloat('1.0' + variant);
        }
        else{
            coef = parseFloat("1." + variant);
        }
        var csrf_token = $('#form_variant [name="csrfmiddlewaretoken"]').val();
        var url = form.attr("action");

        var data = {};

        data["csrfmiddlewaretoken"] = csrf_token;
        data["variant"] = variant;
        data["coef"] = coef;

        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            cache: true,
            success:function (data) {
                var entry_data = data.entry_data_table;
                var free_risk_cp = data.free_risk_cp;
                var average_rate_for_cp = data.average_rate_for_cp;
                var average_rate_income = data.average_rate_income;
                var average_rage_portf = data.average_rate_portfolio;
                var sigma_lists = data.border_sigma;
                var correlation_data = data.corelation_data;
                var betta_coef = data.betta_coeficients;
                var market = data.market_list;
                var average_market = (data.avrg_market).toFixed(2);
                var res_capm = data.required_profitability_for_portf;

                // Show hamburger-menu and hide form
                var burger = $('#burger');
                var menu = $('#menu');
                var hidden_container = $('.visib-cont');
                var calculation_container = $('.calculation_container');

                //show nav menu on devices
                var menu_container = document.getElementById('phone-nav-menu');
                if(getComputedStyle(menu_container).display == 'flex'){
                    var browser_height = document.documentElement.clientHeight;
                    document.addEventListener('scroll', function () {
                      if(window.pageYOffset > browser_height){
                          menu_container.classList.add('show_content_menu');
                      }
                      else{
                          menu_container.classList.remove('show_content_menu');
                      }
                    })

                }

                calculation_container.addClass('show_content');

                //remove error msg if they is
                $('error').removeClass('show_error');

                burger.addClass('showing_animation');

                burger.click(toggle_menu);
                hidden_container.click(toggle_menu);
                menu.click(toggle_menu);

                function toggle_menu() {
                    menu.toggleClass('show_menu');
                    hidden_container.toggleClass('transparent-content');
                }


                //add element which move to top page
                // #back-to-top
                var arrow = $('#back-to-top');

                arrow.click(function (e) {
                    event.preventDefault();
                    window.scrollTo(0,0);
                    arrow.removeClass('show_arrow');
                });

                window.onscroll = function () {
                    var scrolled = window.pageYOffset;
                    var height_window = $(window).height();
                    if(scrolled > height_window + 40){
                        arrow.addClass('show_arrow');
                    }
                    else{
                        arrow.removeClass('show_arrow');
                    }
                };


                // adding data to html from server
                // find all columns in tables and put to array

                var initial_tables_column = append_column_to_arr('.column-cp-a', '.column-cp-b', '.column-cp-c', '.column-market');

                function append_column_to_arr(...column_classes) {
                    var arr = [];
                    for(var class_name of column_classes){
                        let column = $(class_name);
                        arr.push(column);

                    }
                    return arr;
                }

                //add data into columns
                update_data(initial_tables_column, entry_data);

                function update_data(columns_table, values_table){

                    var iterator = 0;
                    for(var values_list of values_table){


                        for(var i = 0; i < columns_table.length; i++){
                            columns_table[i][iterator].innerHTML = values_list[i];
                        }
                        iterator++;
                    }
                }

                //add  data into condition
                $('#free-risk-sp')[0].innerHTML = (free_risk_cp + '%');


                //add data to defining avarage value income for cp

                // to equation
                var html_element_equation_aver_cp = append_column_to_arr('.aver_rate_inc_a','.aver_rate_inc_b','.aver_rate_inc_c');
                var aver_rate_cp_a = get_aver_data_from_cp(0, average_rate_for_cp[0]);
                var aver_rate_cp_b = get_aver_data_from_cp(1,average_rate_for_cp[1]);
                var aver_rate_cp_c = get_aver_data_from_cp(2, average_rate_for_cp[2]);
                var aver_equation_res = [aver_rate_cp_a,aver_rate_cp_b,aver_rate_cp_c];

                $('.average_rate_portf')[0].innerHTML = "<span class='average'>K<sub>p</sub></span>: " + average_rage_portf;

                function get_aver_data_from_cp(position_cp, res) {
                    var result_string = "(";
                   for(var list_val of entry_data){
                        var value = list_val[position_cp];
                            if(value > 0){
                                result_string += ' + ' + value;
                            }
                            else{
                                result_string += value + " ";
                            }
                   }
                   return result_string += ') / 5 = '+ res;

                }

                //add data to equation
                for(var p = 0; p < aver_equation_res.length;p++){

                    html_element_equation_aver_cp[p][0].innerHTML = aver_equation_res[p];

                }

                //add data to table
                var initial_tables_column = append_column_to_arr('.col-cp-a', '.col-cp-b', '.col-cp-c');

                update_data(initial_tables_column, entry_data);

                //add data to the last column table
                var last_column_tables = $('.realize_rate_income');
                for(var i = 0; i < average_rate_income.length; i++){
                    last_column_tables[i].innerHTML = average_rate_income[i];
                }

                //add data to calculation example sigma
                var html_element_calc_sigma = $('.calculation_sigma_example');

                //create list which consist width cp_a
                var list_cp_a = [];
                for(var cp of entry_data){
                    list_cp_a.push(cp[0]);
                }

                //create calculation sigma string which will be insert in html
                var calculation_sigma = "<span>&radic;</span>(";
                for(var value of list_cp_a){
                    calculation_sigma += "(" + value + " + " + average_rate_for_cp[0] + ')<sup>2</sup>';
                    if(value != list_cp_a[list_cp_a.length-1]){
                        calculation_sigma += ' + '
                    }
                }
                calculation_sigma += ")/5-1 = " + sigma_lists[0][0];

                //insert into html
                html_element_calc_sigma[0].innerHTML = calculation_sigma;



                //add data to calculated sigma

                var html_results_calc_sigma = $('.calculated_sigma');


                // [i + 1] because we calculated sigma a in example
                for(var i = 0; i< html_results_calc_sigma.length; i++){

                    html_results_calc_sigma[i].innerHTML = sigma_lists[i + 1][0];
                }
                //add data to table border sigma

                var html_left_border_sigma = $('.left_border_sigma');
                var html_right_border_sigma = $('.right_border_sigma');


                //copy array
                var average_rate_all = average_rate_for_cp.slice();
                //add new value in new arr
                average_rate_all.push(average_rage_portf);


                function get_some_border_sigma(side) {
                    var index, multiplier;
                    var result_border = [];
                    if(side == 'left'){
                        index = 1;
                        multiplier = -3
                    }
                    else{
                        index = 2;
                        multiplier = 3;
                    }
                    for(var i = 0; i < sigma_lists.length;i++){
                        result_border.push(multiplier + " * " + sigma_lists[i][0] + " + " + average_rate_all[i] + " = " + sigma_lists[i][index]);
                    }
                    return result_border;
                }

                var left_border_sigma = get_some_border_sigma('left');
                var right_border_sigma = get_some_border_sigma('right');

                // put new data into html
                for(var i = 0; i < html_left_border_sigma.length; i++){
                    //left culumn table
                    html_left_border_sigma[i].innerHTML = left_border_sigma[i];
                    //right column table
                    html_right_border_sigma[i].innerHTML = right_border_sigma[i];
                }

                //creating list which contains axis Y for all lines (top value is storage in database)

                var upper_bound = data.upper_bound_for_chart;
                var sigma_arr = [];
                //put in sigma arr just sigma cp_a - portf.
                sigma_lists.filter(x => sigma_arr.push(x[0]));

                var minimum_val_sigma = Math.min(...sigma_arr);

                var y_axis = [];
                for(var sigma_value of sigma_arr) {
                    y_axis.push(upper_bound * (minimum_val_sigma / sigma_value));
                }


                //create chart
                var chart = new Chartist.Line('.ct-chart-line', {
                  series: [{
                    name: 'ЦП a',
                    className: 'cp_a',
                    data: [
                      {x: sigma_lists[0][1], y: 0},
                      {x: average_rate_all[0], y: y_axis[0]},
                      {x: sigma_lists[0][2], y: 0}
                    ]
                  },
                  {
                    name: 'ЦП б',
                    className: 'cp_b',
                    data: [
                      {x: sigma_lists[1][1], y: 0},
                      {x: average_rate_all[1], y: y_axis[1]},
                      {x: sigma_lists[1][2], y: 0}
                    ]
                  },
                  {
                    name: 'ЦП ц',
                    className: 'cp_c',
                    data: [
                      {x: sigma_lists[2][1], y: 0},
                      {x: average_rate_all[2], y: y_axis[2]},
                      {x: sigma_lists[2][2], y: 0}
                    ]
                  },
                  {
                    name: "Портфель",
                    className: 'portfolio',
                    data: [
                      {x: sigma_lists[3][1], y: 0},
                      {x: average_rate_all[3], y: y_axis[3]},
                      {x: sigma_lists[3][2], y: 0}
                    ]
                  }
                ]
                }, {
                  showArea: true,
                  low: 0,
                  high: 1,
                  fullWidth: true,
                  axisX: {
                    showGrid: false,
                    type: Chartist.AutoScaleAxis,
                    onlyInteger: true,
                    scaleMinSpace: 30,
                  },
                  axisY: {
                    scaleMinSpace: 40
                  },
                  chartPadding: {
                        right: 40
                  },
                  plugins: [
                      Chartist.plugins.legend({
                      })
                  ]
                });

                // animation chart
                chart.on('draw', function(data) {
                  if(data.type === 'line' || data.type === 'area') {
                    data.element.animate({
                      d: {
                        begin: 1500 * data.index,
                        dur: 1500,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                      }
                    });
                  }
                });


                //update data into correlation table

                //for CP A & CP B

                update_correlation_table('.table-cpa-cpb .cor-cpa', '.table-cpa-cpb .cor-cpb', 0, 1, 'cpa_cpb',
                    '.table-cpa-cpb .cor-cpa-cpb', '.table-cpa-cpb .cor-cpa-square', '.table-cpa-cpb .cor-cpb-square',
                    '.table-cpa-cpb .sum', '.table-cpa-cpb .avrg');

                //for CP A & CP C
                update_correlation_table('.table-cpa-cpc .cor-cpa', '.table-cpa-cpc .cor-cpc', 0, 2, 'cpa_cpc',
                    '.table-cpa-cpc .cor-cpa-cpc', '.table-cpa-cpc .cor-cpa-square', '.table-cpa-cpc .cor-cpc-square',
                    '.table-cpa-cpc .sum', '.table-cpa-cpc .avrg');

                //for CP B & CP C
                update_correlation_table('.table-cpb-cpc .cor-cpb', '.table-cpb-cpc .cor-cpc', 1, 2, 'cpb_cpc',
                    '.table-cpb-cpc .cor-cpb-cpc', '.table-cpb-cpc .cor-cpb-square', '.table-cpb-cpc .cor-cpc-square',
                    '.table-cpb-cpc .sum', '.table-cpb-cpc .avrg');



                function update_correlation_table(class_cp_x, class_cp_y, cp_x_index, cp_y_index, correlation_cp, class_xy, class_x_sq, class_y_sq, class_sum, class_avrg){
                    var html_col_cpx = $(class_cp_x);
                    var html_col_cpy = $(class_cp_y);
                    var cp_x_values = [];
                    var cp_y_values = [];


                    for(var cp_list of entry_data){
                        cp_x_values.push(cp_list[cp_x_index]);
                        cp_y_values.push(cp_list[cp_y_index]);
                    }


                    //add initial data X and Y in table

                    for(var year = 0; year < html_col_cpx.length;year++){
                        html_col_cpx[year].innerHTML = cp_x_values[year];
                        html_col_cpy[year].innerHTML = cp_y_values[year];
                    }

                    // update xy x(2) y2
                    var html_col_xy = $(class_xy);
                    var html_col_x_sq = $(class_x_sq);
                    var html_col_y_sq = $(class_y_sq);
                    var arr_xy_square = [html_col_xy, html_col_x_sq, html_col_y_sq];

                    var corelation_res = correlation_data[correlation_cp];



                    var count_for_label = 0;
                    for(var key of ['xy', 'x_square', 'y_square']){


                        for(var i = 0; i < corelation_res[key].length;i++){

                            arr_xy_square[count_for_label][i].innerHTML = corelation_res[key][i];
                        }
                        count_for_label++;
                    }

                    //update sum and average
                    var html_col_sum = $(class_sum);
                    var html_col_avrg = $(class_avrg);



                    var sum_results = corelation_res['sum_val'];
                    var average_results = corelation_res['avrg_val'];

                    for(var iterator = 0; iterator < sum_results.length; iterator++){
                        html_col_sum[iterator].innerHTML = sum_results[iterator];
                        html_col_avrg[iterator].innerHTML = average_results[iterator];
                    }




                }

                //insert calculated correlation
                var cpa_cpb_avrg_data = correlation_data['cpa_cpb']['avrg_val'];

                var resolved_equation = '(' + cpa_cpb_avrg_data[2] + ' - ' + cpa_cpb_avrg_data[0] + ' * ' +
                +  cpa_cpb_avrg_data[1] + ') / ' + '<span>&radic;</span>( ' + cpa_cpb_avrg_data[3] + ' - ' +
                + cpa_cpb_avrg_data[0] + ' * ' + cpa_cpb_avrg_data[0] + ') * (' + cpa_cpb_avrg_data[4] + ' - ' +
                + cpa_cpb_avrg_data[1] + " * " + cpa_cpb_avrg_data[1] + ")" + " = " + correlation_data['cpa_cpb']['correlation'];


                $('.corAB')[0].innerHTML = resolved_equation;
                $('.corAC')[0].innerHTML = correlation_data['cpa_cpb']['correlation'];
                $('.corBC')[0].innerHTML = correlation_data['cpb_cpc']['correlation'];


                //insert data equation average income portfolio

                // var market_income
                $('.avrg_income_portfolio')[0].innerHTML = "<span class='average'>k<sub>m</sub></span> = (" + market[0] + " + " + market[1] + " + " + market[3] + " + " +
                    + market[4] + ") / 5 =" + average_market;


                //betta coeficient calulation

                var top_part_equation = "((" + market[0] + " - " + average_market + ") * (" +
                    entry_data[0][0] + " - " + cpa_cpb_avrg_data[0] + ") +  (" +
                     + market[1] + " - " + average_market + ") * (" +
                    entry_data[1][0] + " - " + cpa_cpb_avrg_data[0] + ") +  (" +
                     + market[2] + " - " + average_market + ") * (" +
                    entry_data[2][0] + " - " + cpa_cpb_avrg_data[0] + ") +  (" +
                     + market[3] + " - " + average_market + ") * (" +
                    entry_data[3][0] + " - " + cpa_cpb_avrg_data[0] + "))";



                var bottom_part_equation = "(( " + market[0] + " - " + average_market + ")<sup>2</sup>" + " + " +
                    "( " + market[1] + " - " + average_market + ")<sup>2</sup>" + " + " +
                    "( " + market[2] + " - " + average_market + ")<sup>2</sup>" + " + " +
                    "( " + market[3] + " - " + average_market + ")<sup>2</sup>" + " + " +
                    "( " + market[4] + " - " + average_market + ")<sup>2</sup>" + ")";

                $('.betta_a')[0].innerHTML = "<span><span>&beta;<sub>a</sub></span>" + " = " + top_part_equation + " / " + bottom_part_equation+ " = " + betta_coef[0] + "</span>";



                $('.betta_b')[0].innerHTML = 'B<sub>б</sub> = ' + betta_coef[1];
                $('.betta_c')[0].innerHTML = 'B<sub>c</sub> = ' + betta_coef[2];

                $('.betta_portfolio')[0].innerHTML = 'B<sub>portf.</sub> = ' + betta_coef[0] + ' * 0,43 + ' + betta_coef[1] +
                    ' * 0,3 + ' + betta_coef[2] + ' * 0,27 = ' + betta_coef[3];

                //add data to calultate CAPM
                var capm_equation = "<span>k<sub>t</sub></span>" + " = " + free_risk_cp + " + (" + average_market + " - "
                    + free_risk_cp + ")" + " * " + betta_coef[3] + " = " + res_capm + "%";

                $('.capm')[0].innerHTML = capm_equation;
            },
            error: function () {
                $('error').addClass('show_error');
            }
        })

    });

});