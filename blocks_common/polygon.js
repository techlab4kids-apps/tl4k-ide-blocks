/**
 * @fileoverview Polygon block.
 * @author @RedMan13 (godslayerakp)
 */
'use strict';

goog.provide('Blockly.Blocks.ploygon');
goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');

Blockly.Blocks['polygon'] = {
  /**
   * Block for complex shapes.
   * @this Blockly.Block
   */
  init: function() {
    this.color = Blockly.Colours.textField
    this.colapsed = false
    this.points = 0
    this.oldConnections = {}
    this.generate()
  },
  mutationToDom: function() {
    const container = document.createElement('mutation');

    container.setAttribute('points', this.points);
    return container;
  },
  domToMutation: function(xmlElement) {
    const newPoints = JSON.parse(xmlElement.getAttribute('points'))
    const newColor = JSON.parse(xmlElement.getAttribute('color') || '""')
    if (newPoints === this.points) {
      this.clear()
      this.points = newPoints
      this.generate()
    }
    if (newColor) {
      this.color = newColor
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

    this.setColour(this.color, this.color, this.color)
    this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE)
    this.setOutput(true, 'math_polygon')
    this.setShadow(true);
    const thisBlock = this;
    const button = new Blockly.FieldCheckbox(
      this.colapsed, 
      newState => {
        thisBlock.setColapsed(newState)
        return newState
      }
    )
    this.appendDummyInput('button')
      .appendField(button)
  },
  setColapsed: function(bool) {
    this.colapsed = bool
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`
      const yName = `y${point}`
      const xInput = this.getInput(xName)
      const yInput = this.getInput(yName)
      xInput.setVisible(bool)
      yInput.setHidden(bool)
    }
  }
};
