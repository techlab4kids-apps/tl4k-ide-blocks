/**
 * @fileoverview Button field.
 * @author @RedMan13 (godslayerakp)
 */
'use strict';

goog.provide('Blockly.FieldButton');
goog.require('Blockly.Field');

class FieldButton extends Blockly.Field {
    /**
     * Class for a Button field.
     * @param {Function} svg a generator for the fields SVGElement
     * @param {Function=} opt_validator what to do when the button is clicked
     * @extends {Blockly.Field}
     * @constructor
     */
    constructor(svg, onClicked) {
        super('', onClicked)
        // Set the initial state.
        this.setValue(svg);
        this.IMAGE = svg
        this.addArgType('Button');
    }

    /**
     * Construct a FieldButton from a JSON arg object.
     * @param {!Object} options A JSON object with options (svg).
     * @returns {!Blockly.FieldButton} The new field instance.
     * @package
     * @nocollapse
     */
    fromJson(options) {
        return new Blockly.FieldButton(options.svg);
    }

    /**
     * Mouse cursor style when over the hotspot that initiates editability.
     */
    CURSOR = 'default'

    /**
     * the default image
     */
    IMAGE = '<svg><text x="-3" y="14" class="blocklyText blocklyCheckbox">\u2713</text></svg>'

    /**
     * Install this Button on a block.
     */
    init() {
        if (this.fieldGroup_) {
            // Button has already been initialized once.
            return;
        }
        super();
        // The Button doesn't use the inherited text element.
        this.setValue(this.IMAGE)
    }

    /**
     * Return 'TRUE' if the Button is checked, 'FALSE' otherwise.
     * @return {String} the current image
     */
    getValue() {
        return this.checkElement_
    }

    /**
     * set the image
     * @param {String} newImage the image
     */
    setValue (newImage) {
        this.checkElement_ = newImage()
        this.checkElement_.style.display = 'block';
    }

    /**
     * run the "on clicked" event when the button is clicked
     * @private
     */
    showEditor_ () {
        if (this.sourceBlock_) {
            const newImage = this.callValidator(this)
            // if no image provided, dont change the image
            if (newImage) this.checkElement_ = newImage;
        }
    }
}

Blockly.Field.register('field_Button', FieldButton);
