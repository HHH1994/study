/**------------------ 滚动监听--------------------- */
/**
 * 	window.onscroll   document.body.onscroll  document.querySelector(el).onscroll
 * 1. 假如子元素内容的总高度超出了window.innerHeight, 此时用window.onscroll可以监听到窗口的滚动。
 * 		可以使用document.body.onscroll监听。
 *    window.onscroll 与 document.onscroll指向的是同一个引用地址
 * 	
 * 
 * 2. 如果文档流中某个元素作为容器进行滚动，在设置overflow: auto/scroll的同时需要给自身赋值高度，当内容的高度大于设置的高度会有滚动效果。
 * 
 */
/**
 * 监听iframe中的滚动，判断是否到达底部
 * case 1: 监听touchmove
 *    case 1.1:  底部设置一个el, 通过getBoundingClientRect获取el.bottom。
 *               比较el.bottom与iframe包裹的window的clientHeight的差值
 *    case 1.2:  使用window.pageYOffset 
 * 
 * * case 2: 监听scroll事件（移动端存在兼容性问题）
 */
function listenScroll(el, totalHeight = 0) {
  const clientH = document.documentElement.clientHeight;

  // case 1.1
	window.addEventListener('touchmove', function() {
	  const bEl = el.getBoundingClientRect();
	  console.log(clientH);
	  if (bEl.y - clientH < 5) {
	    console.log('到底了');
	  }
  });
  
  // case 1.2
  window.addEventListener('touchmove', function() {
    const bEl = window.pageYOffset;
    console.log(clientH);
	  if (bEl + clientH >= totalHeight) {
	    console.log('到底了');
	  }
  });
}