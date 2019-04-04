/**
 * 正则表达式中的符号：
 * $1$2代表的第一个小括号中的正则([\u4e00-\u9fa5]+)->$1([a-zA-Z]+)->$2第二个正则
 * 加号+表示1个或多个。
 * 问号?表示1个或0个。
 * 星号*表示任意数量。
 * 花括号{}可以指定数量，例如{2}表示2个，{2, 6}表示2-6个，{2,}表示2个或2个以上。
 * \S表示非空字符
 * 
 * reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
 * 
 */

var testSpaces = [
    '在LeanCloud上，数据存储是围绕AVObject进行的。',
    '今天出去买菜花了 5000元。',
    '我家的光纤入户宽带有10Gbps，SSD 一共有10TB。显示器分辨率宽度是1920px',
    '今天是 233 ° 的高温。新 MacBook Pro 有 15 % 的 CPU 性能提升。',
    '她竟然对你说「喵」？！？！？？！！喵？？！！Meow...',
    '刚刚买了一部 iPhone ，好开心 ！',
    '你好，我是破折号——一个不苟言笑的符号。',
    '这件蛋糕只卖 １０００ 元。',
    '推荐你阅读《Hackers＆Painters：Big Ideas from the Computer Age》,非常的有趣。'
]
charCheck(testSpaces.join(''))
function charCheck(str){
    //特殊字符的正则
    var symbols = {
       //全角字符的匹配（中文字符）
       full:'！（）【】『』「」《》“”‘’；：，。？、',
       //英文字符
       half:'!-_()[]{}<>"\';:,./?`',
       getRegStr: function(key){
           var symbols = typeof key === 'string'?this[key]:(function(that){
               if(key instanceof Array){
                   return key.reduce(function(total,cur){
                       return total += that[cur]
                   },'')
               }
               
               return ''
           })(this);

           //返回符合的 regexp语法的字符串(对full的字符串进行分割)
           return symbols.split('').map(function(s){
               return '\\' + s;
           }).join('|')
       },

       getRegRule:function(key,usedAs){
           var strs = this.getRegStr.call(this,'full');
           var regArr = ['(\\S+)','(['+strs+'])'];
           var temp = [].concat(regArr);
           temp.reverse()  //反转
        
           if(usedAs === 'rule'){
               return new RegExp(
                '(:?' + regArr.join('\\s+') + ')|' +
                '(:?' + temp.join('\\s+') + ')', 'g');
           }else if(usedAs === 'format'){
               return [
                   new RegExp(regArr.join('\\s+'),'g'),
                   new RegExp(temp.join('\\s+'),'g')
               ]
           }
       }
    }

    var RegExps = [
        {
            rule:/([\u4e00-\u9fa5][a-z]|[a-z][\u4e00-\u9fa5])/gi,
            format:[
                /([\u4e00-\u9fa5])([a-z])/gi,
                /([a-z])([\u4e00-\u9fa5])/gi
            ],
            matches:'$1 $2',  //替换成有空格的
            msg:'中英文间需要增加空格'
        },
        {
           rule:/([\u4e00-\u9fa5]\d)|(\d\[u4e00-\u9fa5])/g,
           format:[
               /([\u4e00-\u9fa5])(\d)/g,
               /(\d)([\u4e00-\u9fa5])/g
           ],
           matches:'$1 $2',
           msg:'中文和数字之间添加空格'
        },
        {
            rule:/(\d)([A-Z])/g,
            matches:'$1 $2',
            msg:'数字和大写英文单位之间需要添加空格'
        },
        {
            rule:/(\d)\s+(°|%)/g,
            matches:'$1$2',
            msg: '° 或 %与数字之间不需要空格'
        },
        {
            //\1表示匹配第一个标点
           rule: new RegExp('(' + symbols.getRegStr('full') + ')\\1+', 'g'),
           matches:'$1',
           msg:'不使用重复的中文标点符号'
        },
        {
            rule:symbols.getRegRule('full','rule'),
            format: symbols.getRegRule('full','format'),
            matches:'$1$2',
            msg:'全角标点与其他字符之间不加空格'
        },
        {
            rule:/(\S)(——)(\S)/g,
            matches:'$1 $2 $3',
            msg:'破折号前后需要添加一个空格'
        },
        {
            rule:/[\uFF10-\uFF19]/g,  //匹配0-9的数字
            matches:function(s){
                //半角字符和全角字符差65248个字符
                return String.fromCharCode(s.charCodeAt()-65248)
            },
            msg:'数字使用半角字符'
        },
        {
            rule: new RegExp('\\s*(' + symbols.getRegStr('half') + ')\\s*', 'g'),
            matches:function(s){
                s = s.replace(/(^\s*)|(\s*$)/g,'')
                return String.fromCharCode(s.charCodeAt()+65248)
            },
            msg:'使用全角中文标点'
        },
        {
                // 中文的句号“。”不是全角字符，需要特殊处理
                rule: /[《|「](:?\s*[a-zA-Z]+\s*(。|[\uff00-\uffff])*\s*[a-zA-Z]*)+[\.|」|》]/g,
                matches: function(s) {
                    return s.replace(/。|[\uff00-\uffff]/g, function($1) {
                        var half = String.fromCharCode($1.charCodeAt() - 65248);
    
                        if (!!~['&', '-', '+'].indexOf(half)) {  // 需要前后加空格的字符
                            half = ' ' + half + ' ';
                        } else if (!!~[':', ',', ';'].indexOf(half)) {  // 需要后面加空格的字符
                            half += ' ';
                        } else if (half === 'ㄢ') {
                            half = '.';
                        }
    
                        return half;
                    });
                },
                msg: '遇到完整的英文整句、特殊名词，其內容使用半角标点'
           }
    ]
    var result = str;
    RegExps.forEach(function(reg,idx){
        var format = reg.format;
        var matches = reg.matches;
        var tip = str.match(reg.rule);
        if(tip){
           if(!format){
               result = result.replace(reg.rule,matches)
           } else if(format instanceof Array){
               format.forEach(function(fmtReg){
                   result = result.replace(fmtReg,matches);
               })
           }else if(Object.prototype.toString.call(format)==='[object RegExp]'){
               console.log('a')
               console.log(Object.prototype.toString.call(format))
               result = result.replace(format,matches)
           }
        }
    })
    console.log(result)
}