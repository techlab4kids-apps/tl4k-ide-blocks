/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Percentage input field.
 * @author @RedMan13 (godslayerakp)
 */
'use strict';

goog.provide('Blockly.FieldPercentage');

goog.require('Blockly.FieldAngle');


/**
 * Class for an editable angle field.
 * @param {(string|number)=} opt_value The initial content of the field. The
 *     value should cast to a number, and if it does not, '0' will be used.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.FieldAngle}
 * @constructor
 */
Blockly.FieldPercentage = function(opt_value, opt_validator) {
  this.percent_ = Number(opt_value)
  Blockly.FieldPercentage.superClass_.constructor.call(
      this, `${opt_value}%`, opt_validator);
};
goog.inherits(Blockly.FieldPercentage, Blockly.FieldAngle);

/**
 * Round Percentages to the nearest 15 degrees when using mouse.
 * Set to 0 to disable rounding.
 */
Blockly.FieldPercentage.ROUND = 0.1

/**
 * Offset the location of 0 degrees (and all Percentages) by a constant.
 * Usually either 0 (0 = right) or 90 (0 = up).
 */
Blockly.FieldPercentage.OFFSET = 0;

/**
 * Maximum allowed Percentage before wrapping.
 * not realy used tbh.
 */
Blockly.FieldPercentage.WRAP = 100;

/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
Blockly.FieldPercentage.prototype.showEditor_ = function() {
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  Blockly.FieldAngle.superClass_.showEditor_.call(this, this.useTouchInteraction_);
  // If there is an existing drop-down someone else owns, hide it immediately and clear it.
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();
  // Build the SVG DOM.
  var svg = Blockly.utils.createSvgElement('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'height': (Blockly.FieldAngle.HALF * 2) + 'px',
    'width': (Blockly.FieldAngle.HALF) + 'px'
  }, div);

  for (var percent = 0; percent < 100; percent += 4) {
    const yAxis = percent * 1.5
    Blockly.utils.createSvgElement('line', {
      'x1': -10,
      'y1': yAxis,
      'x2': 10,
      'y2': yAxis,
      'class': 'blocklyPercentageMarks',
    }, svg);
  }

  this.handle_ = Blockly.utils.createSvgElement('rect', {
    'x': 0,
    'y': 0,
    'width': 40,
    'height': 10,
    'class': 'blocklyAngleDragHandle'
  }, svg);

  Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(),
      this.sourceBlock_.getColourTertiary());
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  this.mouseDownWrapper_ =
      Blockly.bindEvent_(this.handle_, 'mousedown', this, this.onMouseDown);

  this.updateGraph_();
};

Blockly.FieldPercentage.prototype.updateGraph_ = function() {}

/**
 * Construct a FieldPercentage from a JSON arg object.
 * @param {!Object} options A JSON object with options (Percentage).
 * @returns {!Blockly.FieldPercentage} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldPercentage.fromJson = function(options) {
  return new Blockly.FieldPercentage(options['percentage']);
};

Blockly.FieldPercentage.prototype.onMouseMove = function(e) {
  e.preventDefault();
  var percent = e.clientX % 101
  percent = Math.round(percent / Blockly.FieldPercentage.ROUND) * Blockly.FieldPercentage.ROUND
  percent = this.callValidator(percent);
  this.setValue(percent);
}

Blockly.FieldPercentage.prototype.setValue = function(val) {
  this.percent_ = val
  Blockly.FieldPercentage.superClass_.setValue.call(this, `${val}%`);
}

Blockly.FieldPercentage.prototype.getValue = function() {
  return this.percent_
}

/**
 * Ensure that only an Percentage may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid Percentage, or null if invalid.
 */
Blockly.FieldPercentage.prototype.classValidator = function(text) {
  if (text === null) {
    return null;
  }

  var n = parseFloat(text || 0);
  if (isNaN(n)) {
    return null;
  }
  n = n % 101;
  
  return `${n}%`;
};

Blockly.Field.register('field_percentage', Blockly.FieldPercentage);