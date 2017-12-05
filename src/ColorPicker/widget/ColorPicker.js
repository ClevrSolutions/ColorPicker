require({
    packages: [{
        name: "jquery19",
        location: "../../widgets/jQueryLib", main: "jquery-191-min"
    }]
}, ["jquery19",
        "dojo/_base/declare",
        "mxui/widget/_WidgetBase",
        "dojo/_base/kernel",
        "dojo/dom-class",
        "mxui/dom",
        "dijit/form/TextBox",
        "ColorPicker/widget/lib/spectrum",
        "ColorPicker/widget/ColorPicker"
    ], function (jQuery19, declare, _WidgetBase, kernel, domClass, dom, dijitForm, spectrum) {
        'use strict';
        return declare("ColorPicker.widget.ColorPicker", [_WidgetBase], {
            addons: [],

            name: '',
            showButtons: false,
            clickoutChange: true,
            defaultColor: '#000000',


            //IMPLEMENTATION
            isInactive: false,
            context: null,
            date: null,
            currValue: null,
            mxobj: null,
            _hasStarted: false,
            ignoreChange: false,

            postCreate: function () {
                dom.addCss('widgets/ColorPicker/widget/lib/spectrum.css');
                dom.addCss('widgets/ColorPicker/widget/ui/ColorPicker.css');
                if (this._hasStarted)
                    return;

                this._hasStarted = true;

                var code = kernel.locale;

                switch (code) {
                    case "nl-nl":
                        var localization = jQuery19.spectrum.localization["nl-nl"] = {
                            cancelText: "Annuleer",
                            chooseText: "Kies",
                            clearText: "Wis kleur selectie"
                        };
                        jQuery19.extend(jQuery19.fn.spectrum.defaults, localization);
                        break;
                    case "de-de":
                        var localization = jQuery19.spectrum.localization["de"] = {
                            cancelText: "Abbrechen",
                            chooseText: "Wählen"
                        };
                        jQuery19.extend(jQuery19.fn.spectrum.defaults, localization);
                        break;
                }

                domClass.add(this.domNode, 'ColorPickerWidget');
                dojo.attr(this.domNode, 'tabIndex', '-1');
                this.buildColorPicker();
            },

            update: function (context, callback) {
                console.log('apply' + jQuery19.fn.jquery);

                logger.debug(this.id + ".applyContext");

                var trackId = context && context.getGuid();

                if (trackId) {

                    mx.data.get({
                        guid: trackId,
                        callback: dojo.hitch(this, "setSourceObject")
                    });
                } else {
                    this.setSourceObject(null);
                }

                if (callback) {
                    callback();
                }

            },

            setSourceObject: function (obj) {
                console.log('setSourceObject');
                logger.debug(this.id + ".setSourceObject");

                this.sourceObject = obj;

                if (obj) {
                    var guid = obj.getGuid();
                } else {
                    jQuery19('#' + this.ColorPicker.id).spectrum("disable");
                }
            },

            buildColorPicker: function (callback) {

                this.ColorPicker = new dijitForm({
                    name: this.id + '_tb',
                    value: "",
                    disabled: this.isInactive
                }, dom.create("div"));

                if (this.isInactive)
                    domClass.add(this.ColorPicker.domNode, 'MxClient_formDisabled');
                else
                    domClass.remove(this.ColorPicker.domNode, 'MxClient_formDisabled');

                this.domNode.appendChild(this.ColorPicker.domNode);

                jQuery19('#' + this.ColorPicker.id).spectrum({
                    color: this.defaultColor,
                    clickoutFiresChange: this.clickoutChange,
                    showInitial: true,
                    showButtons: this.showButtons,
                    change: dojo.hitch(this, function (color) {
                        this.colorChanged(color);
                    })
                });

            },

            resize: function (box) {
                console.log(this.id + ".resize");
            },

            colorChanged: function (value) {
                if (value != '') {
                    if (value.toHexString() != this.currValue) {
                        this.currValue = value.toHexString();
                        this.sourceObject.set(this.name, this.currValue);
                        mx.data.commit({
                            mxobj: this.sourceObject,
                            callback: function () { }
                        });
                    }
                }
            },

            _setDisabledAttr: function (value) {
                this.isInactive = !!value;
                if (this.ColorPicker) {
                    this.ColorPicker.attr('disabled', !!value);
                    if (value || this.isDisabled) {
                        domClass.add(this.ColorPicker.domNode, 'MxClient_formDisabled');
                        this.ColorPicker.attr('disabled', true);
                    }
                    else {
                        domClass.remove(this.ColorPicker.domNode, 'MxClient_formDisabled');
                        this.ColorPicker.attr('disabled', false);
                    }
                }
            },

            _setValueAttr: function (value) {

                if (value != '')
                    this.currValue = value;
                else
                    if (this.defaultColor != '') {
                        this.currValue = this.defaultColor;
                    } else {
                        this.currValue = "";
                    }

                if (this.ColorPicker) {
                    if (value != '') {
                        this.ColorPicker.set("value", this.currValue);
                        jQuery19('#' + this.ColorPicker.id).spectrum("set", this.currValue);
                    } else {
                        this.ColorPicker.set("value", '');
                    }
                }
            },

            uninitialize: function () {
                jQuery19('#' + this.ColorPicker.id).spectrum("destroy");
                this.ColorPicker.destroy();
            }
        });
    });
