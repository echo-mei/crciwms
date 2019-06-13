import * as Mock from 'mockjs';
import { BASE_URL } from '../config';

let Random = Mock.Random;

let login = new RegExp(`${BASE_URL}/users/login`);
Mock.mock(login, 'post', {
  success: true,
  msg: 'success',
  obj: {
    authorization: Math.random().toString(22).substr(2),
    userCode: 1
  }
});

let getMe = new RegExp(`${BASE_URL}/personInfo`);
Mock.mock(getMe, 'get', {
  success: true,
  msg: 'success',
  obj: {
    'personId': 1,
    'name': 'admin',
    'photoBlob': '',
    'unitName': '组织部',
    'dutyName': '人事部主管',
    'birthday': '1988-08-08',
    'sexCode': '男',
    'nationality': '汉族',
    'nativePlace': '粤',
    'partyTime': '2006-06-06',
    'onJobDegree': '硕士',
    'onJobGraSchoolMajor': '北京大学光华管理学院'
  }
});

let selefInfo = {
  'personId': 1,
  'motto': '命由天定，路由己行',
  'jobSkills': '胡编乱造',
  'interests': '对牛弹琴',
  'lifeInspiration': '人生哪有什么意义。你给他什么意义，他就有什么意义。',
  'mainJobs': '手之舞',
  'mainAchievements': '打败怪兽'
};
let personInfoStatement = new RegExp(`${BASE_URL}/personInfo/statement`);
Mock.mock(personInfoStatement, 'get', function () {
  return {
    success: true,
    msg: 'success',
    obj: selefInfo
  }
});
Mock.mock(personInfoStatement, 'post', function (req) {
  let body = JSON.parse(req.body);
  for (let key in body) {
    selefInfo[key] = body[key];
  }
  return {
    success: true,
    msg: 'success',
    obj: selefInfo
  }
});

let signInCount = new RegExp(`${BASE_URL}/signIn/count`);
Mock.mock(signInCount, 'get', {
  success: true,
  'msg': 'success',
  'obj|1-10': [{
    'signInType': function () {
      return Random.string('在岗出差外出休假请假', 2);
    },
    'counts': function () {
      return Random.natural(1, 10);
    }
  }]
});
let signIn = new RegExp(`${BASE_URL}/signIn`);
Mock.mock(signIn, 'post', {
  success: true,
  msg: 'success',
  obj: {}
});
Mock.mock(signIn, 'get', {
  success: true,
  msg: 'success',
  'obj|1-30': [
    {
      'signInId|+1': 1,
      'signInUser': 'admin',
      'signInType': function () {
        return Random.string('在岗出差外出休假请假', 2);
      },
      'signInDate': function () {
        return Random.date('2018-06-dd');
      }
    }
  ]
});

let impressionCount = new RegExp(`${BASE_URL}/impressionTag/count`);
Mock.mock(impressionCount, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    'tagName': function () {
      return Random.string('成熟稳重活泼可爱健谈潇洒帅颜值在线', 3);
    },
    'counts': function () {
      return Random.natural(1, 100);
    }
  }]
});

let dynamic = new RegExp(`${BASE_URL}/getDynamic/[1-9]+`);
Mock.mock(dynamic, 'get', {
  // console.log(req)
    success: true,
    msg: 'success',
    
    'obj|1-30': [{
      'groups|1': ['关注', '本单位', '推荐', '办事'],
      'name|1': ['张爱民', '李爱民', '习总理', '吴彦祖助理', '刘德华处长'],
      'title': function() {
        return Random.string('习近平走基层有感， 观后感， 责任感', 10);
      },
      'content': function() {
        return Random.string('大会的主题是：不忘初心，牢记使命，高举中国特色社会主义伟大旗帜，决胜全面建设小康社会，夺取新时代中国特色社会主义伟大胜利，为实现中华名族伟大复兴不忘初心，牢记使命，高举中国特色社会主义伟大旗帜，决胜全面建设小康社会，夺取新时代中国特色社会主义伟大胜利，为实现中华名族伟大复兴', 10);
      },
      'pubTime': '1分钟前',
      'allLikeList':  ['张爱民', '李爱民', '习总理', '吴彦', '刘德','张民', '李爱', '习理', '吴理', '刘长', '爱民', '李爱国家', '习总', '彦祖', '华长'],
      'likeList': ['张爱民', '李爱民', '习总理', '吴彦', '刘德','张民', '李爱', '习理', '吴理', '刘长'],
      'com':{
        'comList|1': ['张爱民', '李爱民', '习总理', '吴彦', '刘德','张民', '李爱', '习理', '吴理', '刘长', '爱民', '李爱国家', '习总', '彦祖', '华长'],
        'comContent': function() {
          return Random.cparagraph(1);
        }
    }
  }]
});

