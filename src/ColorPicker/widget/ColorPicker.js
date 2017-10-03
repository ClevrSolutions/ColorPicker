require({
	packages: [{
		name: "jquery19",
		location: "../../widgets/jQueryLib", main: "jquery-191-min" 
	}]
},

["jquery19"], function (jQuery19) {

dojo.provide("ColorPicker.widget.ColorPicker");
dojo.require("dijit.form.TextBox");

mendix.dom.insertCss(mx.moduleUrl("ColorPicker.widget", "lib/spectrum.css"));
mendix.dom.insertCss(mx.moduleUrl("ColorPicker.widget", "ui/ColorPicker.css"));

mxui.widget.declare('ColorPicker.widget.ColorPicker', {
    addons       : [],
    inputargs: {

        name            : '',
        showButtons     : false,
        clickoutChange  : true,
        defaultColor    : '#000000'

    },

    //IMPLEMENTATION
    isInactive 	    : false,
    context 	    : null,
    date		    : null,
    currValue 	    : null,
    mxobj           : null,
    _hasStarted     : false,
    ignoreChange    : false,

    startup : function(){
        if (this._hasStarted)
            return;

        this._hasStarted = true;

        dojo.require("ColorPicker.widget.lib.spectrum");

        var code = mx.ui.getLocale();

        switch(code){
            case "nl-nl":
                dojo.require("ColorPicker.widget.lib.jquery_spectrum-nl");
                break;
            case "de-de":
                dojo.require("ColorPicker.widget.lib.jquery_spectrum-de");
                break;
        }

        mxui.dom.addClass(this.domNode, 'ColorPickerWidget');
        dojo.attr(this.domNode, 'tabIndex', '-1');
        this.buildColorPicker();
        this.actLoaded();
    },

    applyContext : function(context, callback) {
        console.log('apply');

        logger.debug(this.id + ".applyContext");

        var trackId = context && context.getTrackID();

        if (trackId) {

            mx.processor.get({
                guid     : trackId,
                callback : dojo.hitch(this, "setSourceObject")
            });
        } else {
            this.setSourceObject(null);
        }

        callback && callback();
    },

    setSourceObject : function(obj) {
        console.log('setSourceObject');
        logger.debug(this.id + ".setSourceObject");

        this.sourceObject = obj;
        this.removeSubscriptions();

        if(obj) {
            var guid = obj.getGUID();

            this.subscribeToGuid(guid);
        } else {
            jQuery19('#'+this.ColorPicker.id).spectrum("disable");
        }
    },

    buildColorPicker : function () {

        this.ColorPicker = new dijit.form.TextBox({
            name: this.id+'_tb',
            value: "",
            disabled : this.isInactive
        }, mxui.dom.div());

        if (this.isInactive)
            mxui.dom.addClass(this.ColorPicker.domNode, 'MxClient_formDisabled');
        else
            mxui.dom.removeClass(this.ColorPicker.domNode, 'MxClient_formDisabled');

        this.domNode.appendChild(this.ColorPicker.domNode);

        jQuery19('#'+this.ColorPicker.id).spectrum({
            color: this.defaultColor,
            clickoutFiresChange: this.clickoutChange,
            showInitial: true,
            showButtons: this.showButtons,
            change: dojo.hitch(this, function(color) {
                this.colorChanged(color);
            })
        });

    },

    colorChanged : function (value) {
        if (value != '') {
            if (value.toHexString() != this.currValue) {
                this.currValue = value.toHexString();
                this.sourceObject.set(this.name, this.currValue);
                this.sourceObject.save({ callback : function () {}});
            }
        }
    },

    _setDisabledAttr : function(value) {
        this.isInactive = !!value;
        if (this.ColorPicker) {
            this.ColorPicker.attr('disabled', !!value);
            if (value || this.isDisabled) {
                mxui.dom.addClass(this.ColorPicker.domNode, 'MxClient_formDisabled');
                this.ColorPicker.attr('disabled', true);
            }
            else {
                mxui.dom.removeClass(this.ColorPicker.domNode, 'MxClient_formDisabled');
                this.ColorPicker.attr('disabled', false);
            }
        }
    },

    _setValueAttr : function(value) {

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
                jQuery19('#'+this.ColorPicker.id).spectrum("set", this.currValue);
            } else {
                this.ColorPicker.set("value", '');
            }
        }
    },

    uninitialize : function(){
        jQuery19('#'+this.ColorPicker.id).spectrum("destroy");
        this.ColorPicker.destroy();
    }
});
});
