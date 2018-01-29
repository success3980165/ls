new Vue({
  el: '#app',
  data: {
    hoolaiCmsAPI: new hoolaiCmsAPI(25, false),
    popYuyueShow: false,
    telephone: '',
    code: '',
    countdown: 60,
    isGrayBg: false,
    smsCodeVal: '获取验证码',
    isDisabled: false,
    isAndroidActive: true,
    isiOSActive: false,
    iosOrAndroid: 'android',
    lsActivityAPI: new hoolaiActivityAPI(53, true),
    totalNum: 0,
    cover: false,
    nextcover: false,
    wanjia: false,
    news: false,
    detailcover: false,
    detail: false,
    listData: [],
    isRecommend: [],
    article_title: '',
    article_time: '',
    article_content: '',
    success: false,
    wanfa:false,
    error: false
  },
  created: function() {
    this.getTotal();
    this.initData();
  },
  methods: {
    closeSuccess() {
      this.success = false;
    },
    closeError() {
      this.error = false;
    },
    qidai() {
      alert("敬请期待！")
    },
    closedetail() {
      this.detailcover = false;
      this.detail = false;
    },
    opendetail(article_id) {
      console.log(article_id);
      this.detailcover = true;
      this.detail = true;
      this.goGetByID(article_id);
    },
    openNews() {
      this.news = true;
      this.nextcover = true;
      this.goGetList('新闻资讯', 1, 2, 1);
      this.goGetList('新闻资讯', 1, 100);
    },
    openWanfa() {
      this.wanfa = true;
      this.nextcover = true;
      this.goGetList('玩法介绍', 1, 2, 1);
      this.goGetList('玩法介绍', 1, 100);
    },
    openWanjia: function() {
      this.nextcover = true;
      this.wanjia = true;
    },
    popYuyue: function() {
      this.popYuyueShow = true;
      this.cover = true;
    },
    closePop: function() {
      this.popYuyueShow = false;
      this.cover = false;
      this.nextcover = false;
      this.wanjia = false;
      this.wanfa = false;
      this.news = false;
      this.popYuyueShow = false;
    },
    chooseXT: function(str) {
      if (str == 'android') {
        this.isAndroidActive = true;
        this.isiOSActive = false;
        this.iosOrAndroid = 'android';
      } else {
        this.isAndroidActive = false;
        this.isiOSActive = true;
        this.iosOrAndroid = 'ios';
      }
    },
    sendSms: function() {
      var self = this;
      console.log(this.telephone);
      var mobile = this.telephone;
      var data = {};
      data.mobile = mobile;

      this.lsActivityAPI.sendMobileCode(data, function(result) {
        if (data.mobile == '') {
          alert(result.msg);
          return;
        }
        if (result.ret != 1) {
          // alert(result.msg);
          self.error = true;
        } else {
          self.isGrayBg = true;
          self.setTime();
        }
      })
    },
    setTime: function() {
      if (this.countdown == 0) {
        this.isGrayBg = false;
        this.smsCodeVal = "获取验证码";
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
        this.isGrayBg = true;
        this.smsCodeVal = '重新发送' + this.countdown + 's';
        this.countdown--;
      }
      setTimeout(this.setTime, 1000)
    },
    saveRecord: function() {
      var data = {};
      data.mobile = this.telephone;
      data.verifyCode = this.code;
      data.platform = this.iosOrAndroid;
      console.log(data);
      var self = this;
      this.lsActivityAPI.saveRecord(data, function(result) {
        console.log(result)
        if (result.ret != 1) {
          // alert(result.msg);
          self.error = true;
        } else {
          // alert("预约成功！");
          // 领取成功
          self.success = true;
          // self.popYuyueShow = false;
          // self.cover = false;
        }
      })
    },
    getTotal: function() {
      var self = this;
      this.lsActivityAPI.getTotal(function(result) {
        if (result.ret != 1) {
          alert(result.msg);
        } else {
          self.totalNum = result.total;
        }
      })
    },
    initData() {
      var that = this;
      var id = getUrlParam('id');
      if (id != '1') {
        that.goGetByID(id)
      }
    },
    goGetList(str, num, rows, recommend) {
      var that = this;
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
