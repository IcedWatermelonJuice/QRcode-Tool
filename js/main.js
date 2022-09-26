var uQuery = location.search ? location.search.replace("?", "").split("&") : [],
	temp = {},
	qrcode, QrCode;
/*
 *query请求预处理
 */
uQuery.forEach((e) => {
	e = e.split("=");
	temp[e[0]] = e[1];
})
uQuery = temp;
if (uQuery.darkMode === "true" || (uQuery.darkMode === "auto" && window.matchMedia("(prefers-color-scheme: dark)")
		.matches)) {
	$("html").addClass("dark");
}

/*
 *功能函数
 */
// 生成
function create() {
	qrcode.clear();
	qrcode.makeCode($('#code').val());
};
//全屏
function fullscreen() {
	changeURL("qrcode");
	$(".logo").hide();
	$(".menu").hide();
	$("hr").hide();
	$("aside.create input").hide();
	$("#qrcode img").attr("fullscreen","");
	$("#qrcode canvas").attr("fullscreen","");
	$("#qrcode").click(() => {
		changeURL("");
		$("#qrcode img").removeAttr("fullscreen");
		$("#qrcode canvas").removeAttr("fullscreen");
		$(".logo").show();
		$(".menu").show();
		$("hr").show();
		$("aside.create input").show();
		$("#qrcode").unbind("click");
	})
}
//下载
function download() {
	if ($("#qrcode img")[0]) {
		$(`<a download="qrcode.png" href="${$("#qrcode canvas")[0].toDataURL("image/png")}"></a>`)[0].click();
	} else {
		alert("二维码不存在");
	}
}
// 扫一扫
function sweep() {
	changeURL("scan");
	$("#result").val('');
	QrCode.sweep();
	$(".canvas-bg").show();
	$("#canvas").click(() => {
		changeURL("");
		QrCode.cance();
		$(".canvas-bg").hide();
		$("#canvas").unbind("click");
	})
};
// 从相册选择
function upload() {
	$("#result").val('');
	QrCode.upload();
};
// 复制结果
function copy() {
	$("#result").select();
	document.execCommand("Copy");
	alert("已复制到剪贴板");
}
// 更改地址栏URL参数
function changeParam(param, value, url) {
	url = url || location.href;
	var reg = new RegExp("(^|)" + param + "=([^&]*)(|$)");
	var tmp = param + "=" + value;
	return url.match(reg) ? url.replace(eval(reg), tmp) : url.match("[?]") ? url + "&" + tmp : url +
		"?" + tmp;
}
function changeURL(page){
	if(page){
		history.pushState(null, document.title, changeParam("page", page));
	}else{
		history.replaceState(null, document.title, location.origin + location.pathname);
	}
}
// 监听返回按钮
window.addEventListener("popstate", function() {
	if ($(".canvas-bg").is(":visible") && $("#canvas").is(":visible")) {
		$("#canvas").click();
	}
	if($("#qrcode img[fullscreen]").is(":visible")||$("#qrcode canvas[fullscreen]").is(":visible")){
		$("#qrcode").click();
	}
})
/*
 *主程序
 */
$("body").ready(() => {
	qrcode = new QRCode($("#qrcode")[0], {
		text: "请在这里输入要生成的内容！",
		width: 300,
		height: 300,
		colorDark: "black",
		colorLight: "white",
		correctLevel: QRCode.CorrectLevel.H
	});
	QrCode = new QrCodeRecognition({
		sweepId: '#canvas',
		uploadId: '#file',
		error: function(err) {
			// 识别错误反馈
			$("#result").val(err);
		},
		success: function(res) {
			// 识别成功反馈
			$("#result").val(res.data);
			if (/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
				.test(res.data.trim()) && !/javascript:|js:/i.test(res.data)) {
				$(".main .reader .result_url span").html(
					`<a target="${uQuery.autoClose==="true"?"_self":"_blank"}" href="${res.data.trim()}">${res.data.trim()}</a>`
				);
				if ($("#url_auto_jump").prop("checked") && !(RegExp(location.hostname, "i").test(res
						.data) && /autoJump=true/i.test(res.data))) {
					$(".main .reader .result_url a")[0].click();
				}
			} else {
				$(".main .reader .result_url span").html("");
			}
		}
	});
	$("nav").click((e) => {
		e = $(e.target);
		$("nav").removeClass("active");
		e.addClass("active");
		$(`aside:not(.${e.attr("tar")})`).hide();
		$(`aside.${e.attr("tar")}`).show()
	})
	$("#url_auto_jump").prop("checked", localStorage.getItem("url_auto_jump") === "true" ? true : false);
	$("#url_auto_jump").click(() => {
		localStorage.setItem("url_auto_jump", $("#url_auto_jump").prop("checked"));
	})
	if (uQuery.url) {
		uQuery.url = decodeURIComponent(uQuery.url);
		$("#code").val(uQuery.url);
		create();
		if (uQuery.fullscreen === "true") {
			fullscreen();
		}
	} else if (uQuery.mode) {
		if (uQuery.mode === "create") {
			$("nav[tar=create]").click();
		} else if (uQuery.mode === "reader" || uQuery.mode === "scan") {
			$("nav[tar=reader]").click();
			if (uQuery.autoJump) {
				$("#url_auto_jump").prop("checked", uQuery.autoJump === "true" ? true : false);
			}
			if (uQuery.mode === "scan") {
				sweep();
			}
		}
	}
})