let daily = new RegExp(`${BASE_URL}/logDaily/[1-9]+`);
Mock.mock(daily, 'get', {
  success: true,
  msg: 'success',
  obj: {
    dailyId: 1,
    title: function () {
      return Random.cparagraph(1);
    },
    content: function () {
      return Random.cparagraph(2);
    },
    publishTime: '2018-06-07 12:30',
    'listStLike|0-30': [{
      'operatorName': function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'group|1': [
        "关注",
        "本单位",
        "其他组织"
      ],
      'pos|1': [
        "干事、秘书、刺客",
        "翻译、法官",
        "干事"
      ],
      'org|1': [
        "深圳市组织部1",
        "深圳市组织部2",
        "深圳市组织部3"
      ]
    }],
    'listStComment|0-10': [{
      'stCommentId|+1': 1,
      'operatorName': function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'commentObjectName': function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'content': function () {
        return Random.cparagraph(1);
      }
    }]
  }
});
Mock.mock(daily, 'delete', {
  success: true,
  msg: 'success',
  obj: {}
});

// 我的工作日志列表
let logDailyList = new RegExp(`${BASE_URL}/logDaily[?]?`);
Mock.mock(logDailyList, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dailyId|+1': 1,
    'dynamicId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(2);
    },
    'publishTime': function () {
      return Random.datetime('yyyy-MM-dd HH:mm')
    },
    'likeCount': function () {
      return Random.natural(1, 20);
    },
    'listStLike|0-20': [
      {
        'operatorName': function () {
          return Random.string('李三张无季白银银小子', 3);
        }
      }
    ],
    'commentCount': function () {
      return Random.natural(1, 20);
    },
    'listStComment': [
      {
        'operatorName': function () {
          return Random.string('李三张无季白银银小子', 3);
        },
        'content': function () {
          return Random.cparagraph(1);
        }
      }
    ]
  }]
}
);
// 我的工作日志点赞数分类列表
let findSTLike = new RegExp(`${BASE_URL}/logDaily/findLikeCount`);
const jobLevel = ['市领导', '局级领导', '处级领导', '科级领导', '科级以下干部']
Mock.mock(findSTLike, 'get', {
  success: true,
  msg: 'success',
  'obj|1-5': [{
    'jobLevel|+1': jobLevel,
    'likeCounts': function () {
      return Random.natural(1, 30);
    }
  }]
}
);

// 获取干部评价列表
let evaluate = new RegExp(`${BASE_URL}/personalEvaluation`);
Mock.mock(evaluate, 'get', {
  success: true,
  msg: 'success',
  'obj|5-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'evaluationId|+1': 1,
    'evaluationTitle': function () {
      return Random.cparagraph();
    },
    'evaluationTime': function () {
      return Random.datetime('yyyy-MM-dd HH:mm')
    },
    'source': "干部考察",
    'evaluatorName': function () {
      return Random.cname();
    }
  }]
});
//创建干部评价
let evaluateCreate = new RegExp(`${BASE_URL}/personalEvaluation`);
Mock.mock(evaluateCreate, 'post', {
  success: true,
  msg: 'success',
  obj: {}
});
//修改干部评价
let evaluateUpdate = new RegExp(`${BASE_URL}/personalEvaluation`);
Mock.mock(evaluateUpdate, 'put', {
  success: true,
  msg: 'success',
  obj: {}
});
//修改干部评价
let evaluateDelete = new RegExp(`${BASE_URL}/personalEvaluation/[1-9]+`);
Mock.mock(evaluateDelete, 'delete', {
  success: true,
  msg: 'success',
  obj: {}
});


//日志创建
let createDailyInfo = {};
let logDaily = `${BASE_URL}/logDaily`;
Mock.mock(logDaily, 'post', function (req) {
  let body = JSON.parse(req.body);
  for (let key in body) {
    createDailyInfo[key] = body[key];
  }
  return {
    success: true,
    msg: 'success',
    obj: { createDailyInfo }
  }
});

// 每周一励
let dailyOneList = new RegExp(`${BASE_URL}/logWeekly[?]?`);
Mock.mock(dailyOneList, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dailyId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(2);
    },
    //开始时间,结束时间
    'startTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'endTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'likeCount': function () {
      return Random.natural(1, 20);
    },
    'commentCount': function () {
      return Random.natural(1, 20);
    }
  }]
}
);
// 每季三励
let dailyThreeList = new RegExp(`${BASE_URL}/logQuarterly[?]?`);
Mock.mock(dailyThreeList, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dailyId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(2);
    },
    //开始时间,结束时间
    'startTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'endTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'likeCount': function () {
      return Random.natural(1, 20);
    },
    'commentCount': function () {
      return Random.natural(1, 20);
    }
  }]
}
);
// 每年十励
let dailyTenList = new RegExp(`${BASE_URL}/logYearly[?]?`);
Mock.mock(dailyTenList, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dailyId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(2);
    },
    //开始时间,结束时间
    'startTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'endTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'likeCount': function () {
      return Random.natural(1, 20);
    },
    'commentCount': function () {
      return Random.natural(1, 20);
    }
  }]
}
);

