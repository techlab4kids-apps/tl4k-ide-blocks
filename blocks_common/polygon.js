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
    this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE)
    this.setOutput(true, 'math_polygon')
    this.setShadow(true);
    this.points = 0
    this.oldConnections = {}
  },
  mutationToDom: function() {
    const container = document.createElement('mutation');

    container.setAttribute('points', this.points);
    return container;
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
      const xName = `x${point}`
      const yName = `y${point}`
      const xInput = this.getInput(xName)
      const yInput = this.getInput(yName)
      connections[xName] = xInput.connection.targetConnection
      connections[yName] = yInput.connection.targetConnection
      xInput.dispose()
      yInput.dispose()
    }

    const button = this.getInput('button')
    button.dispose()
    this.oldConnections = connections
  },
  generate: function() {
    const connections = this.oldConnections
    // create all the node inputs
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`
      const yName = `y${point}`
      const xInput = this.appendValueInput(xName)
      const yInput = this.appendValueInput(yName)
      const xConnection = xInput.connection
      const yConnection = yInput.connection
      if (!(connections[xName] || connections[yName])) {
        const newxBlock = this.workspace.newBlock('math_number');
        const newyBlock = this.workspace.newBlock('math_number');
        newxBlock.setFieldValue('1', 'NUM');
        newyBlock.setFieldValue('1', 'NUM');
        newxBlock.setShadow(true);
        newyBlock.setShadow(true);
        newxBlock.initSvg();
        newyBlock.initSvg();
        newxBlock.render(false);
        newyBlock.render(false);
        connections[xName] = newxBlock.outputConnection
        connections[yName] = newyBlock.outputConnection
      }
      connections[yName].connect(xConnection)
      connections[yName].connect(yConnection)
      xInput.appendField('x:')
      yInput.appendField('y:')
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
