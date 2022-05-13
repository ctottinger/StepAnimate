const EventEmitter = require("events").EventEmitter;

class StepAnimate extends EventEmitter {
	constructor(config) {
		super();
		this.steps = [];
		this.pointType = "";
		this.timerRef = null;
		this.dividedDeltas = {};
		this.roundConfig = true;

		this.stepTime = 0;
		this.numberOfSteps = 0;
		[this.startPoint, this.endPoint, this.startKeys] = [config.start, config.end, Object.keys(config.start)];
		this.duration = config.duration;

		this.round = (value, up) => {
			if (this.roundConfig) {
				if (up) return Math.ceil(value);
				return Math.floor(value);
			}
			return value;
		};

		this.stepTime = config.stepTime;
		this.numberOfSteps = Math.floor(this.duration / this.stepTime);

		if ("round" in config && config.round === false) this.roundConfig = false;

		if (typeof config.duration !== "number") throw new Error("Duration is not a number");

		if ("stepTime" in config && "numberOfSteps" in config) throw new Error("Can't set step time AND number of");

		if ("stepTime" in config === false || typeof config.stepTime !== "number") throw new Error("Step timing in ms is required");

		if (typeof config.start === "object") {
			if (typeof config.end !== "object") throw new Error("Start & end type don't match");
			this.pointType = "object";
		} else if (typeof config.start === "number") {
			if (typeof config.end !== "number") throw new Error("Start & end type don't match");
			this.pointType = "number";
		} else throw new Error("Start & end must be objects or ints");

		if (this.pointType == "object") {
			this.validateObjectPoints();
			Object.entries(this.startPoint).forEach((value, index) => {
				const d = (value[1] - this.endPoint[value[0]]) * -1;
				this.dividedDeltas[index] = d / this.numberOfSteps;
			});
		} else {
			[this.startPoint, this.endPoint] = [{ val: config.start }, { val: config.end }];
			const d = (this.startPoint.val - this.endPoint.val) * -1;
			this.dividedDeltas[0] = d / this.numberOfSteps;
		}

		const computeSteps = () => {
			const computedSteps = [];
			const naturalSteps = [];

			const hardCeil = (base, modify, ceil, goingUp) => {
				if (base === ceil) return ceil;
				const op = base + modify;
				if (goingUp && op >= ceil) return ceil;
				if (!goingUp && op <= ceil) return ceil;
				const rounded = this.round(op, goingUp);
				return rounded;
			};

			if (this.pointType == "object") {
				let values = Object.entries(this.startPoint);

				for (let step = 0; step < this.numberOfSteps; step++) {
					const step = {};

					values = values.map((val, index) => {
						let goingUp = true;
						if (this.dividedDeltas[index] < 0) goingUp = false;
						let re = hardCeil(val[1], this.dividedDeltas[index], this.endPoint[val[0]], goingUp);
						step[val[0]] = re;
						return [val[0], re];
					});
					computedSteps.push(step);
				}
			} else {
				let values = this.startPoint;

				let goingUp = true;
				if (this.dividedDeltas[0] < 0) goingUp = false;

				for (let step = 0; step < this.numberOfSteps; step++) {
					const op = hardCeil(values.val, this.dividedDeltas[0], this.endPoint.val, goingUp);
					values = {
						val: op,
					};
					naturalSteps.push(op);
					computedSteps.push(values);
				}
			}

			this.steps = computedSteps;
			const sentData = this.pointType === "number" ? naturalSteps : computedSteps;
			this.emit("computed", sentData);
		};

		this.loaded = new Promise((resolve) => {
			computeSteps();
			resolve();
		});

		return this;
	}

	validateObjectPoints() {
		const [validatedStart, validatedEnd] = [{}, {}];
		const [start, end] = [this.startPoint, this.endPoint];
		let isEmpty = true;

		this.startKeys.forEach((key) => {
			if (key in end && typeof start[key] === "number" && typeof end[key] === "number") {
				validatedStart[key] = start[key];
				validatedEnd[key] = end[key];
				isEmpty = false;
			}
		});
		if (isEmpty) {
			throw new Error("No valid data for start/stop");
		}
		[this.startPoint, this.endPoint] = [validatedStart, validatedEnd];
	}

	sendStep(step) {
		if (this.pointType === "number") step = step.val;
		this.emit("step", step);
	}

	stop() {
		clearInterval(this.timerRef);
		this.timerRef = null;
		this.emit("ended", this.endPoint);
	}

	async start() {
		await this.loaded;
		this.emit("start", this.steps[0]);
		this.sendStep(this.steps[0]);
		this.emit("started", this.steps[0]);

		let currentStep = 1;
		this.timerRef = setInterval(() => {
			if (currentStep < this.numberOfSteps) {
				this.sendStep(this.steps[currentStep]);
				currentStep++;
			} else {
				clearInterval(this.timerRef);
				this.timerRef = null;
				this.emit("ended", this.endPoint);
			}
		}, this.stepTime);
	}
}

module.exports = StepAnimate;
