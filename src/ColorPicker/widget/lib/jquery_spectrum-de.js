// Spectrum Colorpicker
// German (de) localization
// https://github.com/bgrins/spectrum

require({
	packages: [{
		name: "jquery19",
		location: "../../widgets/jQueryLib", main: "jquery-191-min" 
	}]
},

["jquery19"], function (jQuery19) {

    var localization = jQuery19.spectrum.localization["de"] = {
        cancelText: "Abbrechen",
        chooseText: "Wählen"
    };

    jQuery19.extend(jQuery19.fn.spectrum.defaults, localization);

});
