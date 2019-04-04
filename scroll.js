/**
 * 有html <a href="#" id="backTop" hidden>返回顶部</a>
 * 修改啦
 */

 /***
  * 第一题： 当页面滚动高度超过一屏的时候，上面的“返回顶部，元素显示，
  * 否则隐藏（兼容pc和移动）
  */

  /***
   * window.innerHeight==>body返回窗口的文档显示区的高度
   * document.documentElement.clientHeight ==> 可见区域高度(用于兼容移动端)
   * document.documentElement.scrollTop ==> 获取滚动条位置兼容ie
   * document.body.scrollTop;==> 获取滚动条的位置，不兼容ie
   * window.pageYOffset==> 兼容Safari获取滚动条的位置
   * classList.add('show') ==> 原生js中添加class
   */

  (function() {
    let backTop = document.getElementById('backTop'),
    scrollTop = 0,
    windowHeight = window.innerHeight || document.documentElement.clientHeight;
    let scroll = Throttle((e) => {
      scrollTop = document.documentElement.scrollTop || window.pageYOffset || 
      document.body.scrollTop;
             if (scrollTop >= windowHeight) {
               backTop.classList.add('show');
               console.log('show')
             } else {
               backTop.classList.remove('show');
               console.log('hidden')
              }
          }, 300)
      document.addEventListener('scroll', scroll);
    })();

    //计算当前的滑动
    function Throttle(fn, delay) {
        let last = 0,
        timer = null;
        return function() {
          let context = this,
          args = arguments,
          now = +new Date();
          if (now - last < delay) {
            clearTimeout(timer)
            timer = setTimeout(function() {
               last = now;
               fn.apply(context, args);
            }, delay)
          } else {
            last = now;
           fn.apply(context, args);
          }
        }
      }
