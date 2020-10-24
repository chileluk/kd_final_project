// "use strict";
const localEndpoint = "http://192.168.1.5:7200/repositories/ent_ontology"

let filmQuery = (category, genres) => {
	return `PREFIX ent: <http://www.entertainment.org/entertainment/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?imdbID ?title ?imageUrl ?year ?languageLabel ?rating ?duration ?countryLabel ?plot
    (CONCAT(GROUP_CONCAT( DISTINCT ?genreLabel;separator=' ')) as ?genreLabelList)
    (CONCAT(GROUP_CONCAT(DISTINCT ?actorName;separator=' ')) as ?actorNameList)

    WHERE {
		VALUES ?category {${category}}
		VALUES ?genre {${genres}}
		VALUES ?language {ent:English}
		?entertainment a ?category;
		ent:hasGenre ?genre; ent:title ?title; ent:releaseYear ?year; ent:language ?language;
		ent:hasRating ?rating; ent:duration ?duration; ent:releaseCountry ?country;
		rdfs:comment ?plot; ent:imdbID ?imdbID; ent:imageURL ?imageUrl .
		?actor ent:appearsIn ?entertainment;
		ent:name ?actorName.
		?genre rdfs:label ?genreLabel .
		?country rdfs:label ?countryLabel .
		?language rdfs:label ?languageLabel .
    }
    GROUP BY ?imdbID ?title ?imageUrl ?year ?languageLabel ?rating ?duration ?countryLabel ?plot
	ORDER BY DESC (?rating)`;
}

let bookQuery = (genres) => {
	return `PREFIX ent:<http://www.entertainment.org/entertainment/>
	  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	  PREFIX dbr: <http://dbpedia.org/resource/>
      SELECT DISTINCT ?title
      (SAMPLE(?is) AS ?isbn)
      (SAMPLE(?pl) AS ?plot)
      (SAMPLE(?cl) AS ?countryLabel)
      (SAMPLE(?authName) AS ?authorName)
      (SAMPLE(?pages) AS ?pageCount)
      (SAMPLE(?gl) AS ?genreLabel)
      (SAMPLE(?link) AS ?wikipediaLink)
      (SAMPLE(?date) AS ?year)
      WHERE {
		VALUES ?genre {${genres}}
		?book a ent:Book; ent:hasGenre ?genre; ent:hasISBN ?is; ent:writtenBy ?author; rdfs:comment ?pl;
		ent:title ?title; ent:releaseYear ?date; ent:releaseCountry ?country; ent:pageCount ?pages;
		rdfs:label ?link.
		OPTIONAL { ?book ent:imageURL ?imageUrl .}
		?country rdfs:label ?cl.
		?genre rdfs:label ?gl .
		?author ent:name ?authName .
      }
      GROUP BY ?title
     `
}

$(document)
	.ajaxStart(function () {
		$("#preloadBlock").preloader();
	})
	.ajaxStop(function () {
		$("#preloadBlock").preloader("remove");
	});

var rangeSelector = (element) => {
	$(element).rangeRover({
		color: "linear-gradient(#84C0FD, #C23CFD)",
		step: 1,
		mode: "plain",
		range: false,
		vLabels: true,
		data: {
			start: 0,
			end: 10,
		},
		onChange: function (value) {
			maximumSeasons = value.start.value;
			// console.log(maximumSeasons);
		},
	});
};


