/**
 * Created by HHH on 2018/11/6.
 */
/*异步promise专题*/
/**
 * resolve 回调函数可以携带入参,在使用then接收回调的时候,可以获取入参。
 * resolve 入参如果是一个promise对象的话,那么只有这个promise对象状态是reslove才能够获取回调。
 */
var pro = new Promise((resolve,reject)=>{
    //条件，执行resolve
    resolve(12);
    //否则reject
});

var pro2 = new Promise((resolve,reject)=>{
    resolve(pro);
});

function test(){
    return pro2;
}
//test().then((res)=>{console.log(res+1);return pro2;}).then(res=>{console.log(res)});

// es5实现promise
function MyPromise(fn){
    this.status = "pending";
    this.resolveFn=function(){};
    this.rejectFn = function(e){};
    fn(this.resolve.bind(this),this.reject.bind(this));
}

MyPromise.prototype.resolve = function(data){
    if(this.status=="pending"){
        this.status = "resolved";
        var self = this;
        setTimeout(function(){
            self.resolveFn(data);
        },0);
    }
};
MyPromise.prototype.reject = function(data){
    console.log("reject>>>>>");
    if(this.status=="pending"){
        this.status = "reject";
        var self = this;
        setTimeout(function(){
            self.rejectFn(data);
        },0);
    }
};
MyPromise.prototype.then = function (res,rej) {
        this.resolveFn = res;
        this.rejectFn =rej;


};

var p = new MyPromise(function(res,rej){
    res(2);
    //rej("错误");
});
p.then(function(data){
    console.log(data);
},function(err){
    console.log("err is"+err);
});

/* promise.all用法*/
var p2 = Promise.all([
    new Promise((res,rej)=>{res(1);}),
    new Promise((res,rej)=>{res(2);}),
    new Promise((res,rej)=>{res(3);})
]);

p2.then(res=>{console.log(res)});