/**
 *正则中的符号 
 *+号：是限定符，加号表示它前面的表达式尽可能地多匹配
  至少匹配一次
 * 
 * 
 */ 
var testSpecs = [
    '在LeanCloud上，数据存储是围绕AVObject进行的。',
    // '今天出去买菜花了 5000元。',
    // '我家的光纤入户宽带有 10Gbps，SSD 一共有 10TB。显示器分辨率宽度是1920px。',
    // '今天是 233 ° 的高温。新 MacBook Pro 有 15 % 的 CPU 性能提升。',
    // '刚刚买了一部 iPhone ，好开心 ！',
    // '她竟然对你说「喵」？！？！？？！！喵？？！！Meow...',
    // '你好，我是破折号——一个不苟言笑的符号。',
    // '核磁共振成像 (NMRI) 是什么原理都不知道? JFGI!',
    // '这件蛋糕只卖 １０００ 元。',
    // '乔布斯那句话是怎么说的？「Stay hungry，stay foolish。」',
    // '推荐你阅读《Hackers＆Painters：Big Ideas from the Computer Age》，非常的有趣。'
];

charCheck(testSpecs.join(''));

function charCheck(str) {
    // 枚举类型的符号
    var symbols = {
        full: '！（）【】『』「」《》“”‘’；：，。？、',
        half: '!-_()[]{}<>"\';:,./?`',
        getRegStr: function(key) {
            var symbols = typeof key === 'string' ? this[key] : (function(that) {
                if (key instanceof Array) {
                    return key.reduce(function(total, cur) {
                        return total += that[cur];
                    }, '');
                }

                return '';
            })(this);

            // 返回符合 regexp 语法的字符串
            return symbols.split('').map(function(s) {
                return '\\' + s;
            }).join('|');
        },
        getRegRule: function(key, usedAs) {
            var strs = this.getRegStr.call(this, 'full');
            var regArr = ['(\\S+)', '([' + strs + '])'];
            var temp = [].concat(regArr);
            temp.reverse();

            if (usedAs === 'rule') {
                return new RegExp(
                    '(:?' + regArr.join('\\s+') + ')|' +
                    '(:?' + temp.join('\\s+') + ')', 'g');
            } else if (usedAs === 'format') {
                return [
                    new RegExp(regArr.join('\\s+'), 'g'),
                    new RegExp(temp.join('\\s+'), 'g')
                ];
            }
        }
    };

    var regExps = [
        {
            rule: /([\u4e00-\u9fa5]+[a-zA-Z]+)|([a-zA-Z]+[\u4e00-\u9fa5]+)/g,
            format: [
                /([\u4e00-\u9fa5]+)([a-zA-Z]+)/g,
                /([a-zA-Z]+)([\u4e00-\u9fa5]+)/g
            ],
            matches: '$1 $2',
            msg: '中英文之间需要增加空格'
        // }, {
        //     rule: /([\u4e00-\u9fa5]+\d+)|(\d+[\u4e00-\u9fa5]+)/g,
        //     format: [
        //         /([\u4e00-\u9fa5]+)(\d+)/g,
        //         /(\d+)([\u4e00-\u9fa5]+)/g
        //     ],
        //     matches: '$1 $2',
        //     msg: '中文与数字之间需要增加空格'
        // }, {
        //     rule: /(\d)([A-Z]+)/g,
        //     matches: '$1 $2',
        //     msg: '数字与大写英文单位之间需要增加空格'
        // }, {
        //     rule: /(\d+)\s+(°|%)/g,
        //     matches: '$1$2',
        //     msg: '° 或 % 与数字之间不需要空格'
        // }, {
        //     rule: symbols.getRegRule('full', 'rule'),
        //     format: symbols.getRegRule('full', 'format'),
        //     matches: '$1$2',
        //     msg: '全角标点与其他字符之间不加空格'
        // }, {
        //     // rule: new RegExp('(' + symbols.getRegStr(['full', 'half']) + ')\\1+', 'g'),
        //     rule: new RegExp('(' + symbols.getRegStr('full') + ')\\1+', 'g'),
        //     matches: '$1',
        //     msg: '不重复使用中文标点符号'
        // }, {
        //     rule: /(\S)(——)(\S)/g,
        //     matches: '$1 $2 $3',
        //     msg: '破折号前后需要增加一个空格'
        // }, {
        //     // 这条必须位于“遇到完整的英文整句、特殊名词，其內容使用半角标点”之前
        //     rule: new RegExp('\\s*(' + symbols.getRegStr('half') + ')\\s*', 'g'),
        //     matches: function(s) {
        //         s = s.replace(/(^\s*)|(\s*$)/g, '');
        //         return String.fromCharCode(s.charCodeAt() + 65248);
        //     },
        //     msg: '使用全角中文标点'
        // }, {
        //     rule: /[\uFF10-\uFF19]/g,
        //     matches: function(s) {
        //         // 半角字符与全角字符的 charCode 相差 65248 
        //         return String.fromCharCode(s.charCodeAt() - 65248);
        //     },
        //     msg: '数字使用半角字符'
        // }, {
        //     // 中文的句号“。”不是全角字符，需要特殊处理
        //     rule: /[《|「](:?\s*[a-zA-Z]+\s*(。|[\uff00-\uffff])*\s*[a-zA-Z]*)+[\.|」|》]/g,
        //     matches: function(s) {
        //         return s.replace(/。|[\uff00-\uffff]/g, function($1) {
        //             var half = String.fromCharCode($1.charCodeAt() - 65248);

        //             if (!!~['&', '-', '+'].indexOf(half)) {  // 需要前后加空格的字符
        //                 half = ' ' + half + ' ';
        //             } else if (!!~[':', ',', ';'].indexOf(half)) {  // 需要后面加空格的字符
        //                 half += ' ';
        //             } else if (half === 'ㄢ') {
        //                 half = '.';
        //             }

        //             return half;
        //         });
        //     },
        //     msg: '遇到完整的英文整句、特殊名词，其內容使用半角标点'
       }
    ];

    var result = str;

    regExps.forEach(function(reg, idx) {
        var format = reg.format;
        var matches = reg.matches;
        var tip = str.match(reg.rule);

        if (tip) {
            console.group('%c' + reg.msg + ' (X)', 'color: red');
            console.log(tip.join('\n'));
            console.groupEnd();

            if (!format) {
                result = result.replace(reg.rule, matches);
            } else if (format instanceof Array) {
                format.forEach(function(fmtReg) {
                    result = result.replace(fmtReg, matches);
                });
            } else if (Object.prototype.toString.call(format) === '[object RegExp]') {
                result = result.replace(format, matches);
            }
        }
    });

    if (result === str) {
        console.log('%c当前文本符合规范 (√)', 'color: green');
        return;
    }

    console.group('按规范格式化后的文本：');
    console.log('%c' + result, 'color: green');
    console.groupEnd();
}