$(document).ready(function () {
	var maximumSeasons;
	var minimumRating;

	$(document).on("click", ".categorySelector", function (event) {
		$(this).toggleClass("bg-info");
	});

	$("#home").click(function () {
		$("#preloadBlock").preloader();
		location.reload();
	});

	$(".btn.select-category").click(function () {
		$(".select-category").hide();
		$(".basic-options").hide();
		$("#preloadBlock").preloader();
		var selectedCategories = "";

		$(".categorySelector.bg-info").each((index, element) => {
			let category = "ent:" + $(element).attr("id");
			console.log(category);
			selectedCategories += category;
			selectedCategories += " ";
		});

		// IMAGES ON HOME PAGE
		let categorySelectors = {
			"TV Series": "https://img.icons8.com/nolan/512/tv-show.png",
			Movie: "https://img.icons8.com/nolan/512/movie.png",
			Book: "https://img.icons8.com/nolan/512/books-1.png",
		};

		let filmGenres = {
			Comedy: "https://img.icons8.com/nolan/512/comedy.png",
			History: "https://img.icons8.com/nolan/512/order-history.png",
			"Sci-Fi": "https://img.icons8.com/nolan/512/robot-3.png",
			Romance: "https://img.icons8.com/nolan/512/novel.png",
			Thriller: "https://img.icons8.com/nolan/512/thriller.png",
			Action: "https://img.icons8.com/nolan/512/boxing.png",
			Horror: "https://img.icons8.com/nolan/512/scream.png",
			Crime: "https://img.icons8.com/nolan/512/bank-robbery.png",
			Fantasy: "https://img.icons8.com/nolan/512/fantasy.png",
			Biography: "https://img.icons8.com/nolan/512/resume.png",
			Drama: "https://img.icons8.com/nolan/512/theatre-mask.png",
			Mystery: "https://img.icons8.com/nolan/512/anonymous-mask.png",
			Sport: "https://img.icons8.com/nolan/512/american-football-ball.png",
			Adventure: "https://img.icons8.com/nolan/512/trekking.png",
			Animation: "https://img.icons8.com/nolan/512/animation.png",
			Family: "https://img.icons8.com/nolan/512/family.png",
			Documentary: "https://img.icons8.com/nolan/512/documentary.png",
			Technology: "https://img.icons8.com/nolan/512/home-office.png",
		};

		let bookGenres = {
			"Dark_comedy": "https://img.icons8.com/nolan/512/comedy.png",
			"Historical_novel": "https://img.icons8.com/nolan/512/order-history.png",
			"Science_fiction": "https://img.icons8.com/nolan/512/robot-3.png",
			"Romance_novel": "https://img.icons8.com/nolan/512/novel.png",
			"Thriller_(genre)": "https://img.icons8.com/nolan/512/thriller.png",
			"Spy_novel": "https://img.icons8.com/nolan/512/theatre-mask.png",
			"Horror_fiction": "https://img.icons8.com/nolan/512/scream.png",
			"Crime_fiction": "https://img.icons8.com/nolan/512/bank-robbery.png",
			Fantasy: "https://img.icons8.com/nolan/512/fantasy.png",
			"Autobiography": "https://img.icons8.com/nolan/512/resume.png",
			"Detective_fiction": "https://img.icons8.com/nolan/512/law.png",
			"Mystery_fiction": "https://img.icons8.com/nolan/512/anonymous-mask.png",
			"Young-adult_fiction": "https://img.icons8.com/nolan/512/american-football-ball.png",
			"Adventure_novel": "https://img.icons8.com/nolan/512/trekking.png",
			"Children's_Literature": "https://img.icons8.com/nolan/512/animation.png",
			"Urban_Fantasy": "https://img.icons8.com/nolan/512/alpha.png",
			"Fiction": "https://img.icons8.com/nolan/512/documentary.png",
			"Non-fiction": "https://img.icons8.com/nolan/512/bookmark.png",

		}

		// change filters per category
		let genreSelectors;
		let filters;

		if (selectedCategories.includes("ent:Book")) {
			console.log("BOOK")
			genreSelectors = bookGenres
			filters = {
				Genre: {
					Heading: "Choose the genre(s) you prefer",
					Data: filmGenres,
				},
				Year: {
					Heading: "Choose the release year",
					Range: {
						Min: 2000,
						Max: 2020,
					},
				},
				Pages: {
					Heading: "Slide and choose the maximum number of pages",
					Range: {
						Min: 100,
						Max: 120,
					},
				},
			};
		} else if (selectedCategories.includes("ent:Movie")) {
			genreSelectors = filmGenres
			filters = {
				Genre: {
					Heading: "Choose the genre(s) you prefer",
					Data: filmGenres,
				},
				Rating: {
					Heading: "Slide and choose the minimum rating",
					Range: {
						Min: 0,
						Max: 10,
					},
				},
				Runtime: {
					Heading: "Choose the maximum runtime of a movie in minutes",
					Range: {
						Min: 0,
						Max: 200,
					},
				},
			};
		} else {
			filters = {
				Genre: {
					Heading: "Choose the genre(s) you prefer",
					Data: filmGenres,
				},
				Rating: {
					Heading: "Slide and choose the minimum rating",
					Range: {
						Min: 0,
						Max: 10,
					},
				},
				"Number of Seasons": {
					Heading: "Slide and choose the maximum number of seasons for a Series",
					Range: {
						Min: 0,
						Max: 10,
					},
				},
			};
		}




		$.each(filters, (selector, data) => {
			let heading = `<div class="alert alert-success text-center" role="alert">
			<h4 class="alert-heading">${selector}</h4>
			<hr>
			<p class="mb-0">${data.Heading}</p>
			</div>`;

			if (selector === "Genre") {
				$(".genreHeading").append(heading);
				$.each(genreSelectors, (genre, url) => {
					let iconSelector = `<div class="col mb-4">
						<div id="${genre}" class="card genreSelector">

							<img src="${url}" class="card-img-top" alt="...">

							<div class="card-footer text-center font-weight-bold">
								<p class="card-title">${genre.replace("_", " ").replace("(genre)", "").replace("novel", "")}</p>
							</div>
						</div>
					</div>`;

					$(".row-cols-6").append(iconSelector);
				});
			} else {
				// OTHER FILTERS
				let id = selector.replace(/ /g, "");

				if (selectedCategories.includes("ent:Book")) {
					let slider = `<div id="${id}" class="range"></div>`;

					if (selector === "Year") {
						$(".ratingsHeading").append(heading);
						$(".ratingsSelector").append(slider);
						rangeSelector(`#${id}`);
					}

					if (selector === "Pages") {
						$(".seasonsHeading").append(heading);
						$(".seasonSelector").append(slider);
						rangeSelector(`#${id}`);
					}

				}
				else if (selectedCategories.includes("ent:Movie")) {
					let slider = `<div id="${id}" class="range"></div>`;

					if (selector === "Rating") {
						$(".ratingsHeading").append(heading);
						$(".ratingsSelector").append(slider);
						rangeSelector(`#${id}`);
					}

					if (selector === "Runtime") {
						$(".seasonsHeading").append(heading);
						$(".seasonSelector").append(slider);
						rangeSelector(`#${id}`);
					}

				}
				else {
					let slider = `<div id="${id}" class="range"></div>`;

					if (selector === "Rating") {
						$(".ratingsHeading").append(heading);
						$(".ratingsSelector").append(slider);
						rangeSelector(`#${id}`);
					}

					if (selector === "Number of Seasons") {
						$(".seasonsHeading").append(heading);
						$(".seasonSelector").append(slider);
						rangeSelector(`#${id}`);
					}
				}
				
			}
		});

		let search = `<button id="search" type="button" class="btn btn-primary select-category">Search</button>`;
		$(".search").append(search);
		$("#preloadBlock").preloader("remove");
		$(".basic-options").hide();
		$(".searchBlock").show();

		$(document).on("click", ".genreSelector", function () {
			$(this).toggleClass("bg-info");
		});

		$("#search").click(function () {
			$(".searchBlock").hide();
			$("#preloadBlock").preloader();

			var selectedGenres = "";
			let genre;

			$(".genreSelector.bg-info").each((index, element) => {
				if (selectedCategories.includes("ent:Book")) {
					genre = "dbr:" + $(element).attr("id");
				}
				else {
					genre = "ent:" + $(element).attr("id");
				}

				console.log(genre);
				selectedGenres += genre;
				selectedGenres += " ";
			});

			console.log(selectedGenres);
			$(".resultBlock").hide();


	// 		let query = `PREFIX ent: <http://www.entertainment.org/entertainment/>
    // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    // SELECT DISTINCT
    // ?imdbID
    // ?title
    // ?imageUrl
    // ?year
    // ?languageLabel
    // ?rating
    // ?duration
    // ?countryLabel
    // ?plot
    // (CONCAT(GROUP_CONCAT( DISTINCT ?genreLabel;separator=' ')) as ?genreLabelList)
    // (CONCAT(GROUP_CONCAT(DISTINCT ?actorName;separator=' ')) as ?actorNameList)


    // WHERE {
    // VALUES ?category {${selectedCategories}}
    // VALUES ?genre {${selectedGenres}}
    // VALUES ?language {ent:English}
    // ?entertainment a ?category;
    // ent:hasGenre ?genre;
    // ent:title ?title;

    // ent:releaseYear ?year;
    // ent:language ?language;
    // ent:hasRating ?rating;
    // ent:duration ?duration;
    // ent:releaseCountry ?country;
    // rdfs:comment ?plot;
    // ent:imdbID ?imdbID;
    // ent:imageURL ?imageUrl .
    // ?actor ent:appearsIn ?entertainment;
    // ent:name ?actorName.
    // ?genre rdfs:label ?genreLabel .
    // ?country rdfs:label ?countryLabel .
    // ?language rdfs:label ?languageLabel .


    // }
    // GROUP BY
    // ?imdbID
    // ?title
    // ?imageUrl
    // ?year
    // ?languageLabel
    // ?rating
    // ?duration
    // ?countryLabel
    // ?plot
	// ORDER BY DESC (?rating)`;


	// 		let bookQuery = `PREFIX ent:<http://www.entertainment.org/entertainment/>
	//   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	//   PREFIX dbr: <http://dbpedia.org/resource/>
    //   select distinct ?title
    //   (SAMPLE(?is) AS ?isbn)
    //   (SAMPLE(?pl) AS ?plot)
    //   (SAMPLE(?cl) AS ?countryLabel)
    //   (SAMPLE(?authName) AS ?authorName)
    //   (SAMPLE(?pages) AS ?pageCount)
    //   (SAMPLE(?gl) AS ?genreLabel)
    //   (SAMPLE(?link) AS ?wikipediaLink)
    //   (SAMPLE(?date) AS ?year)
    //   WHERE {
	//   VALUES ?genre {${selectedGenres}}
    //   ?book a ent:Book;
    //   ent:hasGenre ?genre;
    //   ent:hasISBN ?is;
    //   ent:writtenBy ?author;
    //   rdfs:comment ?pl;
    //   ent:title ?title;
    //   ent:releaseYear ?date;
    //   ent:releaseCountry ?country;
    //   ent:pageCount ?pages ;
    //   rdfs:label ?link.
    //   OPTIONAL { ?book ent:imageURL ?imageUrl .}
    //   ?country rdfs:label ?cl.
    //   ?genre rdfs:label ?gl .
    //   ?author ent:name ?authName .
    //   }
    //   GROUP BY ?title
    //  `;
			console.log(selectedCategories);
			let query;
			if (selectedCategories.includes("ent:Book")) {
				query = bookQuery(selectedGenres)
			} else {
				query = filmQuery(selectedCategories, selectedGenres)
			}

			$.ajax({
				url: localEndpoint,
				accepts: {
					json: "application/sparql-results+json",
				},
				data: {
					query,
				},
				dataType: "json",
				error: (error) => {
					console.error(error);
					let resultHeading;
					resultHeading = `<div class="alert alert-success text-center" role="alert">
            <h4 class="alert-heading">Search Results</h4>
            <hr>
            <p class="mb-0">Sorry, There was an error during search. Please try again</p>
        </div>`;
					$(".resultBlock").append(resultHeading);
				},
				success: function (response) {
					let resultHeading;
					var results = response.results.bindings;
					if (results.length === 0) {
						resultHeading = `<div class="alert alert-success text-center" role="alert">
            <h4 class="alert-heading">Search Results</h4>
            <hr>
            <p class="mb-0">Sorry, The search criteria you have made returned no results. Please try searching again with different criteria</p>
        </div>`;
						$(".resultBlock").append(resultHeading);
					} else {
						resultHeading = `<div class="alert alert-success text-center" role="alert">
            <h4 class="alert-heading">Recomended Entertainments</h4>
            <hr>
            <p class="mb-0">We have brought to you The following list of entertainments that we think you may be interested in.</p>
        </div>`;

						$(".resultBlock").append(resultHeading);
					}

					// RESULTS
					$.each(results, (index, row) => {

						let country = row.countryLabel.value;
						let plot = row.plot.value;
						let title = row.title.value;
						let year = row.year.value;

						let category, categoryIcon, genreList, genre, genreIcon
						let pageCount, author, isbn;
						let thumbnail, rating, length, actorList, imdbID, language


						if (row.imageUrl) {
							thumbnail = row.imageUrl.value;
						} else {
							thumbnail =
								"https://islandpress.org/sites/default/files/default_book_cover_2015.jpg";
						}

						if (selectedCategories.includes("ent:Book")) {
							author = row.authorName.value;
							bookGenre = row.genreLabel.value
							isbn = row.isbn.value;
							category = "Book";
							pageCount = row.pageCount.value;
							categoryIcon = categorySelectors[`${category}`];

						} else {

							language = row.languageLabel.value;
							genreIcon = genreSelectors[`${genre}`];
							category = selectedCategories.includes("ent:Movie") ? "Movie" : "TV Series";
							categoryIcon = categorySelectors[`${category}`];

							rating = row.rating.value;
							length = row.duration.value

							if (rating < minimumRating) {
								return;
							}

							imdbID = row.imdbID.value;
							genreList = row.genreLabelList.value.split(" ");
							genre = genreList[0];
							actorList = row.actorNameList.value.split(" ");
						}


						let secondColumn;
						let fourthColumn;

						let secondColumnTitle;
						let fourthColumnTitle;

						console.log(categorySelectors);

						if (selectedCategories.includes("ent:Book")) {
							secondColumn = pageCount;
							secondColumnTitle = "Page Count";
							fourthColumn = author;
							fourthColumnTitle = "Author";
						} else {
							fourthColumn = rating;
							fourthColumnTitle = "Rating";
							if (category === "TV Series") {
								secondColumn = length;
								secondColumnTitle = "Number of Seasons";

								if (secondColumn > maximumSeasons) {
									return;
								}
							}
							if (category === "Movie") {
								secondColumn = `${length} min`;
								secondColumnTitle = "Runtime";
							}
						}

						let result = `<div class="container d-flex h-100 card mb-3 text-center list-group-item preloadResults" style="max-height: 280px;">
                    <div class="row justify-content-center ">
                        <h5>${title}</h5>
                    </div>

                    <div class="row justify-content-center row-cols-5">
                        <div class="col mb-4">
                            <div class="resultCard justify-content-center">
                                <img src="${thumbnail}" class="card-img-top resultImg" alt="...">
                            </div>
                        </div>

                        <div class="col mb-4">
                            <div class="card resultCard">
                                <img src="${categoryIcon}" class="card-img-top" alt="...">
                            </div>

                            <div class="card-footer text-center font-weight-bold">
                                <p class="card-title category">${category}</p>
                            </div>
                        </div>
                        
                        <div class="col mb-4 ">
                            <div class="card card-body resultCard justify-content-center">
                                <h1 class="">
                                    <length>${secondColumn}</length>
                                </h1>
                            </div>

                            <div class="card-footer text-center font-weight-bold">
                                <p class="card-title">${secondColumnTitle}</p>
                            </div>
                        </div>
                        
                        
                        
                        <div class="col mb-4">

                            <div class="card card-body resultCard justify-content-center">


                                <h5 class="">
                                    <rating>${fourthColumn}</rating>
                                </h5>
                            </div>

                            <div class="card-footer text-center font-weight-bold">
                                <p class="card-title">${fourthColumnTitle}</p>
                            </div>
                        </div>
                        
                        <div class="col mb-4">
                            <div class="card card-body resultCard justify-content-center">
                                <h1 class="">
                                    <year>${year}</year>
                                </h1>
                            </div>

                            <div class="card-footer text-center font-weight-bold">
                                <p class="card-title">Release Year</p>
                            </div>
                        </div>

                    </div>
                </div>`;

						$(".resultBlock").append(result);
					});
				},
			});

			$("#preloadBlock").preloader("remove");
			$(".searchBlock").hide();
			$(".resultBlock").show();

			$(document).on("click", ".preloadResults", function (event) {
				$(this).toggleClass("bg-info");
			});
		});
	});
});