let addressListOfFriend = new RegExp(`${BASE_URL}/getFriendsList/[1-9]+`);
Mock.mock(addressListOfFriend, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    'name': function () {
      return Random.string('李三张无季白银银小子', 3);
    },
    'group|1': [
      "宣传科干事",
      "执行科干事",
      "组织科干事"
    ]
  }]
}
);

let getTeamList = new RegExp(`${BASE_URL}/teamlist/[1-9]+`);
Mock.mock(getTeamList, 'get', {
  success: true,
  msg: 'success',
  obj: [
    { 'text': '领导班子12', 'uid': '1' },
    { 'text': '组织一处', 'uid': '2' },
    { 'text': '组织二处', 'uid': '3' },
    { 'text': '干部一处', 'uid': '4' },
    { 'text': '干部二处', 'uid': '5' },
    { 'text': '干部三处', 'uid': '6' },
    { 'text': '干部教育培训处', 'uid': '7' }
  ]
});

let getPersonList = new RegExp(`${BASE_URL}/getPersonList/[1-9]+`);
Mock.mock(getPersonList, 'get', function (req) {
  return {
    success: true,
    msg: 'success',
    obj: [
      { img: '', name: '张爱民1', unit: '宣传科干事', pid: 1 },
      { img: '', name: '张爱民2', unit: '宣传科干事', pid: 2 },
      { img: '', name: '张爱民3', unit: '宣传科干事', pid: 3 },
      { img: '', name: '张爱民4', unit: '宣传科干事', pid: 4 },
      { img: '', name: '张爱民5', unit: '宣传科干事', pid: 5 },
      { img: '', name: '张爱民6', unit: '宣传科干事', pid: 6 },
      { img: '', name: '张爱民7', unit: '宣传科干事', pid: 7 },
      { img: '', name: '张爱民8', unit: '宣传科干事', pid: 8 },
      { img: '', name: '张爱民9', unit: '宣传科干事', pid: 9 },
      { img: '', name: '张爱民10', unit: '宣传科干事', pid: 10 }
    ]
  }
});

let getPersonInfo = new RegExp(`${BASE_URL}/getPersonInfo/[0-9]+`);
Mock.mock(getPersonInfo, 'get', function (req) {
  return {
    success: true,
    msg: 'success',
    obj: {
      'age': 20,
      'sex': '男',
      'allDayDegree': '大学本科-管理学学士学位',
      'graSchool': '中国人民大学-公共大学',
      'nowDegree': '大学本科-管理学学士学位',
      'nowGraSchollAndMajor': '清华大学-行政管理'
    }
  }
})

let dynamic1 = new RegExp(`${BASE_URL}/getDynamic/[1-9]+`);
Mock.mock(dynamic1, 'get', {
  // console.log(req)
    success: true,
    msg: 'success',
    
    'obj|1-30': [{
    'groups|1': ['focus', 'myUint', 'rec', 'deal'],
    'name|1': ['张爱民', '李爱民', '习总理', '吴彦祖助理', '刘德华处长'],
    'title': '《习近平走基层有感， 观后感， 责任感， 总结分享》',
    'content': function() {
      return Random.string('《大会的主题是：不忘初心，牢记使命，高举中国特色社会主义伟大旗帜，决胜全面建设小康社会，夺取新时代中国特色社会主义伟大胜利，为实现中华名族伟大复兴不忘初心，牢记使命，高举中国特色社会主义伟大旗帜，决胜全面建设小康社会，夺取新时代中国特色社会主义伟大胜利，为实现中华名族伟大复兴》', 30);
    },
    'pubTime': '1分钟前',
    'allLikeList':  ['张爱民', '李爱民', '习总理', '吴彦', '刘德','张民', '李爱', '习理', '吴理', '刘长', '爱民', '李爱国家', '习总', '彦祖', '华长'],
    'likeList': ['张爱民', '李爱民', '习总理', '吴彦', '刘德','张民', '李爱', '习理', '吴理', '刘长'],
    'com|1-5':[{
      'comList|1': ['张爱民', '李爱民', '习总理', '吴彦', '刘德','张民', '李爱', '习理', '吴理', '刘长', '爱民', '李爱国家', '习总', '彦祖', '华长'],
      'comContent': function() {
        return Random.cparagraph(1);
      }
    }]
  }]
});

