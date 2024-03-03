/*
    项目启动时，全局注入是否支持 webp 的标记位
    补充：这个方法开销不小，需要 100ms 左右，在包含 Vue 代码的 scipt 之前执行这一段代码，避免了阻塞的同时能保证 webpImg 能拿到标记位
*/
const checkWebp = async () => {
	const webpData =
		'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
	const blob = await fetch(webpData).then((r) => r.blob())
	if (
		!window.createImageBitmap ||
		typeof window.createImageBitmap !== 'function'
	) {
		window.isSupportWebp = false
	} else {
		createImageBitmap(blob).then(
			() => {
				window.isSupportWebp = true
			},
			() => {
				window.isSupportWebp = false
			}
		)
	}
}

export default checkWebp
