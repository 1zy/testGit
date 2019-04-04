//call()方法
var first = '大黑刀·夜',
    second = '二代鬼彻',
    third = '初代鬼彻',
    fourth = '时雨';

var zoro = {
  first: '和道一文字',
  second: '三代鬼彻',
  third: '雪走',
  fourth: '秋水'
};
function sayYourWeapon(num,num2){
    console.log(`这是我${num}得到的刀"${this[num]}"`)
    console.log(`这是我${num2}得到的刀"${this[num2]}"`)
}
console.log(sayYourWeapon('first', 'third'));
//使用call的方法使sayYourWeapon中的this指向的zoro
console.log(sayYourWeapon.call(zoro,'first', 'third'))  
//使用apply的方法使sayYourWeapon中的this指向的zoro
console.log(sayYourWeapon.apply(zoro,['first','second']))

//bind()方法不会立即指向目标行数而是返回一个原函数，而是返回一个函数的拷贝，并且拥有指定的this值和初始函数
//bind()方法在传参上跟call是一样的，第一个参数是需要绑定的对象，后面一次传入函数的参数
var name = 'Jack Sparrow';

var onePiece = {
    name:'Monkey.D.Luffy'
}

function sayWhoAmI(){
    console.log(this.name)
}

var mySayWhoAmI = sayWhoAmI.bind(onePiece)
mySayWhoAmI()   //Monkey.D.Luffy


