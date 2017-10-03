// Spectrum Colorpicker
// Dutch (nl-nl) localization
// https://github.com/bgrins/spectrum

require({
	packages: [{
		name: "jquery19",
		location: "../../widgets/jQueryLib", main: "jquery-191-min" 
	}]
},

["jquery19"], function (jQuery19) {

    var localization = jQuery19.spectrum.localization["nl-nl"] = {
        cancelText: "Annuleer",
        chooseText: "Kies",
        clearText: "Wis kleur selectie"
    };

    jQuery19.extend(jQuery19.fn.spectrum.defaults, localization);

});
