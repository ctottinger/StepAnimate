/* eslint-disable */

const assert = require("assert");
//const StepAnimate = require("stepanimate");			-- for NPM testing
const StepAnimate = require("../index");

describe("StepAnimate Tests", function () {
	describe("Basic Walkthrough tests", function () {
		it("Starts and stops when required");
	});
	describe("Object Tests", function () {
		it("should never provide a value outside of bounds");
		it("should correctly animate upwards");
		it("should correctly animate downwards");
		it("should correctly animate upwards and downwards");
		it("should correctly animate when a bunch of values are provided");
		it("should correctly round values when animating upward");
		it("should correctly round values when animating downward");

		it("should never accept values that are not ints");
		it("should never accept a property that doesn't exist in the start and end data");
		it("should never accept different types for start and end data");
	});

	describe("Integer Tests", function () {
		it("should never provide a value outside of bounds");
		it("should correctly animate upwards");
		it("should correctly animate downwards");
		it("should correctly animate upwards and downwards");
		it("should correctly round values when animating upward");
		it("should correctly round values when animating downward");
	});

	describe("Timing Tests", function () {
		it("should always take the right amount of time to emit steps");
		it("should never emit a step faster than expected");
	});

	describe("Event Tests", function () {
		it("should always stop when .stop() is called");
	});
	describe("Start/Stop Tests", function () {
		it("Starts and stops when required");
	});
});
