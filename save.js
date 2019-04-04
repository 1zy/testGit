/**
 * 函数防抖：是指频繁触发的情况下，只有足够的空闲时间，才执行代码一次
 * 
 * 应用场景：手机号码验证和邮箱验证，只要等用户输入完毕后，前端才需要检查格式是否正确
 * 如果不正确，再弹出提示语
 * 
 * 函数防抖也是需要一个setTimeout来辅助实现，延迟执行需要跑代码
 * 如果方法多次触发，则把上次记录的延迟执行代码用clearTimeout清掉
 * 如果计时完毕，没有方法进来访问触发，则执行代码
 * 
 * 松开滚动300ms后执行，未松开滚动如果超过300ms则在300ms时执行
 */

 var timer = false;
 document.getElementById("throttle").onscroll = function(){
     clearTimeout(timer);
     console.log(timer)
     timer = setTimeout(function(){
         console.log("函数防抖")
     },300);
 };