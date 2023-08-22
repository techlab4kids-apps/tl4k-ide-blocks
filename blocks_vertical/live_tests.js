'use strict';

goog.provide('Blockly.Blocks.liveTests');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');



Blockly.Blocks['sensing_set_of'] = {
  /**
   * Block to report properties of sprites.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": 'set %1 of %2 to %3',
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PROPERTY",
          "options": [
            [Blockly.Msg.SENSING_OF_XPOSITION, 'x position'],
            [Blockly.Msg.SENSING_OF_YPOSITION, 'y position'],
            [Blockly.Msg.SENSING_OF_DIRECTION, 'direction'],
            [Blockly.Msg.SENSING_OF_COSTUMENUMBER, 'costume #'],
            [Blockly.Msg.SENSING_OF_COSTUMENAME, 'costume name'],
            [Blockly.Msg.SENSING_OF_SIZE, 'size'],
            [Blockly.Msg.SENSING_OF_VOLUME, 'volume'],
            [Blockly.Msg.SENSING_OF_BACKDROPNUMBER, 'backdrop #'],
            [Blockly.Msg.SENSING_OF_BACKDROPNAME, 'backdrop name']
          ]
        },
        {
          "type": "input_value",
          "name": "OBJECT"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.sensing,
      "extensions": ["colours_sensing", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_setVertTransform'] = {
  /**
   * Block to report properties of sprites.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": 'skew sprite vertically %1 %',
      "args0": [
        {
          "type": "input_value",
          "name": "PERCENT"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_setHorizTransform'] = {
  /**
   * Block to report properties of sprites.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": 'skew sprite horizontally %1 %',
      "args0": [
        {
          "type": "input_value",
          "name": "PERCENT"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['field_textdropdown_test'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_textdropdown",
          "name": "TEXT",
          "options": [
            ['item1', 'item1'],
            ['item2', 'item2'],
            ['item3', 'item3']
          ]
        }
      ],
      "output": "String",
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
      "colour": Blockly.Colours.textField,
      "colourSecondary": Blockly.Colours.textField,
      "colourTertiary": Blockly.Colours.textField
    })
  }
}

Blockly.Blocks['motion_mutatorCheckboxTest_checkboxMutatorMenu'] = {
  init: function () {
    this.setInputsInline(false);
    this.setColour("#c1c1c1");
  }
};
Blockly.Blocks['motion_mutatorCheckboxTest'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'checkbox mutator',
      "args0": [],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
    this.setMutator(new Blockly.Mutator([]));

    this.BORDER_FIELDS = ["ABC", "DEF"];
    this.FIELD_NAMES = ["first", "second"];

    this.inputs_ = [false, false];
  },

  mutationToDom: function () {
    // console.log('mutationToDom');
    if (!this.inputs_) {
      return null;
    }
    const container = document.createElement("mutation");
    for (let i = 0; i < this.inputs_.length; i++) {
      if (this.inputs_[i]) {
        container.setAttribute(this.BORDER_FIELDS[i], this.inputs_[i]);
      }
    }
    return container;
  },

  domToMutation: function (xmlElement) {
    // console.log('domToMutation');
    for (let i = 0; i < this.inputs_.length; i++) {
      this.inputs_[i] = xmlElement.getAttribute(this.BORDER_FIELDS[i].toLowerCase()) == "true";
    }
    this.updateShape_();
  },

  decompose: function (workspace) {
    // console.log('decompose');
    const containerBlock = workspace.newBlock('motion_mutatorCheckboxTest_checkboxMutatorMenu');
    for (let i = 0; i < this.inputs_.length; i++) {
      // BaseBlockly.Msg[this.BORDER_FIELDS[i]] = this.FIELD_NAMES[i];
      containerBlock.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(this.FIELD_NAMES[i])
        .appendField(new Blockly.FieldCheckboxOriginal(this.inputs_[i] ? "TRUE" : "FALSE"), this.BORDER_FIELDS[i].toUpperCase());
    }
    containerBlock.initSvg();
    containerBlock.moveBy(4, 22);
    return containerBlock;
  },

  compose: function (containerBlock) {
    // console.log('compose');
    // Set states
    for (let i = 0; i < this.inputs_.length; i++) {
      const field = this.BORDER_FIELDS[i].toUpperCase();
      const value = containerBlock.getFieldValue(field);
      // console.log(value);
      this.inputs_[i] = value == "TRUE";
    }
    this.updateShape_();
  },

  updateShape_: function () {
    // console.log('updateShape_');
    for (let i = 0; i < this.inputs_.length; i++) {
      if ((!this.inputs_[i]) && (this.getInput(this.BORDER_FIELDS[i].toUpperCase()))) {
        this.removeInput(this.BORDER_FIELDS[i].toUpperCase());
      }
    }
    for (let i = 0; i < this.inputs_.length; i++) {
      if ((this.inputs_[i]) && (!(this.getInput(this.BORDER_FIELDS[i].toUpperCase())))) {
        // BaseBlockly.Msg[this.BORDER_FIELDS[i]] = this.FIELD_NAMES[i];
        this.appendValueInput(this.BORDER_FIELDS[i].toUpperCase())
          // .setAlign(Blockly.ALIGN_RIGHT)
          // todo: insert string/number input?
          .appendField(this.FIELD_NAMES[i]);
      }
    }
  }
};