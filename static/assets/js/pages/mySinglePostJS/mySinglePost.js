//function setPage(id, page){
//    console.log("id: "+id);
//    console.log("page: "+page);
//    localStorage.setItem("single_post_id", id);
//    localStorage.setItem("page", page);
//}

function setLocalStorage(id){
    localStorage.setItem("replyId", id);
    setPage('editReplyFrame');
}

/////////////// 對貼文或回覆按讚、倒讚 START ///////////////
function thumbs(score, replyId, targetUserId){
    var postId = localStorage.getItem("singlePostId");
    var userId = localStorage.getItem("sessionID");
    var data = {post_id: postId, response_id: replyId, user: userId, target_user: targetUserId};
    console.log(data);
    var myURL;
    
    if(score == 1){
        myURL = head_url + "like_inner_post";
    }
    else{
        myURL = head_url + "dislike_inner_post";
    }
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 對貼文/回覆評分（like_inner_post/dislike_inner_post）");
            setPage('mySinglePostFrame');
        },
        error: function(response){
            console.log("失敗: 對貼文/回覆評分（like_inner_post/dislike_inner_post）");
            console.log(response);
        }
    });
}
/////////////// 對貼文或回覆按讚、倒讚 END ///////////////

var pageNumber = 1;
function start(){
    
    var userId = localStorage.getItem("sessionID");
    
    var myURL = head_url + "query_inner_post";
    var singlePostId = localStorage.getItem("singlePostId");
    var data = {"_id": singlePostId};
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿單篇貼文（query_inner_post）");
            console.log(response);
            
            content += '<h5>問題</h5>';
            if(response.asker_id == localStorage.getItem("sessionID")){
                content += '<button type="button" class="scoreBtn" onclick="setPage(';
                content += "'editPostFrame'";
                content += ')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';                        
            }
            document.getElementById("header").innerHTML = content;
            
            var id = response._id;
            var title = response.title;
            var question = response.question;
            var tag = response.tag;
            var time = new Date(response.time);
            time = time.toISOString();
            time = time.slice(0, 10);
            var score = 0;
            for(var i=0; i<score.length; i++){
                score += score[i].score;
            }
            
            
            content = "";
            content += '<div class="badge-box">';
                content += '<div class="sub-title">';
                    content += '<span>貼文 #';
                    content += id;
                    content += '</span>';
                
                    content += '<span style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                    content += score;
                    content += '</span>';
                content += '</div>';
                
                content += '<div>';
                    content += '<span><h5>';
                    content += title;
                    content += '</h5></span>';
            
                content += '<div>';
                    content += '<span>';
                    question = question.replaceAll('\n', '<br>');
                    console.log("question: "+question);
                    content += question;
                    content += '</span>';
                content += '</div>';
                
                content += '<div style="margin-top: 20px;">';
                for(var i=0; i<tag.length; i++){
                    content += '<label class="badge badge-default purpleLabel">';
                        content += tag[i].tag_name;
                    content += '</label>';
                }
                content += '</div>';
                
                content += '<div>';
                    content += '<label class="badge purpleLabel2">';
                    content += time;
                    content += '</label>';
                    
                    content += '<div style="float:right;">';
                        content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                        content += "'1', '', '";
                        content += response.asker_id;
                        content += "')";
                        content += '">';
            
                        // 檢查有沒有按讚
                        var temp = {score: 1, user_id: userId};
                        console.log(temp);
                        if(response.score.includes(temp)){
                            content += '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
                        }
                        else{
                            content += '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
                        }
                        
                        content += '</button>';

                        content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                        content += "'-1', '', '";
                        content += response.asker_id;
                        content += "')";
                        content += '">';
            
                        // 檢查有沒有按倒讚
                        var temp = {score: -1, user_id: userId};
                        if(response.score.includes(temp)){
                            content += '<i class="fa fa-thumbs-down" aria-hidden="true"></i>';
                        }
                        else{
                            content += '<i class="fa fa-thumbs-o-down" aria-hidden="true"></i>';
                        }
                        
                        content += '</button>';
                    content += '</div>';
                content += '</div>';
            content += '</div>';
            
            document.getElementById("question").innerHTML = content;
            
            content = "";
            response.answer.sort(function(a, b){
                return a.time < b.time ? 1 : -1;
            });
            
            for(var i=0; i<response.answer.length; i++){
                var score = 0;
                for(var j=0; j<response.answer[i].score.length; j++){
                    score += response.answer[i].score[j].score;
                }
                content += '<div class="col-12">';
                    content += '<div class="badge-box">';
                        content += '<div class="sub-title">';
                            content += '<span>';
                                if(response.answer[i].incognito == true){
                                    content += "匿名";
                                }
                                else{
                                    content += response.answer[i].replier_name;
                                }
                            content += '</span>';
                
                            if(response.answer[i].replier_id == localStorage.getItem("sessionID")){
                            content += '<button type="button" class="scoreBtn" onclick="setLocalStorage(';
                            content += "'";
                            content += response.answer[i]._id;
                            content += "'";
                            content += ')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';                        
                        }
                            
                            content += '<span style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                                content += score;
                            content += '</span>';
                        content += '</div>';
                        
                        content += '<span>';
                            content += response.answer[i].response.replaceAll('\n', '<br>');
                        content += '</span>';
//                        <span><br><code>hello world</code></span>
                        
                        content += '<div style="margin-top: 20px;">';
                            content += '<label class="badge purpleLabel2">';
                                var time = new Date(response.answer[i].time);
                                time = time.toISOString();
                                content += time.slice(0, 10);
                            content += '</label>';
                
                            content += '<div style="float:right;">';
                                content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                                content += "'1', '";
                                content += response.answer[i]._id;
                                content += "', '";
                                content += response.answer[i].replier_id;
                                content += "')";
                                content += '"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button>';
                                    
                                content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                                content += "'-1', '";
                                content += response.answer[i]._id;
                                content += "', '";
                                content += response.answer[i].replier_id;
                                content += "')";
                                content += '"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>';
                            content += '</div>';
                        content += '</div>';
                    content += '</div>';
                content += '</div>';
            }
            
            document.getElementById("response").innerHTML = content;
        },
        error: function(){
            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
}

window.addEventListener("load", start, false);