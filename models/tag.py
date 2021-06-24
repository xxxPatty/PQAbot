#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 23 21:52:20 2021

@author: linxiangling
"""
from . import _db

#新增 empty tag
def insert_tag(tag_name):
    data=_db.TAG_COLLECTION.find()
    if data.count() != 0:
        tag_id=str(int(data.sort('_id', -1)[0]['_id'])+1).zfill(5)
    else:
        tag_id='00000'
    tag_dict = {'_id':tag_id, 'tag':tag_name, 'child':[], 'associated':[], 'usage_counter':0, 'recent_use':''}
    _db.TAG_COLLECTION.insert_one(tag_dict)
    return tag_id
    
#新增 child tag
def add_child_tag(parent_id, child_id):
    _db.TAG_COLLECTION.update({'_id':parent_id}, {'$push':{'child':child_id}})
    
#新增 associated tag
def add_child_associated(parent_id, associated_id):
    _db.TAG_COLLECTION.update({'_id':parent_id}, {'$push':{'associated':associated_id}})
    
#查詢 tag
def query_tag(tag_id):
    return _db.TAG_COLLECTION.find_one({'_id':tag_id})



