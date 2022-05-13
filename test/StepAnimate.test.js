/* eslint-disable */

const assert = require('assert')
//const StepAnimate = require("stepanimate");			-- for NPM testing
const StepAnimate = require('../index')

describe('StepAnimate Tests', function () {
  describe('Basic Walkthrough tests', function () {
    it('Starts and stops when required')
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
        new StepAnimate({ end: 1000, duration: 1000, stepTime:50 })
      }, /^Error: start not provided/)
    })
    it('should fail when end is not provided', () => {
      assert.throws(() => {
        new StepAnimate({ start:0, duration: 1000, stepTime:50 })
      }, /^Error: end not provided/)
    })

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
    it('should never provide a value outside of bounds')
    it('should correctly animate upwards')
    it('should correctly animate downwards')
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
})
