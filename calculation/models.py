from django.db import models
from django.core.validators import MinValueValidator


class Original_data(models.Model):
    year = models.IntegerField(default=0, blank=True)
    Cpa = models.FloatField(default=0, blank=True)
    Wa = models.FloatField(default=0.43, blank=True)
    Cpb = models.FloatField(default=0, blank=True)
    Wb = models.FloatField(default=0.3, blank=True)
    Cpc = models.FloatField(default=0, blank=True)
    Wc = models.FloatField(default=0.27, blank=True)
    Market = models.FloatField(default=0, blank=True)


    class Meta:
        ordering = ['year']
        verbose_name = "Данні за конретний рік"
        verbose_name_plural = "Початкові данні"


class Calculated_variants(models.Model):
    variant = models.IntegerField(default=None, validators=[MinValueValidator(1)])
    average_profit_for_cp_a = models.FloatField(default=0)
    average_profit_for_cp_b = models.FloatField(default=0)
    average_profit_for_cp_c = models.FloatField(default=0)
    average_profit_for_portfolio = models.FloatField(default=0)
    sigma_a = models.FloatField(default=0)
    sigma_b = models.FloatField(default=0)
    sigma_c = models.FloatField(default=0)
    sigma_portfolio = models.FloatField(default=0)
    corAB = models.FloatField(default=0)
    corAC = models.FloatField(default=0)
    corBC = models.FloatField(default=0)
    betta_coef_Cpa = models.FloatField(default=0)
    betta_coef_Cpb = models.FloatField(default=0)
    betta_coef_Cpc = models.FloatField(default=0)
    betta_coef_portfolio = models.FloatField(default=0)
    required_profitability_for_active = models.FloatField(default=0)

    class Meta:
        verbose_name = "Розрахований варіант"
        verbose_name_plural = "Розраховані варіанти"



class Additional_data(models.Model):
    upper_bound_for_chart = models.FloatField(default=0.85)
    free_risk_cp = models.FloatField(default=12)


    class Meta:
        verbose_name = "Данні"
        verbose_name_plural = "Додаткові данні"
