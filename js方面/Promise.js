/**
 * Created by HHH on 2018/11/6.
 */
/*异步promise专题*/
/**
 * resolve 回调函数可以携带入参,在使用then接收回调的时候,可以获取入参。
 * resolve 入参如果是一个promise对象的话,那么只有这个promise对象状态是reslove才能够获取回调。
 */

const PENDING = 'pending';
const RESOLVED = 'fullfilled';
const REJECTED = 'rejected';


/**
 * 1. 有状态，状态不可回退
 * 2. 观察者模式清楚收集then方法的回调
 * 3. 初始化对象时入参接受一个方法，方法可接受2个入参reslove, reject
 */
function MyPromise(executor) {
    this.status = PENDING;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    this.value;
    this.reason;

    const resolve = (function (value) {
        this.value = value;
        if (this.status === PENDING) {
            this.status = RESOLVED;
        }
        this.resolveCallbacks.forEach(function (cb) {
            cb(value);
        });
    }).bind(this);

    const rejected = (function (reason) {
        this.reason = reason;
        if (this.status === PENDING) {
            this.status = REJECTED;
        }
        this.rejectCallbacks.forEach(function (cb) {
            cb(reason);
        });
    }).bind(this);

    executor(resolve, rejected);
}


/**
 * 处理then回调中promise对象
 * @param {*} newPromise then要返回的promsie实例
 * @param {*} res then回调返回的结果
 * @param {*} resolve newPromise实例的resolve
 * @param {*} reject newPromise实例的reject
 */
function resolvePromise(newPromise, res, resolve, reject) {
    // 防止promise中断，如果res是newPromise的话then.call方法一直不会执行，因为newPromise的状态一直为pending
    if (newPromise === res) {
        throw Error('重复引用'); 
    }
    if (typeof res === 'function' || (typeof res !== null && typeof res === 'object')) {
        try {
            const then = res.then;
            // 如果then是一个方法
            if (typeof then === 'function') {
                // 返回的对象如果是一个promise，执行他的then方法，将promise的resolve值递归传newPromise的resolve
                // 如何会造成无限回调, res是一个promise并且res这个promise的value是自己
                then.call(res, function (value) {
                    resolvePromise(newPromise, value, resolve, reject);
                }, function (reason) {
                    reject(reason);
                })
            } else {
                resolve(res)
            }
        } catch (e) {
            reject(e);
        }

    } else {
        resolve(res);
    }
}

/**
 * then方法定义规则
 * 1. 返回一个新的promise, 通过控制新的promise的resolve方法执行timing来实现then回调中值的传递
 * 2. 方法接受一个参数，参数必须为一个function否则穿透
 * 3. 如果回调返回的是一个promise对象的话，使用这个promise对象
 */
MyPromise.prototype.then = function (onFullfilled, onRejected) {
    // rule3
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : function (data) { return data; };
    onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { return reason; };

    const self = this;
    const promise2 = new MyPromise(function (resolve, reject) {
        if (self.status === PENDING) {
            self.resolveCallbacks.push(function () {
                // 设置setTimeout主要是为了保证promise2实例初始化完成后再调用resolvePromise方法
                setTimeout(function() {
                    const x = onFullfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                }, 0);
            });

            self.rejectCallbacks.push(function () {
                setTimeout(function() {
                    const x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                }, 0);
            })
        }

        if (self.status === RESOLVED) {
            setTimeout(function() {
                const x = onFullfilled(self.value);
                resolvePromise(promise2, x, resolve, reject);
            }, 0);
        }

        if (self.status === REJECTED) {
            setTimeout(function() {
                const x = onRejected(self.reason);
                resolvePromise(promise2, x, resolve, reject);
            }, 0);
        }
    });

    return promise2;
}


MyPromise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value);
    });
}

MyPromise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason);
    });
}

/**
 * 将多个promise包装成一个promise
 * rule:
 *  1. values所有的Promise的状态变为fullfilled，all返回的promise对象才会变成fullfilled
 *  2. values中有一个promise的状态变为rejected，all返回的promise对象就会是rejected
 *  3. 当都为fullfiled时候，将所有的value放入一个array返回(resolve([]))
 * @param {*} values 
 */
MyPromise.all = function(values) {}

/**
 * rule：
 *  1. 其中一个promise状态变为fullfilled后，包装后的promise就会改变状态为fullfilled并且以
 *     率先改变的这个promise的value作为resolve的值
 * @param {*} values 
 */
MyPromise.race = function (values) {}