var data = {
    promoteArr: promoteArr,
    template_style:template_style,
    reply:reply
}
var commonObject = function(data){
    var self = this;
    this.data = data;
    this.promoteArr = self.data.promoteArr;
    this.reply = self.data.reply;
    this.template_style = self.data.template_style;
    this.ua = navigator.userAgent;
    self.init();
};
commonObject.prototype = {
    init:function(){
        var self = this;
        if(self.reply){
            this.renderReply();
        };
        if("promoteArr" in self.data && self.data['promoteArr']){
            self.renderPromote();
        }else{
            self.noRenderPromote();
        }
        self.renderTrace();
        self.listingMessage();
    },
    createCopyDom:function(query){
        var self = this;
        var element = document.body;
        var oDiv = document.createElement('div');
        oDiv.innerHTML = query.promote;
        oDiv.id = 'copyContent';
        oDiv.style.opacity = 0;
        oDiv.style.position = 'fixed';
        oDiv.style.zIndex = '-9999';
        element.appendChild(oDiv);
    },
    renderPromote:function(){
        var self = this;
        var index = Math.floor(Math.random()*self.promoteArr.length);
        var query = promoteArr[index];
        var ua = self.ua;
        var template_style = self.template_style;
        var wxid = '';
        var banner = '';
        var landing_page_banner = document.getElementById('landing_page_banner');
        self.createCopyDom(query);
        if(query.type == 1){
            var wxid = query.promote;
            var imageUrl = query.imageUrl;
            var wx_text = '微信';
            var wx_logo = '<img src="/allsites/template/public/wx.gif">';
            var wx_logo_src = '/allsites/template/public/wx.gif';
            var wx_url = 'weixin://';
        }else if(query.type == 0){
            var wxid = query.promote;
            var imageUrl = query.imageUrl;
            var wx_logo = '<img src="/allsites/template/public/qq.png">';
            var wx_logo_src = '/allsites/template/public/qq.png';
            var wx_text = 'QQ';
            if(ua.indexOf("Android") > -1 || ua.indexOf("Linux") >-1){
                var wx_url = 'mqqwpa://im/chat?chat_type=wpa&uin='+wxid+'&version=1&src_type=web';
            }else{
                var wx_url = 'mqq://';
            }
        }
        if(landing_page_banner && landing_page_banner.innerHTML){
            banner = landing_page_banner.innerHTML;
        }else{
            banner = '<div class="foot sj_weixin trigger-promote" id="sjWeiXin">'+wx_logo+'<p>添加{{wechat_text}}: <b class="wxcode1"><span id="wechat"><mark class="yellow ">{{wechat}}</mark></span></b>（←点击复制并跳转）<br></p></div>';
        }
        if(template_style == 0){
            var bottom_banner = document.getElementById('bottom_banner');
                bottom_banner.innerHTML = banner;
            if(banner.indexOf('landing-page-icon') > -1){
                bottom_banner.getElementsByClassName('landing-page-icon')[0].src = wx_logo_src;
            }
            document.getElementsByClassName("content")[0].style.paddingTop = "0px";
            document.getElementsByClassName("content")[0].style.paddingBottom = "70px";
        }else if(template_style == 1){
            var top_banner = document.getElementById('top_banner');
                top_banner.innerHTML = banner;
            if(banner.indexOf('landing-page-icon') > -1){
                top_banner.getElementsByClassName('landing-page-icon')[0].src = wx_logo_src;
            }
            document.getElementsByClassName("content")[0].style.paddingTop = "70px";
            document.getElementsByClassName("content")[0].style.paddingBottom = "0px";
        }else if(template_style == 2){
            document.getElementById('right_banner').innerHTML =  '<div class="sj_weixin" id="sjWeiXin">'+wx_logo+'<p class="hide">添加{{wechat_text}}: <b class="wxcode1"><span id="wechat"><mark class="yellow ">{{wechat}}</mark></span></b>（←点击复制并跳转）<br></p></div>';
        }
        var l = document.getElementsByClassName('wxid').length;
        for(var i =0;i<l;i++){
            document.getElementsByClassName('wxid')[i].innerHTML = wxid;
        }
        var template_content = document.getElementsByTagName('body')[0].innerHTML;
        template_content = template_content.replace(/{{微信}}/g,'<span class="landing-page-number">'+wxid+'</span>');
        template_content = template_content.replace(/{{wechat}}/g,'<span class="landing-page-number">'+wxid+'</span>');
        template_content = template_content.replace(/{{QQ}}/g,'<span class="landing-page-number">'+wxid+'</span>');
        template_content = template_content.replace(/{{二维码}}/g,'<span class="landing-page-qrcode">'+imageUrl+'</span>');
        document.getElementsByTagName('body')[0].innerHTML = template_content.replace(/{{wechat_text}}/g,'<span class="landing-page-type">'+wx_text+'</span>');
        if(ua.indexOf('qukan')!=-1){
            var g = document.getElementsByClassName('trigger-promote').length;
            for(var i =0;i<g;i++){
                document.getElementsByClassName('trigger-promote')[i].addEventListener('click',function(){
                    var result = self.copyText(wx_text);
                    if(result){
                        location.href = 'tools?target=clipboard&value=' + wxid;
                        setTimeout(function() {
                            location.href = wx_url;
                        }, 1000);
                    }
                });
            }
        }else{
            var g = document.getElementsByClassName('trigger-promote').length;
            for (var i = 0; i < g; i++) {
                document.getElementsByClassName('trigger-promote')[i].addEventListener('click', function() {
                    var result = self.copyText(wx_text);
                    if(result){
                        setTimeout(function() {
                            location.href = wx_url;
                        }, 1000);
                    }
                });
            }
        }

    },
    noRenderPromote: function(){
        var wxid = wx_text = imageUrl = '';
        var template_content = document.getElementsByTagName('body')[0].innerHTML;
        template_content = template_content.replace(/{{微信}}/g,wxid);
        template_content = template_content.replace(/{{wechat}}/g,wxid);
        template_content = template_content.replace(/{{QQ}}/g,wxid);
        template_content = template_content.replace(/{{二维码}}/g,imageUrl);
        document.getElementsByTagName('body')[0].innerHTML = template_content.replace(/{{wechat_text}}/g,wx_text);
    },
    copyText:function(wx_text){
        var self = this;
        var info = "";
        var flag;
        var ua = self.ua;
        try{
            var content = document.getElementById('copyContent');
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(content);
            selection.removeAllRanges();
            selection.addRange(range);
            var resultCopy = document.execCommand('Copy', false, null);
            if(resultCopy || ua.indexOf("UCBrowser") > -1){
                info = "复制成功";
                flag = true;
            }else{
                info = "复制失败,请手动复制"+wx_text+"号码";
                flag = false;
            }
            
        }catch(e){
            info = "复制失败,请手动复制"+wx_text+"号码";
            flag = false;
        }
        var alertDialogSs = document.getElementById('alertDialogSs');
        alertDialogSs.innerHTML = info;
        alertDialogSs.style.display = 'block';
        setTimeout(function(){
            alertDialogSs.style.display = 'none';
        },2000);
        return flag;
    },
    renderReply:function(){
        var self = this;
        var data = self.reply;
        var html = '';
        data.map(function(rs) { 
            var template = document.getElementsByClassName('reply_template')[0].innerHTML;
            Object.keys(rs).map(function(obj) { 
                template = template.replace(obj,rs[obj]);
            });
            html += template;
        });
        document.getElementsByClassName('reply')[0].innerHTML = html;
    },
    renderTrace:function(){
        var l = document.getElementsByClassName('trigger-promote').length;
        window._iclicash = window._iclicash || [];
        var btn;
        for(var i=0;i<l;i++){
            btn =document.getElementsByClassName('trigger-promote')[i];
            window._iclicash.push([btn, 'click', 'active5','去微信']);
        }
    },
    listingMessage:function(){
        window.addEventListener("message", function( event ) {
            // 样式控制
            if(event.data && event.data.styleTarget){
                var styleTarget = event.data.styleTarget;
                var sjWeiXin = document.getElementById('sjWeiXin');
                sjWeiXin.getElementsByTagName('img')[0].className = '';
                sjWeiXin.getElementsByTagName('p')[0].className = '';
                var rightBanner = document.getElementById('right_banner');
                sjWeiXin.className = "foot sj_weixin trigger-promote";
                var cloneNode = sjWeiXin.cloneNode(true);
                var bottom_banner = document.getElementById('bottom_banner');
                var top_banner = document.getElementById('top_banner');
                var right_banner = document.getElementById('right_banner');
                bottom_banner.innerHTML = "";
                top_banner.innerHTML = "";
                right_banner.innerHTML = "";
                if(styleTarget == 0){
                    bottom_banner.appendChild(cloneNode);
                    document.getElementsByClassName("content")[0].style.paddingTop = "0px";
                    document.getElementsByClassName("content")[0].style.paddingBottom = "70px";
                }else if(styleTarget == 1){
                    top_banner.appendChild(cloneNode);
                    document.getElementsByClassName("content")[0].style.paddingTop = "70px";
                    document.getElementsByClassName("content")[0].style.paddingBottom = "0px";
                }else if(styleTarget ==2) {
                    right_banner.appendChild(cloneNode);
                    rightBanner.getElementsByClassName('sj_weixin')[0].className = 'sj_weixin trigger-promote';
                    rightBanner.getElementsByTagName('img')[0].className = 'fixedRight';
                    rightBanner.getElementsByTagName('p')[0].className = 'hide';
                    document.getElementsByClassName("content")[0].style.paddingTop = "0";
                    document.getElementsByClassName("content")[0].style.paddingBottom = "0";
                }
            };
            //qq或微信改变控制
            if(event.data && (event.data.promote || event.data.promote == "")){
                var changeQQOrWechat = document.getElementsByClassName('landing-page-number');
                if(changeQQOrWechat){
                    for(var i=0;i<changeQQOrWechat.length;i++){
                        changeQQOrWechat[i].innerHTML = event.data.promote;
                    }
                }
            };
            //qq或微信文字替换
            if(event.data && event.data.promote_type){
                var landingPageType = document.getElementsByClassName('landing-page-type');
                if(landingPageType){
                    for(var i=0;i<landingPageType.length;i++){
                        landingPageType[i].innerHTML=event.data.promote_type;
                    }
                };
                var sjWeiXin = document.getElementById('sjWeiXin');
               if(sjWeiXin){
                    if(event.data.promote_type == 'QQ'){
                        sjWeiXin.getElementsByTagName('img')[0].src = "/allsites/template/public/qq.png";
                    }else if(event.data.promote_type == '微信'){
                        sjWeiXin.getElementsByTagName('img')[0].src = "/allsites/template/public/wx.gif";
                    }
                };
                var landingPageIcon = document.getElementsByClassName('landing-page-icon');
                if(landingPageIcon[0]){
                    var wx_logo = "";
                    if(event.data.promote_type == 'QQ'){
                        wx_logo = "/allsites/template/public/qq.png";
                    }else if(event.data.promote_type == '微信'){
                        wx_logo = "/allsites/template/public/wx.gif";
                    }
                    for(var i=0; i<landingPageIcon.length;i++){
                        landingPageIcon[i].src = wx_logo;
                    }
                }
            }
            //二维码替换
            if(event.data && (event.data.imageUrl || event.data.imageUrl =="")){
                var qrCode = document.getElementsByClassName('landing-page-qrcode')[0];
                if(qrCode){
                    if(qrCode.children[0]){
                        qrCode.children[0].src = event.data.imageUrl;
                    }else{
                        qrCode.innerHTML = '<img width="100px" height="100px" src="'+event.data.imageUrl+'">';
                    }
                }
            }
            //文章标题替换
            if(event.data && (event.data.title || event.data.title == "")){
                var landingPageTitle = document.getElementsByClassName('landing-page-title');
                if(landingPageTitle && landingPageTitle[0]){
                    landingPageTitle[0].innerHTML=event.data.title;
                }
            }
            event.source.postMessage('得到了消息','*');

        }, false );
    }
};
new commonObject(data);