let createStComment = new RegExp(`${BASE_URL}/dynamicbiz/createStComment/[0-9]+`);
Mock.mock(createStComment, 'post', function (req) {
  return {
    success: true,
    msg: 'success',
    obj: {}
  }
});

let createStLike = new RegExp(`${BASE_URL}/dynamicbiz/createStLike/[0-9]+`);
Mock.mock(createStLike, 'post', function (req) {
  return {
    success: true,
    msg: 'success',
    obj: {}
  }
});

// 获取关注动态列表
let gzDynamic = new RegExp(`${BASE_URL}/sbDynamic/listAttentionDynamicMessage`);
Mock.mock(gzDynamic, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dynamicId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(3,10);
    },
    //开始时间
    'publishTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'sbLikeList|0-20': [
      {
        'name': function () {
          return Random.string('李三张无季白银银小子', 3);
        }
      }
    ],
    'sbCommentList|1-5': [
      {
        'sbCommentId|+1': 1,
        'commentUserName': function () {
          return Random.string('李三张无季白银银小子', 3);
        },
        'content': function () {
          return Random.cparagraph(1);
        }
      }
    ],
    'soaPersonInfoDTO':{
      'name':function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'photoBlob':""
    }
  }]
}
);

// 获取单位动态列表
let dwDynamic = new RegExp(`${BASE_URL}/sbDynamic/listUnitDynamicMessage`);
Mock.mock(dwDynamic, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dynamicId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(3,10);
    },
    //开始时间
    'publishTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'sbLikeList|0-20': [
      {
        'name': function () {
          return Random.string('李三张无季白银银小子', 3);
        }
      }
    ],
    'sbCommentList|1-5': [
      {
        'sbCommentId|+1': 1,
        'commentUserName': function () {
          return Random.string('李三张无季白银银小子', 3);
        },
        'content': function () {
          return Random.cparagraph(1);
        }
      }
    ],
    'soaPersonInfoDTO':{
      'name':function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'photoBlob':""
    }
  }]
}
);

// 获取推荐动态列表
let tjDynamic = new RegExp(`${BASE_URL}/sbDynamic/listRecommendDynamicMessage`);
Mock.mock(tjDynamic, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dynamicId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(3,10);
    },
    //开始时间
    'publishTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'sbLikeList|0-20': [
      {
        'name': function () {
          return Random.string('李三张无季白银银小子', 3);
        }
      }
    ],
    'sbCommentList|1-5': [
      {
        'commentUserName': function () {
          return Random.string('李三张无季白银银小子', 3);
        },
        'content': function () {
          return Random.cparagraph(1);
        }
      }
    ],
    'soaPersonInfoDTO':{
      'name':function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'photoBlob':""
    }
  }]
}
);

// 获取领导批赞动态列表
let pzDynamic = new RegExp(`${BASE_URL}/sbDynamic/listLeaderLikeDynamicMessage`);
Mock.mock(pzDynamic, 'get', {
  success: true,
  msg: 'success',
  'obj|1-10': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dynamicId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph(3,10);
    },
    //开始时间
    'publishTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'sbLikeList|0-20': [
      {
        'name': function () {
          return Random.string('李三张无季白银银小子', 3);
        }
      }
    ],
    'sbCommentList|1-5': [
      {
        'sbCommentId|+1': 1,
        'commentUserName': function () {
          return Random.string('李三张无季白银银小子', 3);
        },
        'content': function () {
          return Random.cparagraph(1);
        }
      }
    ],
    'soaPersonInfoDTO':{
      'name':function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'photoBlob':""
    }
  }]
}
);

// 获取动态详情
let dynamicDetail = new RegExp(`${BASE_URL}/sbDynamic/getSbDynamicView`);
Mock.mock(dynamicDetail, 'get', {
  success: true,
  msg: 'success',
  'obj': {
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'dynamicId|+1': 1,
    'title': function () {
      return Random.cparagraph();
    },
    'content': function () {
      return Random.cparagraph();
    },
    //开始时间
    'publishTime': function () {
      return Random.datetime('yyyy-MM-dd')
    },
    'sbLikeList|0-20': [
      {
        'name': function () {
          return Random.string('李三张无季白银银小子', 3);
        }
      }
    ],
    'sbCommentList|1-5': [
      {
        'sbCommentId|+1': 1,
        'commentUserName': function () {
          return Random.string('李三张无季白银银小子', 3);
        },
        'content': function () {
          return Random.cparagraph(1);
        }
      }
    ],
    'soaPersonInfoDTO':{
      'name':function () {
        return Random.string('李三张无季白银银小子', 3);
      },
      'photoBlob':""
    }
  }
}
);



export { };
