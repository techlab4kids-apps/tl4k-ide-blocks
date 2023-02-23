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
  Blockly.FieldPercentage.superClass_.constructor.call(
      this, opt_value, opt_validator);
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
 * Construct a FieldPercentage from a JSON arg object.
 * @param {!Object} options A JSON object with options (Percentage).
 * @returns {!Blockly.FieldPercentage} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldPercentage.fromJson = function(options) {
  return new Blockly.FieldPercentage(options['percentage']);
};

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