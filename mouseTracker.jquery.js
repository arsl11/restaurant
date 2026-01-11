(function ($) {
	const instances = new WeakMap();

	const DEFAULTS = Object.freeze({
		checkInterval: 30,
		sendInterval: 3000,
		url: '/save.php'
	});

	function validateAndNormalizeOptions(options, prev={}) {
		const result = { ...DEFAULTS, ...prev };

		if (!options || typeof options !== 'object') {
			return result;
		}


		if (options.checkInterval) {
			const checkInterval = Number(options.checkInterval);

			if (!isNan(checkInterval) && checkInterval >= 0) {
				result.checkInterval = Math.floor(checkInterval);
			}
		}

		if (options.sendInterval) {
			const sendInterval = Number(options.sendInterval);

			if (!isNaN(sendInterval) && sendInterval >= 0) {
				result.sendInterval = Math.floor(sendInterval);
			}
		}

		if (result.sendInterval < result.checkInterval) {
			result.sendInterval = result.checkInterval * 2;
		}

		if (options.url) {
			if (typeof options.url === 'string') {
				result.url = options.url.trim();
			}
		}

		return result;
	}

	class MouseTracker {
		constructor(element, options) {
			this.element = $(element);
			this.options = validateAndNormalizeOptions(options);
			this.points = [];
			this.checkTimer = null;
			this.sendTimer = null;
			this.lastPosition = null;
			this.lastId = null;
			this.isTracking = false;

			this.handleMouseMove = this.handleMouseMove.bind(this);
			this.collectData = this.collectData.bind(this);
			this.sendData = this.sendData.bind(this);

			this.init();
		}

		init() {
			if (this.element.length === 0) {
				return;
			}

			this.elementOffset = this.element.offset();
			this.elementWidth = this.element.width();
			this.elementHeight = this.element.height();

			this.start();
		}

		start() {
			if (this.isTracking) return;

			this.isTracking = true;

			this.checkTimer = setInterval(this.collectData, this.options.checkInterval);

			this.sendTimer = setInterval(this.sendData, this.options.sendInterval);

			this.element.on('mousemove.tracker', this.handleMouseMove);
		}

		stop() {
			if (!this.isTracking) return;

			this.isTracking = false;

			if (this.checkTimer) clearInterval(this.checkTimer);
			if (this.sendTimer) clearInterval(this.sendTimer);

			this.element.off('mousemove.tracker');

			if (this.points.length > 0) {
				this.sendData(true);
			}
		}

		handleMouseMove(event) {
			this.lastPosition = {
				x: event.clientX,
				y: event.clientY,
				id: Date.now()
			};
		}

		collectData() {
			if (!this.lastPosition || !this.isTracking) return;

			const currentId = Date.now();

			if (!this.lastId || this.lastId !== this.lastPosition.id) {
				const relativeX = this.lastPosition.x - this.elementOffset.left;
				const relativeY = this.lastPosition.y - this.elementOffset.top;

				if (relativeX >= 0 && relativeX <= this.elementWidth &&
					relativeY >= 0 && relativeY <= this.elementHeight) {

					this.points.push({
						x: Math.round(relativeX),
						y: Math.round(relativeY),
						id: currentId,
						duration: 0
					});

					this.lastId = this.lastPosition.id;
				}
			} else if (this.points.length > 0) {
				const lastPoint = this.points[this.points.length - 1];
				lastPoint.duration = currentId - lastPoint.id;
			}
		}

		sendData(force = false) {
			if (this.points.length === 0 && !force) return;

			const pointsToSend = [...this.points];

			// const data = {
			// 	points: pointsToSend
			// };

			// if (this.options.url) {
			// 	$.ajax({
			// 		url: this.options.url,
			// 		type: 'POST',
			// 		data: JSON.stringify(data),
			// 		contentType: 'application/json',
			// 		timeout: 5000,
			// 		success: function (response) {
			// 			console.log('Data sent successfully');
			// 		},
			// 		error: function (xhr, status, error) {
			// 			console.error('Failed to send data', error);

			// 			// Сохраняем данные для повторной отправки
			// 			this.points = [...pointsToSend, ...this.points];
			// 		}.bind(this)
			// 	});
			// }

			this.points = [];

			console.log(pointsToSend);
		}

		updateOptions(newOptions) {
			this.options = validateAndNormalizeOptions(newOptions, this.options);

			if (this.isTracking) {
				this.stop();
				this.start();
			}

			return this;
		}
	}

	$.fn.trackCoords = function (options) {
		return this.each(function () {
			if (instances.has(this)) {
				const tracker = instances.get(this);
				tracker.updateOptions(options || {});
				return;
			}

			const tracker = new MouseTracker(this, options);
			instances.set(this, tracker);
		});
	};

	$.fn.trackCoordsStop = function () {
		return this.each(function () {
			if (instances.has(this)) {
				instances.get(this).stop();
			}
		});
	};

})(jQuery);


$(document).ready(function () {
	$('.container').trackCoords();
	$('container').trackCoordsStop()
});