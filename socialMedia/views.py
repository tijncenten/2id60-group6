from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.
class indexView(LoginRequiredMixin, TemplateView):
    template_name = 'socialMedia/index.html'
    login_url = '/login'
