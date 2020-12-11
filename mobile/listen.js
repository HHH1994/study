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