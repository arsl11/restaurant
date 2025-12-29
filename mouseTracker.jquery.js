(function ($) {
	const instances = new WeakMap();

	const defaults = {
		checkInterval: 30,   
		sendInterval: 3000,  
		url: '/track-mouse'  
	};

	class MouseTracker {
		constructor(element, options) {
			this.element = $(element);
			this.options = $.extend({}, defaults, options);
			this.points = [];
			this.checkTimer = null;
			this.sendTimer = null;
			this.lastPosition = null;
			this.lastTime = null;
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
				time: Date.now()
			};
		}

		collectData() {
			if (!this.lastPosition || !this.isTracking) return;

			const currentTime = Date.now();

			if (!this.lastTime || this.lastTime !== this.lastPosition.time) {
				const relativeX = this.lastPosition.x - this.elementOffset.left;
				const relativeY = this.lastPosition.y - this.elementOffset.top;

				if (relativeX >= 0 && relativeX <= this.elementWidth &&
					relativeY >= 0 && relativeY <= this.elementHeight) {

					this.points.push({
						x: Math.round(relativeX),
						y: Math.round(relativeY),
						time: currentTime,
						duration: 0
					});

					this.lastTime = this.lastPosition.time;
				}
			} else if (this.points.length > 0) {
				const lastPoint = this.points[this.points.length - 1];
				lastPoint.duration = currentTime - lastPoint.time;
			}
		}

		sendData(force = false) {
			if (this.points.length === 0 && !force) return;

			const pointsToSend = [...this.points];

			this.points = [];

			console.log(pointsToSend);
		}

		updateOptions(newOptions) {
			this.options = $.extend({}, this.options, newOptions);

			if (this.isTracking) {
				this.stop();
				this.start();
			}
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
})(jQuery);


$(document).ready(function() {
    $('.container').trackCoords({
        url: '/api/track-mouse',
        checkInterval: 30,
        sendInterval: 3000
    });
});