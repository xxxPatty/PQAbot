# --- flask --- #
from flask import Blueprint, request, jsonify
#from flask_security import logout_user, login_required

# --- our models ---- #
from models import faq_data

faq_api = Blueprint('faq_api', __name__)

# 調整更新週期
@faq_api.route('/adjust_faq_update', methods=['POST'])
def adjust_faq_update():
    data = request.get_json()
    try:
        setting_dict = {
            'data_number':data['num'],
            'update_cycle':data['cycle']
        } 
        faq_data.adjust_update_cycle(setting_dict['data_number'],setting_dict['update_cycle'])
    except Exception as e :
        setting_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
        print("錯誤訊息: ", e)
    return jsonify(setting_dict)

# 查看更新週期
@faq_api.route('/query_faq_update', methods=['POST'])
def query_faq_update():
    try:
        update_data = faq_data.query_update_cycle()
        update_data.pop('_id')
    except Exception as e :
        update_data = {"error" : e.__class__.__name__ + ":" +e.args[0]}
        print("錯誤訊息: ", e)
    return jsonify(update_data)

# 取得FAQ列表
@faq_api.route('/query_faq_list', methods=['POST'])
def query_faq_list():
    data = request.get_json()
    try: 
        list_dict = faq_data.query_list(data['page_size'],data['page_number'],data['option'])
        
    except Exception as e :
        list_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(list_dict)
# 依標籤取得FAQ列表
@faq_api.route('/query_faq_list_by_tag', methods=['POST'])
def query_faq_list_by_tag():
    data = request.get_json()
    try: 
        list_dict = faq_data.query_list_by_tag(data['tag'],data['page_size'],data['page_number'],data['option'])
        
    except Exception as e :
        list_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(list_dict)
# 依字串取得FAQ列表
@faq_api.route('/query_faq_list_by_string', methods=['POST'])
def query_faq_list_by_string():
    data = request.get_json()
    try: 
        list_dict = faq_data.query_list_by_string(data['search_string'],data['page_size'],data['page_number'],data['option'])
        
    except Exception as e :
        list_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(list_dict)
# 新增單篇FAQ
@faq_api.route('/insert_faq_post', methods=['POST'])
def insert_faq_post():
    data = request.get_json()
    try: 
        faq_dict = {
                        "_id" : "",          
                        "link" : "",         
                        "question" : 
                        {
                            "_id" : "",       
                            "title" : data['question']['title'],    
                            "content": data['question']['title'],   
                            "vote" : 0,      
                            "score" : [],
                        },
                        "answers" : 
                        [
                            {       
                                "_id" : "",       
                                "content" : a['content'],
                                "vote" : 0,     
                                "score" : [],
                            } for a in data['answers']
                        ],
                        "keywords" : [],     
                        "tags" : data['tags'],
                        "time" : data['time'],
                        "view_count" : 0
        }
        faq_data.insert_faq(faq_dict)
    except Exception as e :
        faq_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(faq_dict)
    
# 匯入FAQ
@faq_api.route('/import_faq_post', methods=['POST'])
def import_faq_post():
    data = request.get_json()
    try: 
        faq_list = [
            {
                        "_id" : "",          
                        "link" : "",         
                        "question" : 
                        {
                            "id" : "",       
                            "title" : faq['question']['title'],    
                            "content": faq['question']['title'],   
                            "vote" : 0,      
                            "score" : [],
                        },
                        "answers" : 
                        [
                            {       
                                "id" : "",       
                                "content" : a['content'],
                                "vote" : 0,     
                                "score" : [],
                            } for a in faq['answers']
                        ],
                        "keywords" : [],     
                        "tags" : faq['tags'],
                        "time" : faq['time'],
                        "view_count" : 0
            } for faq in data['faq_list']
        ]
        faq_data.insert_faq(faq_list)
    except Exception as e :
        faq_list = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(faq_list)

# 查看單篇FAQ
@faq_api.route('/query_faq_post', methods=['POST'])
def query_faq_post():
    data = request.get_json()
    try: 
        faq_dict = faq_data.query_faq_post(data['_id'])
    except Exception as e :
        faq_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(faq_dict)