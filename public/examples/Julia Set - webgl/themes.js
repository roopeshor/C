let themes = {
		light: {
			textColor: "#222",
			background: "#fafafa",
			border: "#888",
		},
		dark: {
			textColor: "#bbb",
			background: "#181818",
			border: "#444",
		},
		default: "light",
		alt: "dark",
	},
	root = document.querySelector(":root");

/**
 * @param {HTMLInputElement} toggleElement
 */
function themeToggler(toggleElement, settings = {}) {
	let defaultTheme = window.localStorage.getItem("theme") || themes.default;
	settings.light = settings.light || themes.light;
	settings.dark = settings.dark || themes.dark;
	settings.default = settings.default || themes.default;

	if (settings.default == "dark") settings.alt = "light";
	else settings.alt = "dark";

	setVars(settings[defaultTheme]);
	if (defaultTheme == settings.alt) toggleElement.checked = true;

	toggleElement.addEventListener("change", function () {
		let isAlt = toggleElement.checked;
		if (isAlt) {
			setVars(settings[settings.alt]);
			window.localStorage.setItem("theme", settings.alt);
		} else {
			setVars(settings[settings.default]);
			window.localStorage.setItem("theme", settings.default);
		}
	});
}

function setVars(theme) {
	for (let style in theme) {
		root.style.setProperty(`--${style}`, theme[style]);
	}
}
