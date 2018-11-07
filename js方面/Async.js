/**
 * Created by HHH on 2018/11/6.
 */
/* case 1*/
/*async function a(){
    console.log("a");
//   const q =  await b();
    await backPromise();
    console.log(5);
}

async function b(){
    console.log("b")
    return 3;
}

function backPromise(){
    return new Promise(res=>{
        console.log("backPromise");
        res(1);
    });
}
a();
new Promise(function(res){console.log("n");res(2);}).then(function(r){
    console.log("n end");
});*/

/* 注意:await backPromise();先是执行backPromise方法，返回一个Promise对象。await让出线程,然后将promise对象加入队列,
退出a()。接着执行一个new Promise,并将其resolve加入队里。回到队列promise对象，对象产生的resolve()进入队列。回到显示声明的
promise对象的resolve()。最后执行bcakPromise返回的promise对象的resolve(),接着执行await后面的代码。*/



async function a(){
    console.log("a");
    var d = await new Promise(res=>{
        console.log("backPromise");
        res(2);
    });
    console.log(d);
    console.log(5);
}

async function b(){
    console.log("b");
    return 3;
}

function backPromise(){
    return new Promise(res=>{
        console.log("backPromise time is "+ new Date().toString());
        res(1);
    });
}
a();
new Promise(function(res){console.log("n");res(2);}).then(function(r){
    console.log("n end");
});

