var uQuery = location.search ? location.search.replace("?", "").split("&") : [],
	temp = {},
	qrcode, QrCode;
/*
 *预处理
 */
uQuery.forEach((e) => {
	e = e.split("=");
	temp[e[0]] = e[1];
})
uQuery = temp;

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
	$(".logo").hide();
	$(".menu").hide();
	$("hr").hide();
	$("aside.create input").hide();
	$("#qrcode img").css({
		"height": "min(calc(100vw - 130px),calc(100vh - 130px))",
		"width": "min(calc(100vw - 130px),calc(100vh - 130px))"
	})
	$("#qrcode").click(() => {
		$("#qrcode img").css({
			"height": "",
			"width": ""
		})
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
		$(`<a download="qrcode.png" href="${$("#qrcode img")[0].src}"></a>`)[0].click();
	} else {
		alert("二维码不存在");
	}
}
// 扫一扫
function sweep() {
	$("#result").val('');
	QrCode.sweep();
	$("#canvas").click(() => {
		QrCode.cance();
		$("#canvas").unbind("click")
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
		seuccess: function(res) {
			// 识别成功反馈
			$("#result").val(res.data);
			if (/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
				.test(res.data.trim()) && !/javascript:|js:/i.test(res.data)) {
				$(".main .reader .result_url span").html(
					`<a target="_blank" href="${res.data.trim()}">${res.data.trim()}</a>`);
				if ($("#url_auto_jump").prop("checked")) {
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
	$("#url_auto_jump").prop("checked", localStorage.getItem("url_auto_jump") === "on" ? true : false);
	$("#url_auto_jump").click(() => {
		localStorage.setItem("url_auto_jump", $("#url_auto_jump").prop("checked") ? "on" : "off");
	})
	if (uQuery.url) {
		uQuery.url = decodeURIComponent(uQuery.url);
		$("#code").val(uQuery.url);
		create();
		if (uQuery.fullscreen) {
			fullscreen();
		}
	} else if (uQuery.mode) {
		if (uQuery.mode === "create") {
			$("nav[tar=create]").click();
		} else if (uQuery.mode === "reader" || uQuery.mode === "scan") {
			$("nav[tar=reader]").click();
			if (uQuery.autoJump) {
				$("#url_auto_jump").prop("checked", uQuery.autoJump === "on" ? true : false);
			}
			if (uQuery.mode === "scan") {
				sweep();
			}
		}
	}
})
