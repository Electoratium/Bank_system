from django import forms
from .models import *


class variant_form(forms.ModelForm):

    class Meta:
        model = Calculated_variants
        fields = ["variant"]