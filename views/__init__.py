#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Apr  6 23:30:56 2021

@author: linxiangling
"""

from .exchange_api import exchange_api
from .exchange_web import exchange_web
from .welcome_api import welcome_api
from .base_flow_web import base_flow_web
from .base_flow_rasa_api import base_flow_rasa_api
from .tag_api import tag_api
from .login_api import login_api
from .login_web import login_web

blueprint_prefix = [(exchange_api, ""), (exchange_web, ""), (welcome_api, ""), (base_flow_web, ""), (base_flow_rasa_api, ""), (tag_api, ""),(login_api, ""),(login_web, "")]

def register_blueprint(app):
    for blueprint, prefix in blueprint_prefix:
        app.register_blueprint(blueprint, url_prefix=prefix)
    return app
