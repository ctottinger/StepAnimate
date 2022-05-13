# StepAnimate
## What is this?
StepAnimate is a simple Node module to animate between a startpoint and endpoint, given a total duration and minimum time between steps.

## Installation
```
npm i stepanimate
```

## Usage - simple ints

```javascript
const StepAnimate = require("stepanimate");
...

const animation = new StepAnimate({
	start: 0,
	end: 100,
	duration: 1000,
	stepTime: 100,
});
animation.on("step", (val) => {
	console.log(val);
});
animation.start()
```
This would start a new animation, that would take one second, and emit a new `step` event every 100ms. So in effect, it would emit ten steps, which in this case would mean increments of 10. The value provided to the event listener is the current step.


## Usage - objects of ints

```javascript
const StepAnimate = require("stepanimate");
...

const animation = new StepAnimate({
	start: {
		r: 100,
		g: 100,
		b: 100,
		a: 0,
	},
	end: {
		r: 37,
		g: 100,
		b: 255,
		a: 109,
	},
	duration: 4000,
	stepTime: 1000,
});
animation.on("step", (val) => {
	console.log(val);
});
animation.on("ended", (val) => {
    console.log("Final value: ", val)
})
animation.start()
```

This example does the same thing, but with objects(and over four seconds, with a minimum delay of one second). For each `step`, StepAnimate will pass an identical object, but with the increments of that current step. So for example, the second step of this animation would be passed an object like:

```javascript
{
    r: 68,
    g: 100,
    b: 178,
    a: 56
}
```

## Methods

-   `.start()` - starts the animation and begins emitting `step`s
-   `.stop()` - kills the animation. Can be called from within a step event if something goes wrong.

## Events

-   `step` - emits with each animation step
-   `ended` - emits after the final animation step, with the final value
-   `start` - emits _before_ the first step in the animation
-   `started` - emits _after_ the first step in the animation

---

# Links

-   [NPM package](https://www.npmjs.com/package/stepanimate)
-   [GitHub Repo](https://github.com/ctottinger/StepAnimate)
