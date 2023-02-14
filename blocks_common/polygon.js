/**
 * @fileoverview Polygon block.
 * @author @RedMan13 (godslayerakp)
 */
'use strict';

goog.provide('Blockly.Blocks.ploygon');
goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');

const getXYForPoint = (point, points, opt_offset, opt_scale) => {
  const offset = Array.isArray(opt_offset) 
    ? opt_offset 
    : [0,0]
  const scale = typeof opt_scale === 'number' 
    ? opt_scale 
    : 10
  
  const dir = (360 / points) * point
  const x = Math.cos(dir) * scale
  const y = Math.sin(dir) * scale
  return [x + offset[0],y + offset[1]]
}

Blockly.Blocks['polygon'] = {
  /**
   * Block for complex shapes.
   * @this Blockly.Block
   */
  init: function() {
    this.color = Blockly.Colours.pen.primary
    this.colapsed = false
    this.points = 0
    this.offset = [0,0]
    this.scale = 50
    this.oldConnections = {}
    this.blocks = {}
    this.generate()
  },
  mutationToDom: function() {
    const container = document.createElement('mutation');

    container.setAttribute('points', JSON.stringify(this.points));
    container.setAttribute('color', JSON.stringify(this.color));
    container.setAttribute('midle', JSON.stringify(this.offset));
    container.setAttribute('scale', JSON.stringify(this.scale));
    return container;
  },
  domToMutation: function(xmlElement) {
    console.log('loading block settings...')
    const newPoints = JSON.parse(xmlElement.getAttribute('points'))
    const newColor = JSON.parse(xmlElement.getAttribute('color') || '""')
    const newOffset = JSON.parse(xmlElement.getAttribute('midle') || '""')
    const newScale = JSON.parse(xmlElement.getAttribute('scale') || '""')
    if (newPoints !== this.points) {
      console.log('new points')
      this.clear()
      this.points = newPoints
      this.generate()
    }
    if (typeof newColor === 'string') {
      console.log('setting color')
      this.color = newColor
    }
    if (newOffset && Array.isArray(newOffset)) {
      console.log('setting center position')
      this.offset = newOffset
    }
    if (typeof newScale === 'number') {
      console.log('setting scale')
      this.length = newScale
    }
  },
  clear: function() {
    const connections = {}
    console.log('clearing block...')
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`
      const yName = `y${point}`
      const xInput = this.getInput(xName)
      const yInput = this.getInput(yName)
      connections[xName] = xInput.connection.targetConnection
      connections[yName] = yInput.connection.targetConnection
      this.removeInput(xName)
      this.removeInput(yName)
    }

    this.removeInput('button')
    this.oldConnections = connections
  },
  generate: function() {
    const connections = this.oldConnections
    // create all the node inputs
    console.log(`creating ${this.points} points...`)
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`
      const yName = `y${point}`
      const xInput = this.appendValueInput(xName)
      const yInput = this.appendValueInput(yName)
      const xConnection = xInput.connection
      const yConnection = yInput.connection
      // dispose of any free-floating blocks that where created by this block
      if (this.blocks[xName] && !this.blocks[xName].connection.targetConnection) {
        this.blocks[xName].dispose()
      }
      if (this.blocks[yName] && !this.blocks[yName].connection.targetConnection) {
        this.blocks[yName].dispose()
      }
      // if this point isnt filled in, fill it in
      if (!this.getInput(xName).connection.targetConnection || !this.getInput(yName).connection.targetConnection) {
        const newxBlock = this.workspace.newBlock('math_number');
        const newyBlock = this.workspace.newBlock('math_number');
        const initialValue = getXYForPoint(point, this.points, this.offset, this.scale)
        newxBlock.setFieldValue(String(initialValue[0]), 'NUM');
        newyBlock.setFieldValue(String(initialValue[1]), 'NUM');
        newxBlock.setShadow(true);
        newyBlock.setShadow(true);
        newxBlock.initSvg();
        newyBlock.initSvg();
        newxBlock.render(false);
        newyBlock.render(false);
        newxBlock.outputConnection.connect(xConnection)
        newyBlock.outputConnection.connect(yConnection)
        this.blocks[xName] = newxBlock
        this.blocks[yName] = newyBlock
      }
      // if we have a cached connection for this point then connect it
      if (connections[xName] || connections[yName]) {
        connections[xName].connect(xConnection)
        connections[yName].connect(yConnection)
      }
      xInput.appendField('x: ')
      yInput.appendField('y: ')
    }

    console.log('initializing block...')
    this.setColour(this.color, this.color, this.color)
    this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE)
    this.setOutput(true, 'math_polygon')
    this.setShadow(true);

    console.log('creating colapse/expand button...')
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
    let nextRender = 1
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`
      const yName = `y${point}`
      const xInput = this.getInput(xName)
      const yInput = this.getInput(yName)
      xInput.setVisible(bool)
      yInput.setVisible(bool)
      if (point === nextRender) {
        nextRender *= 2
        this.initSvg();
        this.render();
      }
    }
    this.initSvg();
    this.render();
  }
};
