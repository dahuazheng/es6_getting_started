# ES6

ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，在 2015 年 6 月正式发布

## let 和 const 命令

### let 命令

ES6 新增了 let 命令，用来声明变量。它的用法类似于 var，但是所声明的变量，只在 let 命令所在的代码块内有效。

```js
{
  let a = 1;
  var b = 2;
}

console.log(a) // ReferenceError: a is not defined.
console.log(b) // 2
```

```js
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```
for 循环中的 let 声明的 i 只在本轮有效，其实每轮循环 i 都是一个新的变量

那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量i时，就在上一轮循环的基础上进行计算。

for 循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

### const 命令

const的作用域与let命令相同：只在声明所在的块级作用域内有效。

const声明一个只读的常量。一旦声明，常量的值就不能改变。

```js
const a = 1
a = 2 // TypeError: Assignment to constant variable.
```

const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。

```js
const a = {}
a.name = 'a'
a.name = 'b'

a = {} // TypeError: Assignment to constant variable
```

### let、const 命令与 var 对比

+ 不存在变量提升

```js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

+ 暂时死区

```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

+ 同一个作用域内不允许重复声明

### 块级作用域

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景：

- 内层变量可能会覆盖外层变量

```es6
var date = new Date();

function fun() {
  // 变量提升导致内层的date变量覆盖了外层的date变量
  console.log(date); // undefined
  var date = "2020-9-16";

  // 相当于

  // var date = undefined
  // console.log(date)
  // date = '2020-9-16'
}

fun();
```

- 循环变量泄露为全局变量

```js
var s = "hello";

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```

### 块级作用域和函数声明

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明

```js
// 情况一
if (true) {
  function f() {}
}

// 情况二
try {
  function f() {}
} catch(e) {
  // ...
}
```

但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际都能运行，不会报错。

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。

但是，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

+ 允许在块级作用域内声明函数。
+ 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
+ 同时，函数声明还会提升到所在的块级作用域的头部。

```js
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```

考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

```js
// 块级作用域内部的函数声明语句，建议不要使用
{
  let a = 'secret';
  function f() {
    return a;
  }
}

// 块级作用域内部，优先使用函数表达式
{
  let a = 'secret';
  let f = function () {
    return a;
  };
}
```

ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

```js
// 第一种写法，报错
if (true) let x = 1;

// 第二种写法，不报错
if (true) {
  let x = 1;
}
```

### es6 声明对象的6种方法（包含5的两种）

+ var（es5）
+ function（es5）
+ let
+ const
+ import
+ class

### 顶层对象

顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。

```js
window.a = 1;
a // 1

a = 2;
window.a // 2
```

顶层对象的属性与全局变量是等价的带来几个很大的问题：

+ 无法在编译时就报出变量未声明的错误
+ 程序员很容易不知不觉地就创建了全局变量（比如打字出错）
+ 顶层对象的属性是到处可以读写的，这非常不利于模块化编程
+ window对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的

ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。

### globalThis

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

+ 浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
+ 浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
+ Node 里面，顶层对象是global，但其他环境都不支持。

同一段代码为了能够在各种环境，都能取到顶层对象，现在一般是使用this变量，但是有局限性。

+ 全局环境中，this会返回顶层对象。但是，Node.js 模块中this返回的是当前模块，ES6 模块中this返回的是undefined。
+ 函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined。
+ 不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。但是，如果浏览器用了 CSP（Content Security Policy，内容安全策略），那么eval、new Function这些方法都可能无法使用。

综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。

```js
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

## 变量的解构赋值

### 数组的解构赋值

**基本用法**

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值

```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(foo) // 1
console.log(bar) // 2
console.log(baz) // 3

let [head, ...tail] = [1, 2, 3, 4];
console.log(head) // 1
console.log(tail) // [2, 3, 4]
```

如果解构不成功，变量值等于 undefined

```js
let [foo] = []; // foo -> undefined
let [bar, foo] = [1]; // foo -> undefined
```

不完全解构，即等号左边的模式，只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功

```js
let [a, [b], d] = [1, [2, 3], 4];

// a -> 1
// b -> 2
// d -> 4
```

等号右边不是数组，且不是可遍历的结构

```js
// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```

只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值

```js
let [x, y, z] = new Set(['a', 'b', 'c']);

function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
// sixth -> 5
```

**默认值**

解构赋值可以设置默认值

```js
let [x, y = 'b'] = ['a']; // x -> 'a', y -> 'b'
let [x, y = 'b'] = ['a', undefined]; // x -> 'a', y -> 'b'
```

ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，只有当一个数组成员严格等于undefined，默认值才会生效。

```js
let [x = 1] = [null];
// x -> null
```

默认值可以是一个表达式

```js
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
```

### 对象的解构赋值

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```js
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
// foo -> "aaa"
// bar -> "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
// baz -> undefined
```

嵌套解构赋值

```js
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

// obj -> {prop:123}
// arr -> [true]
```

解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错

```js
// 报错
let {foo: {bar}} = {baz: 'baz'};
```

指定默认值

```js
var {x, y = 5} = {x: 1};
// x -> 1
// y -> 5
```

默认值生效的条件是，对象的属性值严格等于undefined

```js
var {x = 3} = {x: undefined};
// x -> 3

var {x = 3} = {x: null};
// x -> null
```

**注意点**

将已声明的变量用于解构赋值，必须非常小心

```js
let x;
({x} = {x: 1});
```

解构赋值允许等号左边的模式之中，不放置任何变量名

```js
({} = [true, false]);
({} = 'abc');
({} = []);
```

由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构

```js
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

### 字符串的解构赋值

```js
const [a, b, c, d, e] = 'hello';
// a -> "h"
// b -> "e"
// c -> "l"
// d -> "l"
// e -> "o"
```

```js
let {length : len} = 'hello';
// len -> 5
```

### 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象

```js
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

### 函数参数解构赋值

```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

```js
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

### 圆括号问题

不能使用圆括号的情况

