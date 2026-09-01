/*global QUnit*/

sap.ui.define([
	"zmesconfrouter/zmesconfrouter/controller/SessionRouter.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SessionRouter Controller");

	QUnit.test("I should test the SessionRouter controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
