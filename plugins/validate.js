var  validate = {
   /*是否合法IP地址*/
 validateIP(rule, value,callback) {
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的IP地址'));
      } else {
        callback();
      }
    }
  },
  
  /* 是否手机号码或者固话*/
   validatePhoneTwo(rule, value, callback) {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码或者固话号码'));
      } else {
        callback();
      }
    }
  },
  /* 是否固话*/
   validateTelphone(rule, value,callback) {
    const reg =/0\d{2}-\d{7,8}/;
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'));
      } else {
        callback();
      }
    }
  },
  /* 是否手机号码*/
   validatePhone(rule, value,callback) {
    const reg =/^[1][3,4,5,7,8][0-9]{9}$/;
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    }
  },
  /* 是否身份证号码*/
   validateIdNo(rule, value,callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的身份证号码'));
      } else {
        callback();
      }
    }
  },
  /* 是否邮箱*/
   validateEMail(rule, value,callback) {
    const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
    if(value==''||value==undefined||value==null){
      callback();
    }else{
      if (!reg.test(value)){
        callback(new Error('请输入正确的邮箱地址'));
      } else {
        callback();
      }
    }
  },
  /* 合法uri*/
   validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
  },
  
  /*验证内容是否英文数字以及下划线*/
   isPassword(rule, value, callback) {
    const reg =/^[_a-zA-Z0-9]+$/;
    if(value==''||value==undefined||value==null){
      callback();
    } else {
      if (!reg.test(value)){
        callback(new Error('密码仅由英文字母，数字以及下划线组成'));
      } else {
        callback();
      }
    }
  },
  
  /*自动检验数值的范围*/
   checkMax20000(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback();
    } else if (!Number(value)) {
      callback(new Error('请输入[1,20000]之间的数字'));
    } else if (value < 1 || value > 20000) {
      callback(new Error('请输入[1,20000]之间的数字'));
    } else {
      callback();
    }
  },
  //验证输入面积，最大为100000平方米，最多保留两位小数
  checkAreaVal(rule, value,callback) {
    let yan= /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if(yan.test(value)){
      if(value < 0 || value>100000){
        callback(new Error('请输入[0,100000]之间的数字，最多保留两位小数'));
      }
    }else{
      // callback(new Error('请输入大于0 且 小于100000的正数，最多保留两位小数'));
      callback(new Error('请输入[0,100000]之间的数字，最多保留两位小数'));
    }
    callback();
  },
   //验证输入高度，最大为10000平方米，最多保留两位小数
   checkHeightVal(rule, value,callback) {
    let yan= /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if(yan.test(value)){
      if(value < 0 || value>10000){
        callback(new Error('请输入[0,10000]之间的数字，最多保留两位小数'));
      }
    }else{
      // callback(new Error('请输入大于0 且 小于100000的正数，最多保留两位小数'));
      callback(new Error('请输入[0,10000]之间的数字，最多保留两位小数'));
    }
    callback();
  },
  
  //验证数字输入框最大数值,32767
   checkMaxVal(rule, value,callback) {
    if (value < 0 || value > 32767) {
      callback(new Error('请输入[0,32767]之间的数字'));
    } else {
      callback();
    }
  },
  //验证是否0-99之间的正整数
  isOneToNinetyNineInteger(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[0-9][0-9]{0,1}$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入[0,99]之间的正整数'));
        } else {
          callback();
        }
      }
    }, 0);
  },
  //验证是否1-99之间
   isOneToNinetyNine(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[1-9][0-9]{0,1}$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入正整数，值为【1,99】'));
        } else {
          callback();
        }
      }
    }, 0);
  },
  
  // 验证是否整数
   isInteger(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      }
    }, 0);
  },
  // 验证是否整数,非必填
   isIntegerNotMust(rule, value, callback) {
    if (!value) {
      callback();
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      }
    }, 1000);
  },
  
  // 验证是否是[0-1]的小数
   isDecimal(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入[0,1]之间的数字'));
      } else {
        if (value < 0 || value > 1) {
          callback(new Error('请输入[0,1]之间的数字'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  
  // 验证是否是[1-10]的小数,即不可以等于0
   isBtnOneToTen(rule, value, callback) {
    if (typeof value == 'undefined') {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数，值为[1,10]'));
      } else {
        if (!(value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value == '7' || value == '8' || value == '9' || value == '10')) {
          callback(new Error('请输入正整数，值为[1,10]'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  // 验证是否是[1-100]的小数,即不可以等于0
   isBtnOneToHundred(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入整数，值为[1,100]'));
      } else {
        if (value < 1 || value > 100) {
          callback(new Error('请输入整数，值为[1,100]'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  // 验证是否是[0-100]的小数
   isBtnZeroToHundred(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入[1,100]之间的数字'));
      } else {
        if (value < 0 || value > 100) {
          callback(new Error('请输入[1,100]之间的数字'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  
  // 验证端口是否在[0,65535]之间
   isPort(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (value == '' || typeof(value) == undefined) {
        callback(new Error('请输入端口值'));
      } else {
        const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入在[0-65535]之间的端口值'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  // 验证端口是否在[0,65535]之间，非必填,isMust表示是否必填
   isCheckPort(rule, value, callback) {
    if (!value) {
      callback();
    }
    setTimeout(() => {
      if (value == '' || typeof(value) == undefined) {
        //callback(new Error('请输入端口值'));
      } else {
        const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入在[0-65535]之间的端口值'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  
  /* 小写字母*/
   validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
  },
  /*保留2为小数*/
   validatetoFixedNew(str) {
    return str ;
  },
  
  /* 大写字母*/
   validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
  },
  
  /* 大小写字母*/
   validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
  }
}


export default validate
