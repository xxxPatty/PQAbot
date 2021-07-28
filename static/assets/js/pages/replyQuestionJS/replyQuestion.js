function save(){
    var myURL, data;
    var postId = localStorage.getItem("singlePostId");
    var postOwnerId;
    var replierId = localStorage.getItem("sessionID");
    var replierName = localStorage.getItem("userName");
    var response = $("#response").val();
    
    //true->匿名, false->不是匿名
    var anonymous = document.getElementById('anonymous').checked;
    
    // 時間
    var time = new Date().toJSON();
    time = time.slice(0, 23);
    
    myURL = head_url + "query_inner_post";
    data = {_id: postId};
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log(response);
            postOwnerId = response.asker_id;
            
        },
        error: function(response){
            console.log("error:");
            console.log(response);
        }
    });
    
    //----- 為了處理通知 更新資料庫 -----//
    myURL = head_url + "add_post_notification?user_id="+postOwnerId"&replier_name="+replierName+"&post_id="+postId;
    console.log("myURL: "+myURL);
//    $.ajax({
//        url: myURL,
//        type: "GET",
//        async: false,
//        dataType: "json",
//        contentType: 'application/json; charset=utf-8',
//        success: function(response){
//            console.log("成功: 新增貼文通知（add_post_notification）");
////            setPage('mySinglePostFrame');
//        },
//        error: function(response){
//            console.log("失敗: 新增貼文通知（add_post_notification）");
//            console.log(response);
////            window.alert("回覆貼文 失敗！\n請再試一次");
//        }
//    });
    
    //----- 回覆貼文 -----//
    var data = {post_id: postId, replier_id: replierId, replier_name: replierName, response: response, time: time, incognito: anonymous};
//    console.log("傳出去的data資料");
//    console.log(data);
    myURL = head_url + "insert_inner_post_response";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 回覆貼文（insert_inner_post_response）");
            setPage('mySinglePostFrame');
        },
        error: function(response){
//            console.log("失敗: 回覆貼文（insert_inner_post_response）");
//            console.log(response);
            window.alert("回覆貼文 失敗！\n請再試一次");
        }
    });
    
    
}