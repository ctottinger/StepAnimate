/* eslint-disable */

const assert = require('assert')
//const StepAnimate = require("stepanimate");			-- for NPM testing
const StepAnimate = require('../index')

describe('StepAnimate Tests', function () {
  describe('Basic Walkthrough tests', function () {
    it('should fail when stepTime is not provided', () => {
      assert.throws(() => {
        new StepAnimate({ start: 0, end: 1, duration: 1000 })
      }, /^Error: Step timing in ms is required/)
    })
    it('should fail when stepTime is not an int', () => {
      assert.throws(() => {
        new StepAnimate({ start: 0, end: 1, duration: 1000, stepTime: 'a' })
      }, /^Error: Step timing in ms is required/)
    })
    it('should fail when duration is not an int', () => {
      assert.throws(() => {
        new StepAnimate({ start: 0, end: 1, duration: 'a', stepTime: 25 })
      }, /^Error: Duration is not a number/)
    })
    it('should fail when duration is not provided', () => {
      assert.throws(() => {
        new StepAnimate({ start: 0, end: 1, stepTime: 25 })
      }, /^Error: Duration is not a number/)
    })
    it('should fail when start is not provided', () => {
      assert.throws(() => {
        new StepAnimate({ end: 1000, duration: 1000, stepTime: 50 })
      }, /^Error: start not provided/)
    })
    it('should fail when end is not provided', () => {
      assert.throws(() => {
        new StepAnimate({ start: 0, duration: 1000, stepTime: 50 })
      }, /^Error: end not provided/)
    })
    it('Starts and stops when required')
  })
  describe('Object Tests', function () {
    it('should never provide a value outside of bounds')
    it('should correctly animate upwards')
    it('should correctly animate downwards')
    it('should correctly animate upwards and downwards')
    it('should correctly animate when a bunch of values are provided')
    it('should correctly round values when animating upward')
    it('should correctly round values when animating downward')
    it('should fail when types to migrate are not ints')
    it('should never accept a property that doesn\'t exist in the start and end data')
    it('should never accept different types for start and end data')
  })

  describe('Integer Tests', function () {
    it('should take the appropriate time to run a transition',(done)=>{
      this.timeout(5500);
      const start=new Date().getTime()
      let previous = 1
      let stepCounter = 0
      const opts = {
        start: previous,
        end: 100,
        duration: 5000,
        stepTime: 50
      }
      const animation = new StepAnimate(opts)
      animation.on('step', (s) => {
        assert.equal(s >= previous, true, 'actual '+s+",previous "+previous+" step counter "+stepCounter)
        previous = s
        stepCounter++
      })
      animation.on('ended', (e) => {
        assert.equal(stepCounter, 100)
        const end=new Date().getTime();
        const diff=Math.abs((end-5000)-start)
        // console.log('start '+start+' end '+end+" difference: "+diff)
        assert.equal(diff<100, true)
        done()
      })
      animation.start()
    })
    it('should never provide a value outside of bounds')
    it('should correctly animate upwards', (done) => {
      this.timeout(700)
      let previous = 1
      let stepCounter = 0
      const opts = {
        start: previous,
        end: 20,
        duration: 500,
        stepTime: 50
      }
      const animation = new StepAnimate(opts)
      animation.on('step', (s) => {
        assert.equal(s > previous, true)
        previous = s
        stepCounter++
      })
      animation.on('ended', (e) => {
        assert.equal(stepCounter, 10)
        done()
      })
      animation.start()
    })
    it('should correctly animate downwards', (done) => {
      this.timeout(700)
      let previous = 20
      let stepCounter = 0
      const opts = {
        start: previous,
        end: 1,
        duration: 500,
        stepTime: 50
      }
      const animation = new StepAnimate(opts)
      animation.on('step', (s) => {
        assert.equal(s < previous, true)
        previous = s
        stepCounter++
      })
      animation.on('ended', (e) => {
        assert.equal(stepCounter, 10)
        done()
      })
      animation.start()
    })
  })
  it('should correctly animate upwards and downwards')
  it('should correctly round values when animating upward')
  it('should correctly round values when animating downward')
  it('should fail when scalar value is not an int', () => {
    assert.throws(() => {
      new StepAnimate({
        start: 'a',
        end: 'b',
        duration: 1000,
        stepTime: 50
      })
    }, Error, 'Start & end must be objects or ints')
  })

})

describe('Timing Tests', function () {
  it('should always take the right amount of time to emit steps')
  it('should never emit a step faster than expected')
})

describe('Event Tests', function () {
  it('should always stop when .stop() is called')
})
describe('Start/Stop Tests', function () {
  it('Starts and stops when required')
})
