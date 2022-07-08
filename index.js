const { EventEmitter } = require('events');

class StepAnimate extends EventEmitter {
  constructor (config) {
    super();
    this.steps = [];
    this.pointType = '';
    this.timerRef = null;
    this.dividedDeltas = {};
    this.roundConfig = true;
    this.stepTime = 0;
    this.numberOfSteps = 0;
    this.stretch = false;
    if (config.start === undefined) {
      throw new Error('start not provided');
    }
    if (config.end === undefined) {
      throw new Error('end not provided');
    }
    [this.startPoint, this.endPoint, this.startKeys] = [config.start, config.end, Object.keys(config.start)];
    this.duration = config.duration;

    if ('stretch' in config && config.stretch === true) {
      this.stretch = true;
    }

    this.round = (value, up) => {
      if (this.roundConfig) {
        // if (up) {
        //   return Math.ceil(value);
        // }
        // return Math.floor(value);
        return Math.round(value);
      }

      return value;
    };

    this.stepTime = parseInt(config.stepTime, 10);
    this.numberOfSteps = Math.floor(this.duration / this.stepTime);

    if ('round' in config && config.round === false) {
      this.roundConfig = false;
    }

    if (typeof config.duration !== 'number') {
      throw new Error('Provided duration is not a number');
    }

    if ('stepTime' in config && 'numberOfSteps' in config) {
      throw new Error('Can\'t set step time AND number of, must provide either one or the other.');
    }

    if (Number.isNaN(this.stepTime)) {
      throw new Error('Step timing in ms is required');
    }

    if (typeof config.start === 'object') {
      if (typeof config.end !== 'object') {
        throw new Error('Start & end type don\'t match, both must either be ints or objects of keys:ints');
      }

      this.pointType = 'object';
    } else if (typeof config.start === 'number') {
      if (typeof config.end !== 'number') {
        throw new Error('Start & end type don\'t match, both must either be ints or objects of keys:ints');
      }

      this.pointType = 'number';
    } else {
      throw new Error('Start & end must be objects or ints');
    }

    if (this.pointType === 'object') {
      this.validateObjectPoints();
      Object.entries(this.startPoint).forEach((value, index) => {
        const d = (value[1] - this.endPoint[value[0]]) * -1;
        this.dividedDeltas[index] = d / this.numberOfSteps;
      });
    } else {
      [this.startPoint, this.endPoint] = [{ val: config.start }, { val: config.end }];
      const d = (this.startPoint.val - this.endPoint.val) * -1;

      if (this.stretch === true && d < this.numberOfSteps) {
        this.dividedDeltas[0] = d / this.numberOfSteps;
      } else {
        this.dividedDeltas[0] = d / this.numberOfSteps;
      }
    }

    const computedSteps = [];

    const hardCeil = (base, modify, ceil, goingUp) => {
      if (base === ceil) return ceil;

      const op = base + modify;
      if (goingUp && op >= ceil) return ceil;

      if (!goingUp && op <= ceil) return ceil;

      const rounded = this.round(op, goingUp);
      return rounded;
    };

    if (this.pointType === 'object') {
      let values = Object.entries(this.startPoint);

      for (let step = 0; step < this.numberOfSteps; step++) {
        const stepValue = {};

        values = values.map((val, index) => {
          const delta = this.dividedDeltas[index];
          const goingUp = !(delta < 0);

          const re = hardCeil(val[1], delta, this.endPoint[val[0]], goingUp);
          const modify = (this.stretch) ? val[1] + delta : re;

          stepValue[val[0]] = re;
          return [val[0], modify];
        });

        computedSteps.push(stepValue);
      }
    } else {
      const goingUp = !(this.dividedDeltas[0] < 0);
      let current = this.startPoint.val;
      let lastVal = this.startPoint.val;

      for (let step = 0; step < this.numberOfSteps; step++) {
        const modify = (this.stretch) ? current : lastVal;

        const out = hardCeil(modify, this.dividedDeltas[0], this.endPoint.val, goingUp);
        current = current + this.dividedDeltas[0];

        lastVal = out;
        computedSteps.push({ val: out });
      }
    }

    this.steps = computedSteps;
  }

  validateObjectPoints () {
    const [validatedStart, validatedEnd] = [{}, {}];
    const [start, end] = [this.startPoint, this.endPoint];
    let isEmpty = true;

    this.startKeys.forEach(key => {
      if (key in end && typeof start[key] === 'number' && typeof end[key] === 'number') {
        validatedStart[key] = start[key];
        validatedEnd[key] = end[key];
        isEmpty = false;
      }
    });
    if (isEmpty) {
      throw new Error('No valid data for start/stop');
    }

    [this.startPoint, this.endPoint] = [validatedStart, validatedEnd];
  }

  sendStep (step) {
    const val = (this.pointType === 'number') ? step.val : step;
    this.emit('step', val);
  }

  stop () {
    clearInterval(this.timerRef);
    this.timerRef = null;
    this.emit('ended', this.endPoint);
  }

  async start () {
    await this.loaded;
    this.emit('start', this.steps[0]);
    this.sendStep(this.steps[0]);
    this.emit('started', this.steps[0]);

    let currentStep = 1;

    const timeRun = () => {
      if (currentStep < this.numberOfSteps) {
        this.timerRef = setTimeout(timeRun, this.stepTime);
        this.sendStep(this.steps[currentStep]);
        currentStep++;
      } else {
        clearTimeout(this.timerRef);
        this.timerRef = null;
        this.emit('ended', { end: this.endPoint });
      }
    };

    this.timerRef = setTimeout(timeRun, this.stepTime);
  }
}

module.exports = StepAnimate;
