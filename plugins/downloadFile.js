function downloadFile(fileUrl, fileName) {
	//iOS devices do not support downloading. We have to inform user about this.
	if(/(iP)/g.test(navigator.userAgent)) {
		alert('Your device does not support files downloading. Please try again in desktop browser.');
		return false;
	}

	//谷歌和Safari
	if(getBrowserType() === "Chrome" || getBrowserType() === "Safari") {
		//Creating new link node.
		var link = document.createElement('a');
		link.href = fileUrl;
		if(link.download !== undefined) {
			link.download = fileName;
		}
		//Dispatching click event.
		if(document.createEvent) {
			var e = document.createEvent('MouseEvents');
			e.initEvent('click', true, true);
			link.dispatchEvent(e);
			return true;
		}
	}
	//IE浏览器
	if(getBrowserType() === "IE") {
//		var a = document.createElement("a");
//		a.href=fileUrl;
//		a.download = fileName;
//		a.click();
		window.location = fileUrl;
		return true;
	}
	//火狐浏览器
	if(getBrowserType() === "Firefox"){
//		var a = document.createElement("a");
//		a.href=fileUrl;
//		a.download = fileName;
//		a.click();
		window.location = fileUrl;
		return true;
	}
}

function getBrowserType() {
	var browserStr = "";
	if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		browserStr = "Chrome";
	} else if(navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
		browserStr = "Safari";
	} else if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || navigator.userAgent.toLowerCase().indexOf('Firefox') > -1) {
		browserStr = "Firefox";
	} else if(!!window.ActiveXObject || "ActiveXObject" in window) {
		//ie   "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"
		browserStr = "IE"
	}
	return browserStr;
}
window.downloadFile = downloadFile;