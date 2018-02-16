from django.shortcuts import render
from django.http import JsonResponse
from .forms import *
from .models import *
from math import pow, sqrt


def calculation(request):
    form = variant_form(request.POST or None)

    return render(request, 'pages/calculation.html', locals())


def complete_calculate(request):
    post = request.POST
    print(post)
    variant = post["variant"]
    multiplier = post['coef']
    free_risk_cp = list(Additional_data.objects.all().values_list('free_risk_cp'))[0][0]
    upper_bound_for_chart = list(Additional_data.objects.all().values_list('upper_bound_for_chart'))[0][0]
    response = {}

    if ((Calculated_variants.objects.filter(variant = variant))):
        calculated_data = [[], [], [], [], []]
        average_rate_income = []
        cpa = []
        cpb = []
        cpc = []
        weights = []
        list_sigma_a = []
        list_sigma_b = []
        list_sigma_c = []
        list_sigma_portfolio = []



        calculated_result = Calculated_variants.objects.filter(variant = variant).values_list()[0]

        average_cp_list = [calculated_result[2], calculated_result[3], calculated_result[4]]
        average_rate_portfolio = calculated_result[5]

        list_sigma = [calculated_result[6], calculated_result[7], calculated_result[8], calculated_result[9]]

        # sigma, -3sigma , +3sigma
        list_sigma_a = [list_sigma[0], round(((-3 * list_sigma[0]) + average_cp_list[0]), 2),
                        round((3 * list_sigma[0] + average_cp_list[0]), 2)]

        list_sigma_b = [list_sigma[1], round(((-3 * list_sigma[1]) + average_cp_list[1]), 2),
                        round((3 * list_sigma[1] + average_cp_list[1]), 2)]

        list_sigma_c = [list_sigma[2], round(((-3 * list_sigma[2]) + average_cp_list[2]), 2),
                        round((3 * list_sigma[2] + average_cp_list[2]), 2)]

        list_sigma_portfolio = [list_sigma[3], round(((-3 * list_sigma[3]) + average_rate_portfolio), 2),
                                round((3 * list_sigma[3] + average_rate_portfolio), 2)]


        betta_coef = [calculated_result[13], calculated_result[14], calculated_result[15], calculated_result[16]]

        # first element is Id
        i = 0
        entry_data = Original_data.objects.values_list()
        for year_data in entry_data:
            for item in range(2, 10, 2):
                calculated_data[i].append(round(year_data[item] * float(multiplier), 2))
            i += 1

        for row in range(5):
            counter = 0
            sum_cp = 0
            for i in range(3, 8, 2):
                sum_cp += calculated_data[row][counter] * entry_data[row][i]
                counter += 1
            average_rate_income.append(round(sum_cp, 2))


        # adding weight for betta coeficient portfolio

        for item in range(3, 8, 2):
            weights.append(entry_data[0][item])

        for securities in calculated_data:
            cpa.append(securities[0])
            cpb.append(securities[1])
            cpc.append(securities[2])

        # Calculation correlation

        corelation_data = {
            'cpa_cpb': {'xy': [], 'sum_val': [], 'avrg_val': [], 'x_square': [], 'y_square': [], 'correlation': []},
            'cpa_cpc': {'xy': [], 'sum_val': [], 'avrg_val': [], 'x_square': [], 'y_square': [], 'correlation': []},
            'cpb_cpc': {'xy': [], 'sum_val': [], 'avrg_val': [], 'x_square': [], 'y_square': [], 'correlation': []}
        }

        def get_correlation_data(pos_x, pos_y, name_cp):

            list_cp = [[], [], [], [], []]
            years = 0

            for row in calculated_data:
                list_cp[years].append(row[pos_x])
                list_cp[years].append(row[pos_y])
                years += 1

            counter = 0
            x_sum = 0
            y_sum = 0
            result = []
            xy = []
            x_square = []
            y_square = []
            total = []
            avrg = []
            correlation_res = 0

            # get average cpx or cpy
            for row in list_cp:
                x_sum += row[0]
                y_sum += row[1]

            x_avrg = round(x_sum / 5, 2)
            y_avrg = round(y_sum / 5, 2)

            for rows in list_cp:
                xy.append(round((rows[0] * rows[1]), 2))
                x_square.append(round(pow(rows[0], 2), 2))
                y_square.append(round(pow(rows[1], 2), 2))

            total.extend([round(sum(xy), 2), round(sum(x_square), 2), round(sum(y_square), 2)])

            # average values total
            for x in total:
                avrg.append(round(x / 5, 2))

            correlation_res = (avrg[0] - x_avrg * y_avrg) / sqrt((avrg[1] - x_avrg * x_avrg)*(avrg[2] - y_avrg * y_avrg))

            # add sum and average x and y
            total.insert(0, round(x_sum, 2))
            total.insert(1, round(y_sum, 2))
            avrg.insert(0, x_avrg)
            avrg.insert(1, y_avrg)

            result.extend([xy, total, avrg, x_square, y_square,round(correlation_res, 2)])

            for item in corelation_data[name_cp]:
                corelation_data[name_cp][item] = result[counter]
                counter += 1

        get_correlation_data(0, 1, 'cpa_cpb')
        get_correlation_data(0, 2, 'cpa_cpc')
        get_correlation_data(1, 2, 'cpb_cpc')

        market_list = [calculated_data[0][3], calculated_data[1][3], calculated_data[2][3], calculated_data[3][3],
                       calculated_data[4][3]]
        average_market = sum(market_list) / 5

        required_profitability = round(free_risk_cp + (average_market - free_risk_cp) * betta_coef[3], 2)

        list_border_sigma = [list_sigma_a, list_sigma_b, list_sigma_c, list_sigma_portfolio]

        response = {'entry_data_table': calculated_data,
                    'average_rate_for_cp': average_cp_list,
                    'average_rate_income': average_rate_income,
                    'average_rate_portfolio': average_rate_portfolio,
                    'border_sigma': list_border_sigma,
                    'upper_bound_for_chart': upper_bound_for_chart,
                    'corelation_data': corelation_data,
                    'market_list': market_list,
                    'avrg_market': average_market,
                    'betta_coeficients': betta_coef,
                    'required_profitability_for_portf': required_profitability,
                    'free_risk_cp': free_risk_cp
                    }

    else:
        calculated_data = [[], [], [], [], []]
        average_cp_list = []
        average_rate_income = []
        i = 0
        cpa = []
        cpb = []
        cpc = []
        weights = []
        # first element is Id
        entry_data = Original_data.objects.values_list()

        # adding weight for betta coefficient portfolio
        for item in range(3, 8, 2):
            weights.append(entry_data[0][item])

        for year_data in entry_data:

            for item in range(2, 10, 2):
                calculated_data[i].append(round(year_data[item] * float(multiplier), 2))
            i += 1
        for securities in calculated_data:
            cpa.append(securities[0])
            cpb.append(securities[1])
            cpc.append(securities[2])

        average_cp_list.extend([round(sum(cpa) / 5, 2), round(sum(cpb) / 5, 2), round(sum(cpc) / 5, 2)])

        for row in range(5):
            counter = 0
            sum_cp = 0
            for i in range(3, 8, 2):
                sum_cp += calculated_data[row][counter] * entry_data[row][i]
                counter += 1
            average_rate_income.append(round(sum_cp, 2))

        average_rate_portfolio = round((sum(average_rate_income) / 5), 2)



        def calc_sigma(list_val, aver_cp):
            def get_result(x):
                return pow(x - aver_cp, 2)

            part_top = sum(map(get_result, list_val))
            return round(sqrt(part_top / 4), 2)

        sigma_a = calc_sigma(cpa, average_cp_list[0])
        sigma_b = calc_sigma(cpb, average_cp_list[1])
        sigma_c = calc_sigma(cpc, average_cp_list[2])
        sigma_portfolio = calc_sigma(average_rate_income, average_rate_portfolio)

        # sigma, -3sigma , +3sigma
        list_sigma_a = [sigma_a, round(((-3 * sigma_a) + average_cp_list[0]), 2),
                        round((3 * sigma_a + average_cp_list[0]), 2)]

        list_sigma_b = [sigma_b, round(((-3 * sigma_b) + average_cp_list[1]), 2),
                        round((3 * sigma_b + average_cp_list[1]), 2)]

        list_sigma_c = [sigma_c, round(((-3 * sigma_c) + average_cp_list[2]), 2),
                        round((3 * sigma_c + average_cp_list[2]), 2)]

        list_sigma_portfolio = [sigma_portfolio, round(((-3 * sigma_portfolio) + average_rate_portfolio), 2),
                                round((3 * sigma_portfolio + average_rate_portfolio), 2)]

        # Calculation correlation

        corelation_data = {
            'cpa_cpb': {'xy': [], 'sum_val': [], 'avrg_val': [], 'x_square': [], 'y_square': [], 'correlation': []},
            'cpa_cpc': {'xy': [], 'sum_val': [], 'avrg_val': [], 'x_square': [], 'y_square': [], 'correlation': []},
            'cpb_cpc': {'xy': [], 'sum_val': [], 'avrg_val': [], 'x_square': [], 'y_square': [], 'correlation': []}
        }

        def get_correlation_data(pos_x, pos_y, name_cp):

            list_cp = [[], [], [], [], []]
            years = 0

            for row in calculated_data:
                list_cp[years].append(row[pos_x])
                list_cp[years].append(row[pos_y])
                years += 1

            counter = 0
            x_sum = 0
            y_sum = 0
            result = []
            xy = []
            x_square = []
            y_square = []
            total = []
            avrg = []
            correlation_res = 0




            # get average cpx or cpy
            for row in list_cp:
                x_sum += row[0]
                y_sum += row[1]


            x_avrg = round(x_sum / 5, 2)
            y_avrg = round(y_sum / 5, 2)

            for rows in list_cp:

                xy.append(round((rows[0] * rows[1]), 2))
                x_square.append(round(pow(rows[0], 2), 2))
                y_square.append(round(pow(rows[1], 2), 2))


            total.extend([round(sum(xy), 2), round(sum(x_square), 2), round(sum(y_square), 2)])

            # average values total
            for x in total:
                avrg.append(round(x / 5, 2))

            correlation_res = (avrg[0] - x_avrg * y_avrg) / sqrt(
                (avrg[1] - x_avrg * x_avrg) * (avrg[2] - y_avrg * y_avrg))

            # add sum and average x and y
            total.insert(0, round(x_sum, 2))
            total.insert(1, round(y_sum, 2))
            avrg.insert(0, x_avrg)
            avrg.insert(1, y_avrg)

            result.extend([xy, total, avrg, x_square, y_square, round(correlation_res, 2)])

            for item in corelation_data[name_cp]:
                corelation_data[name_cp][item] = result[counter]
                counter += 1

        get_correlation_data(0, 1, 'cpa_cpb')
        get_correlation_data(0, 2, 'cpa_cpc')
        get_correlation_data(1, 2, 'cpb_cpc')

        # data for betta_coef
        market_list = [calculated_data[0][3], calculated_data[1][3], calculated_data[2][3], calculated_data[3][3],
                       calculated_data[4][3]]
        average_market = sum(market_list) / 5


        def get_coef_betta(cp_index):
            left_part = []
            right_part = []
            top_part = 0
            bottom_part = 0
            for i in market_list:
                left_part.append(i - average_market)
                bottom_part += pow((i - average_market), 2)

            for cp in calculated_data:
                right_part.append(cp[cp_index] - average_cp_list[cp_index])

            for p in range(5):
                top_part += left_part[p] * right_part[p]

            return top_part / bottom_part

        betta_coef_a = round(get_coef_betta(0), 2)
        betta_coef_b = round(get_coef_betta(1), 2)
        betta_coef_c = round(get_coef_betta(2),2)
        betta_coef_portf = round(betta_coef_a * weights[0] + betta_coef_b * weights[1] + betta_coef_c * weights[2],2)


        required_profitability = round(free_risk_cp + (average_market - free_risk_cp) * betta_coef_portf, 2)

        # update database new data

        Calculated_variants.objects.create(variant = variant, average_profit_for_cp_a = average_cp_list[0],
                                           average_profit_for_cp_b = average_cp_list[1],
                                           average_profit_for_cp_c = average_cp_list[2],
                                           average_profit_for_portfolio=average_rate_portfolio,
                                           sigma_a = sigma_a, sigma_b=sigma_b,
                                           sigma_c = sigma_c, sigma_portfolio=sigma_portfolio,
                                           corAB = corelation_data["cpa_cpb"]['correlation'],
                                           corAC = corelation_data["cpa_cpc"]['correlation'],
                                           corBC = corelation_data["cpb_cpc"]['correlation'],
                                           betta_coef_Cpa = betta_coef_a,
                                           betta_coef_Cpb = betta_coef_b,
                                           betta_coef_Cpc = betta_coef_c,
                                           betta_coef_portfolio = betta_coef_portf,
                                           required_profitability_for_active = required_profitability
                                           )



        # extend average sigma(-3sigma + sigma)) for diagram
        list_border_sigma = [list_sigma_a, list_sigma_b, list_sigma_c, list_sigma_portfolio]

        betta_coef = [betta_coef_a, betta_coef_b, betta_coef_c, betta_coef_portf]

        response = {'entry_data_table': calculated_data,
                    'average_rate_for_cp': average_cp_list,
                    'average_rate_income': average_rate_income,
                    'average_rate_portfolio': average_rate_portfolio,
                    'border_sigma': list_border_sigma,
                    'upper_bound_for_chart': upper_bound_for_chart,
                    'corelation_data': corelation_data,
                    'market_list': market_list,
                    'avrg_market': average_market,
                    'betta_coeficients': betta_coef,
                    'required_profitability_for_portf': required_profitability,
                    'free_risk_cp': free_risk_cp
                    }


    return JsonResponse(response)
