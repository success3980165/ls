new Vue({
  el: '#app',
  data: {
    hoolaiCmsAPI: new hoolaiCmsAPI(25, false),
    cover: false,
    list: false,
    ygzzActivityAPI: new hoolaiActivityAPI(53, true),
    countdown: 60,
    smsCodeVal: '获取验证码',
    isDisabled: false,
    isGrayBg: false,
    telephone: '',
    character:'',
    code: '',
    isAnd: true,
    isIos: false,
    convertId: null,
    success:false,
    fail:false,
    cover2: false,
    cover3: false,
    total:0,
    one: false,
    two: false,
    three: false,
    four: false,
    dialog: false,
    listData: [],
    isRecommend: [],
    article_title: '',
    article_time: '',
    article_content: '',
    news: false,
    wanjia: false,
    wanfa: false,
    detail:false
  },
  created: function() {
    if (isMobile.apple.device) {
      this.isIos = true
      this.isAnd = false
    }
    if (isMobile.android.device) {
      this.isAnd = true
      this.isIos = false
    }
    this.getUrlParam(name);
    this.loadData();
    this.getTotal();
    this.initData();
  },
  methods: {
    opendetail(article_id) {
      console.log(article_id);
      this.detailcover = true;
      this.detail = true;
      this.goGetByID(article_id);
    },
    closedetail() {
      this.detail = false
    },
    showDialog:function () {
      this.dialog = true
      this.cover = true
    },
    closeDialog:function () {
      this.dialog = false
      this.cover = false
    },
    showNews:function () {
      this.news = true
      this.cover3 = true
      this.goGetList('新闻资讯', 1, 2, 1);
      this.goGetList('新闻资讯', 1, 100);
    },
    closeNews:function () {
      this.news = false
      this.cover3 = false
    },
    showWanjia:function () {
      this.wanjia = true
    },
    closeWanjia:function () {
      this.wanjia = false
    },
    showWanfa:function () {
      this.wanfa = true
      this.goGetList('玩法介绍', 1, 2, 1);
      this.goGetList('玩法介绍', 1, 100);
    },
    closeWanfa:function () {
      this.wanfa = false
    },
    showMenu:function () {
      this.list = true
    },
    closMenu:function () {
      this.list = false
    },
    closeSuccess: function() {
      this.cover2 = false
      this.success = false
    },
    closeFail: function(){
      this.cover2 = false
      this.fail = false
    },
    clickGainian: function() {
      alert("敬请期待！")
    },
     chooseXT: function(str) {
      if (str == 'android') {
        this.isAnd = true;
        this.isIos = false;
      } else {
        this.isAnd = false;
        this.isIos = true;
      }
    },

    closeMc: function() {
      this.cover = false
      this.yuyue = false
    },
    setTime: function() {
      if (this.countdown == 0) {
        this.isGrayBg = false;
        this.smsCodeVal = "获取验证码";
        this.isDisabled = false;
        return;
      } else {
        this.isDisabled = true;
        this.isGrayBg = true;
        this.smsCodeVal = '重新发送' + this.countdown + 's';
        this.countdown--;
      }
      setTimeout(this.setTime, 1000)
    },
    sendSms: function() {
      var self = this;
      console.log(this.telephone);
      var mobile = this.telephone;
      var data = {};
      data.mobile = mobile;
      if (this.leiShow) {
        this.character = '雷震子';
      } else {
        this.character = '母夜叉';
      }
      this.ygzzActivityAPI.sendMobileCode(data, function(result) {
        if (result.ret != 1) {
          if (result.code == 19) {
            // 错误的手机号
            alert("请输入正确的手机号")
            return;
          }
          if (result.code == 4) {
            // 重复领取
            self.fail=true
            self.cover2=true
            return;
          }
          // alert(result.msg);
        } else {
          self.isGrayBg = true;
          self.countdown = 60;
          self.setTime();
        }
      })
    },
    // 领取礼包，获取礼包码
    saveRecord: function() {
      var mobile = this.telephone;
      var mobilecode = this.code;
      var platform = '';
      if (this.isAnd) {
        platform = 'android';
      } else {
        platform = 'ios';
      }
      console.log(this.character)
      var self = this;
      var data = {};
      data.mobile = mobile;
      data.verifyCode = mobilecode;
      data.platform = platform;
      data.channel = self.channelName;

      console.log(data);

      this.ygzzActivityAPI.saveRecord(data, function(result) {
        console.log(result)
        if (result.ret != 1) {
          if (result.code == 7) {
            alert("错误的验证码")
            return;
          }
          if (result.code == 19) {
            alert("请输入正确的手机号")
            return;
          }
          if (result.code == 5) {
            self.fail=true
            self.cover2=true
            return;
          }
          alert(result.msg);
        } else {
          self.success=true
          self.cover2=true
          self.cover = false
          if (self.convertId) {
            _taq.push({
              convert_id: self.convertId,
              event_type: "button"
            })
          }
        }
      })
    },
    getUrlParam: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },
    loadData: function() {
      var that = this;
      that.getUrlParam(name);
      var channelId = that.getUrlParam('channel');
      var channelData = {};
      if (channelId) {
        $.getJSON('/yuyue/channel.json?n=' + new Date().getTime(), function(list) {
          list.forEach(function(item) {
            if ((item.channelId + "") === channelId) {
              channelData = item;
              that.channelName = channelData.channelName;
              console.log(that.channelName);
            }
          })
        })
      }
    },
    initData() {
      var that = this;
      var id = getUrlParam('id');
      if (id != '1') {
        that.goGetByID(id)
      }
    },
    getTotal: function() {
      var self = this
      this.ygzzActivityAPI.getTotal(function(result) {
        if (result.ret != 1) {
          alert(result.msg);
        } else {
          self.total = result.total;
          if(self.total>10000) {
            self.one = true;
          }
          if (self.total>100000) {
            self.one = true;
            self.two = true;
          }
          if (self.total>300000) {
            self.one = true;
            self.two = true;
            self.three = true;
          }
          if (self.total>500000) {
            self.one = true;
            self.two = true;
            self.three = true;
            self.four = true;
          }
        }
      })
    },
    goGetList(str, num, rows, recommend) {
      var that = this;
      if (str == '新闻资讯') {
        that.listName = '新闻资讯';
      } else if (str == '玩法介绍') {
        that.listName = '玩法介绍';
      }
      var params = {};
      // 1: 获取推荐的文章
      if (recommend) {
        params.isRecommend = recommend;
      }
      // 2: 获取某个类型的所有文章
      params.categoryName = str;
      // 3: 分页 page 默认显示第1页
      // params.page = 1;
      params.page = num;
      // 4: 每页显示多少个 默认10个
      params.rows = rows;
      that.listName = str;

      that.hoolaiCmsAPI.getList(params, function(result) {
        var listData = result.rows;
        // that.listData = result.rows;
        console.log(that.listData)
        listData.forEach(function(item) {
          // item.listDataTime = moment(item.updated).format('YYYY-MM-DD');
          item.updated = item.created.substr(0, 10);
          // item.hrefVal = 'index.html?id=' + item.id;
        })
        // this.detailcover = true;
        if (recommend) {
          that.isRecommend = listData
        } else {
          that.listData = listData;
        }
        // 总页数
        that.all = Math.ceil(result.total / params.rows);
      })
    },
    goGetByID: function(articleTag) {
      var that = this;
      console.log(articleTag);
      that.hoolaiCmsAPI.getById(articleTag, function(result) {
        console.log(result);
        // that.listName = result.data.categorys[0].name
        that.article_title = result.data.title;
        that.article_time = result.data.updated;
        that.article_content = result.data.content;
      }, 'json')
    }
  }
})
