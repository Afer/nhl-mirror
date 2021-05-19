/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("helloworld", {
	// Default module config.
	defaults: {
		text: "Hello World!",
		DAYS_SHOWN: 4
	},

	items: {},

	getTemplate: function () {
		return "helloworld.njk";
	},

	getTemplateData: function () {
		return this.config;
	},

	start: function () {
		fetch("https://statsapi.web.nhl.com/api/v1/schedule?startDate=2021-05-19&endDate=2021-07-30")
			.then((response) => {
				if (!response.ok) {
					throw new Error("NHL response was not ok");
				}

				return response.json();
			})
			.then((data) => {
				console.log("here");
				console.log(data);
				this.items = data;
				this.updateDom(2000);
			});
	},

	getDom: function () {
		console.log("getting nhl dom...");
		if (!this.items || !this.items.dates) {
			return document.createElement("div");
		}

		var container = document.createElement("DIV");
		container.id = "nhl-schedule";

		var daysToShow = Math.min(this.defaults.DAYS_SHOWN, this.items.dates.length);

		for (var i = 0; i < daysToShow; i++) {
			for (var j = 0; j < this.items.dates[i].games.length; j++) {
				var lineItemDiv = this.getGameLineItem(this.items.dates[i].games[j]);

				container.appendChild(lineItemDiv);
			}
		}

		return container;
	},

	getGameLineItem: function (game) {
		var appendItem = document.createElement("DIV");
		appendItem.className = "nhl-line-item";

		var appendString = "";

		appendString += "<div class='date-container'>";
		appendString += "	<div class='date-container'>" + game.gameDate + "</div>";
		appendString += "</div>";
		appendString += "<div class='team-container'>";
		appendString += "	<div class='team-away'>" + game.teams.away.team.name + "</div>";
		appendString += "	<div class='team-home'>" + game.teams.home.team.name + "</div>";
		appendString += "</div>";

		appendItem.innerHtml = appendString;

		return appendItem;
	}
});
