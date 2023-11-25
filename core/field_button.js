/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview Checkbox field.  Checked or not checked.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldButton');

goog.require('Blockly.Field');


/**
 * Class for a button field.
 * @param {object} state Options for this field.
 * @param {Function=} opt_validator A function that is executed.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldButton = function(state, opt_validator) {
  Blockly.FieldButton.superClass_.constructor.call(this, '', opt_validator);
  this.text_ = state.image_url ? '' : state.label;
  this.opcode_ = state.opcode;
  this.color_ = state.color || {};
  this.updateTextNode_()
  this.addArgType('button');
};
goog.inherits(Blockly.FieldButton, Blockly.Field);

/**
 * Construct a FieldButton from a JSON arg object.
 * @param {!Object} options A JSON object with options.
 * @returns {!Blockly.FieldButton} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldButton.fromJson = function(options) {
  return new Blockly.FieldButton(options);
};

/**
 * Mouse cursor style when over the button.
 */
Blockly.FieldButton.prototype.CURSOR = 'pointer';

/**
 * Install this checkbox on a block.
 */
Blockly.FieldButton.prototype.init = function() {
  if (this.fieldGroup_) {
    // Checkbox has already been initialized once.
    return;
  }
  Blockly.FieldButton.superClass_.init.call(this);

  this.box_ = Blockly.utils.createSvgElement('rect',
    {
      'x': 0,
      'y': 0,
      'rx': 4,
      'ry': 4,
      'width': this.size_.width,
      'height': this.size_.height,
      'fill': this.color_.primary || this.sourceBlock_.getColour(),
      'stroke': this.color_.tertiary || this.sourceBlock_.getColourTertiary(),
      'cursor': this.CURSOR
    }
  );
  this.textElement_.remove();
  this.textElement_ = Blockly.utils.createSvgElement('text',
    {
      'class': 'blocklyText',
      'y': this.size_.height / 2 + Blockly.BlockSvg.FIELD_TOP_PADDING,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'dy': goog.userAgent.EDGE_OR_IE ? Blockly.Field.IE_TEXT_OFFSET : '0',
      'fill': this.color_.text || null,
    }, null);
  this.fieldGroup_.append(this.textElement_)
  this.fieldGroup_.insertBefore(this.box_, this.textElement_);
};

/**
 * Returns an empty string.
 * @return {string}
 */
Blockly.FieldButton.prototype.getValue = function() {
  return '';
};
/**
 * Triggers when the button is clicked.
 * @private
 */
Blockly.FieldButton.prototype.showEditor_ = function() {
  this.sourceBlock_.onFieldButtonClicked_(this.opcode_);
};

Blockly.Field.register('field_button', Blockly.FieldButton);