// let sortButtons;
				// 		if (count <= 0) {
				// 			$.each();
				// 			sortButtons = `<div class="container d-flex h-100 card mb-3 text-center list-group-item preloadResults" style="max-height: 280px;">
                // <div class="row justify-content-center row-cols-5">
                //     <div class="col mb-4"></div>
                //     <div class="col mb-4"></div>
                //     <div class="col mb-4"></div>
                //     <div class="col mb-4"></div>
                //     v
                // </div>
                // </div>`;
				// 		}

// jQuery(function ($) {
						// 	/* find and sort */
						// 	var sortByRuntime = $.sortFunc([
						// 		"+$(this).find('runtime').text()",
						// 	]),
						// 		sortByCategory = $.sortFunc([
						// 			"$(this).find('.category').text()",
						// 		]),
						// 		sortByRating = $.sortFunc(["+$(this).find('rating').text()"]),
						// 		sortByYear = $.sortFunc(["+$(this).find('year').text()"]);
						// 	$("button.runtime").click(function () {
						// 		$(this).nextAll("div").sortChildren(sortByRuntime);
						// 	});
						// 	$("button.category").click(function () {
						// 		$(this).nextAll("div").sortChildren(sortByCategory);
						// 	});
						// 	$("button.rating").click(function () {
						// 		$(this).nextAll("div").sortChildren(sortByRating);
						// 	});
						// 	$("button.year").click(function () {
						// 		$(this).nextAll("div").sortChildren(sortByYear);
						// 	});
						// });


						// (function (fn) {
// 	"use strict";
// 	fn(window.jQuery, window, document);
// })(function ($, window, document) {
// 	"use strict";

// 	$(function () {
// 		$(".sort-btn").on("click", "[data-sort]", function (event) {
// 			event.preventDefault();

// 			var $this = $(this),
// 				sortDir = "desc";

// 			if ($this.data("sort") !== "asc") {
// 				sortDir = "asc";
// 			}

// 			$this
// 				.data("sort", sortDir)
// 				.find(".fa")
// 				.attr("class", "fa fa-sort-" + sortDir);

// 			// call sortDesc() or sortAsc() or whathaveyou...
// 		});
// 	});
// });