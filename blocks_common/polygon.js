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
 * @fileoverview Polygon block.
 * @author @RedMan13 (godslayerakp)
 */
'use strict';

goog.provide('Blockly.Blocks.ploygon');
goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');

const arrowLeft = group => {
  const imageContainer = Blockly.utils.createSvgElement(
    'image',
    {
      'height': this.height_ + 'px',
      'width': this.width_ + 'px'
    },
    group
  );
  imageContainer.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href', 
    Blockly.mainWorkspace.options.pathToMedia + 'polygon-colapse.svg'
  );
  return imageContainer
}
const arrowRight = group => {
  const imageContainer = Blockly.utils.createSvgElement(
    'image',
    {
      'height': this.height_ + 'px',
      'width': this.width_ + 'px'
    },
    group
  );
  imageContainer.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href', 
    Blockly.mainWorkspace.options.pathToMedia + 'polygon-expand.svg'
  );
  return imageContainer
}

Blockly.Blocks['polygon'] = {
  /**
   * Block for complex shapes.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Colours.textField, Blockly.Colours.textField, Blockly.Colours.textField)
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND)
    this.points = 0
  },
  domToMutation: function(xmlElement) {
    const newPoints = JSON.parse(xmlElement.getAttribute('points'))
    if (newPoints === this.points) {
      this.clear()
      this.points = newPoints
      this.generate()
    }
  },
  clear: function() {
    const connections = {}
    for (let point = 1; point <= this.points; point++) {
      const xn = `x${point}`
      const yn = `y${point}`
      const xi = this.getInput(xn)
      const yi = this.getInput(yn)
      connections[xn] = xi.connection.targetConnection
      connections[yn] = yi.connection.targetConnection
      xi.dispose()
      yi.dispose()
    }

    const button = this.getInput('button')
    button.dispose()
    this.oldConnections = connections
  },
  generate: function() {
    const connections = this.oldConnections
    // create all the node inputs
    for (let point = 1; point <= this.points; point++) {
      const xn = `x${point}`
      const yn = `y${point}`
      const xi = this.appendValueInput(xn)
      const yi = this.appendValueInput(yn)
      const xc = xi.connection
      const yc = yi.connection
      xc.connect(connections[xn])
      yc.connect(connections[yn])
      xi.appendField('x:')
      yi.appendField('y:')
    }

    const thisBlock = this
    const button = new Blockly.FieldButton(
      this.isCollapsed() ? arrowLeft : arrowRight,
      () => {
        const newState = !thisBlock.isCollapsed()
        thisBlock.setCollapsed(newState)
        return newState ? arrowLeft : arrowRight
      })
    const buttoni = this.appendDummyInput('button')
    buttoni.appendField(button)
  }
};
