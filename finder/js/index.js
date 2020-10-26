const localEndpoint = "http://localhost:7200/repositories/finder"


// QUERIES - video for movie and series
let videoQuery = (category, genres, options) => {

    let extraOptions = ""
    extraOptions += options.Language.value ? "VALUES ?lang {ent:English}" : ""
    extraOptions += options.Platforms.value ? ` VALUES ?platforms {${options.Platforms.value}}` : ""

    let awardOptions = `OPTIONAL { ?entertainment ent:wonAward/rdfs:label ?award. }`
    if (options.Awards.value) {
        extraOptions += ` VALUES ?awards {${options.Awards.value}}`
        awardOptions = `
        ?entertainment ent:wonAward ?awards.
        ?awards rdfs:label ?award.
        `          
    }
    
    let lengthFilter = `xsd:integer(?duration) > ${options.Length.value}`
    if (category === "Movie") {
        lengthFilter = `xsd:integer(?duration) < ${options.Length.value}`
    }

	return `PREFIX ent: <http://www.entertainment.org/entertainment/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?imdbID ?title ?poster ?year ?language ?rating ?duration ?country ?plot ?platform ?award ?director
    (CONCAT(GROUP_CONCAT(DISTINCT ?genreLabel;separator=',')) as ?genreLabels)
    (CONCAT(GROUP_CONCAT(DISTINCT ?actorName;separator=',')) as ?actorNames)

    WHERE {
		VALUES ?genre {${genres}}
		${extraOptions}
		?entertainment a ent:${category};
			ent:hasGenre ?genre; ent:title ?title; ent:releaseYear ?year; ent:language ?lang;
			ent:hasRating ?rating; ent:duration ?duration; ent:releaseCountry ?nation;
            rdfs:comment ?plot; ent:imdbID ?imdbID; ent:imageURL ?poster; ent:hasGenre/rdfs:label ?genreLabel .
        ?entertainment ent:availableOn ?platforms .
        ?platforms rdfs:label ?platform .
		${awardOptions}
		OPTIONAL {
			?entertainment ent:directedBy/ent:name ?director .
        }
		?actor ent:appearsIn ?entertainment; ent:name ?actorName.
		?nation rdfs:label ?country .
		?lang rdfs:label ?language .
		FILTER(xsd:integer(?year) > ${options.Year.value} 
			&& xsd:double(?rating) > ${options.Rating.value} &&
			${lengthFilter}
			)
    }
    GROUP BY ?imdbID ?title ?poster ?year ?language ?rating ?duration ?country ?plot ?platform ?award ?director
	ORDER BY DESC (?rating)`;
}

let bookQuery = (genres) => {
	return `PREFIX ent:<http://www.entertainment.org/entertainment/>
	  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	  PREFIX dbr: <http://dbpedia.org/resource/>
      SELECT DISTINCT ?title
      (SAMPLE(?is) AS ?isbn)
      (SAMPLE(?pl) AS ?plot)
	  (SAMPLE(?cl) AS ?country)
	  (SAMPLE(?img) AS ?cover)
      (SAMPLE(?authName) AS ?authorName)
      (SAMPLE(?pages) AS ?pageCount)
      (SAMPLE(?link) AS ?wikipedia)
	  (SAMPLE(?date) AS ?year)
	  (CONCAT(GROUP_CONCAT(DISTINCT ?genreLabel;separator=',')) as ?genreLabels)
      WHERE {
		VALUES ?genre {${genres.trim()}}
		?book a ent:Book; ent:hasGenre ?genre; ent:hasISBN ?is; ent:writtenBy ?author; rdfs:comment ?pl;
		ent:title ?title; ent:releaseYear ?date; ent:releaseCountry ?nation; ent:pageCount ?pages;
		rdfs:label ?link.
		OPTIONAL { ?book ent:imageURL ?img .}
		?nation rdfs:label ?cl.
		?book ent:hasGenre/rdfs:label ?genreLabel .
		?author ent:name ?authName .
		FILTER(xsd:integer(?pages) < ${bookOptions.Pages.value} &&
			 xsd:integer(?date) > ${bookOptions.Year.value})
      }
      GROUP BY ?title
     `
}

// IMAGES ON HOME PAGE
let categorySelectors = {
	Series: "https://img.icons8.com/nolan/512/tv-show.png",
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
	Novel: "https://img.icons8.com/nolan/512/thriller.png",
	"Spy_novel": "https://img.icons8.com/nolan/512/theatre-mask.png",
	"Horror_fiction": "https://img.icons8.com/nolan/512/scream.png",
	"Crime_fiction": "https://img.icons8.com/nolan/512/bank-robbery.png",
	Fantasy: "https://img.icons8.com/nolan/512/fantasy.png",
	"Autobiography": "https://img.icons8.com/nolan/512/resume.png",
	"Detective_fiction": "https://img.icons8.com/nolan/512/law.png",
	"Mystery_fiction": "https://img.icons8.com/nolan/512/anonymous-mask.png",
	"Young-adult_fiction": "https://img.icons8.com/nolan/512/american-football-ball.png",
	"Adventure_novel": "https://img.icons8.com/nolan/512/trekking.png",
	Memoir: "https://img.icons8.com/nolan/512/movie.png",
	"Urban_Fantasy": "https://img.icons8.com/nolan/512/alpha.png",
	"Fiction": "https://img.icons8.com/nolan/512/documentary.png",
	"Non-fiction": "https://img.icons8.com/nolan/512/bookmark.png",

}


// APP FUNCTIONALITY
$(document)
	.ajaxStart(function () {
		$("#preloadBlock").preloader();
	})
	.ajaxStop(function () {
		$("#preloadBlock").preloader("remove");
	});


var selectedCategory; // Movie, Book or Series
let tvPlatforms = ["Netflix", "Hulu", "Amazon Prime", "Disney+", "Apple TV", "HBO now"]
let tvAwards = ["Primetime Emmy", "Golden Globe", "Critics Choice", "BAFTA"]
let moviePlatforms = ["Disney+", "Amazon Prime"]
let movieAwards = ["Academy Award", "Golden Globe", "Critics Choice", "BAFTA"]

// set all fields other than genre
let bookOptions = {
	Year: { text: "the minimum publication year of the book", type:"slider", start: 1970, end:2020, step: 10, value: 0 },
	Pages: { text: "the maximum number of book pages", type: "slider", start: 0, end: 2000, step: 250, value: 50000 }
}
let tvOptions = {
	Length: { text: "the minimum number of show seasons", type: "slider", start: 1, end: 10, step: 1, value: 0 },
	Rating: { text: "the minimum viewer rating of the show", type: "slider", start: 1, end: 10, step: 1,  value: 0 },
	Year: { text: "the minimum release year of the show", type: "slider", start: 1970, end: 2020, step: 10, value: 0 },
	Platforms: { text: "a platform where the show is streaming", type: "dropdown", choices: tvPlatforms, value: "" },
	Awards: { text: "an award won by the show", type: "dropdown", choices: tvAwards, value: "" },
	Language: { text: "the language of the show", type: "radio", value: false } // true for English only
}
let movieOptions = {
	Length: { text: "the maximum runtime of the movie (in minutes)", type: "slider", start: 60, end: 200, step: 20, value: 300 },
	Rating: { text: "the minimum viewer rating of the movie", type: "slider", start: 1, end: 10, step: 1, value: 0 },
	Year: { text: "the minimum release year of the movie", type: "slider", start: 1970, end: 2020, step: 10, value: 0 },
    Platforms: { text: "a platform where the movie is streaming", type: "dropdown", choices: moviePlatforms, value: "" },
	Awards: { text: "an award won by the movie", type: "dropdown", choices: movieAwards, value: "" },
	Language: { text: "the language of the movie", type: "radio", value: false }
}



var rangeSelector = (element, start, end, interval, origin) => {
	$(element).rangeRover({
		color: "linear-gradient(#84C0FD, #C23CFD)",
		step: interval,
		mode: "plain",
		range: false,
		vLabels: false,
		data: { start, end },
		onChange: function (val) {
			origin.value = val.start.value
			console.log("SET VALUE:", origin.value)
		},
	});
};

var dropdownMenu = (element, options, origin) => {
	let choices = ""
	let className = element.replace("#", "")
	let $select = `<select name="${className}" class="${className} dropdown"></select>`
    $(element).append($select)

    $(`.${className}`).append(`<option value="">Choose one</option>`)
	$.each(options, (i, opt) => {
		let $item = `<option value=${opt.replace(" ", "").replace("+", "Plus")}>${opt}</option>`
		$(`.${className}`).append($item)
	})

	$(`select.${className}`).change(function () {
		let choice = $(this).children("option:selected").val();
		// choices += choices.includes(choice) ? "" : "ent:" + choice + " ";
        // origin.value = choices.trim()
        
        origin.value = choice ? "ent:" + choice : "";

		console.log("SELECTED VALUE:", origin.value)	
	});
}

var radioButtons = (element, origin) => {
    let div1 = `<div id="radio1" class="radio-container"></div>`
	let $option1 = `<input type="radio" id="English" name="language"></input>`
	let $label1 = `<label for="English">English only</label>`

    let div2 = `<div id="radio2" class="radio-container"></div>`
	let $option2 = `<input type="radio" id="All" name="language" checked></input>`
	let $label2 = `<label for="All">All languages</label>`

    $(element).append(div1)
    $(element).append(div2)
	$("#radio1").append($option1)
    $("#radio1").append($label1)
    $("#radio2").append($option2)
    $("#radio2").append($label2)

	$("#English").change(() => {
		origin.value = true
		console.log("ENGLISH only")
		console.log(origin.value)
	})
	$("#All").change(() => {
		origin.value = false
		console.log("ALL lang")
		console.log(origin.value)
	})
	
}


$(document).ready(function () {
    
    // hide button to return to categories
    $("#return-button").hide()

    $(".categorySelector").click(event => {
        $(event.currentTarget)
            .addClass("bg-info")
            .siblings().removeClass("bg-info")
    });

    $("#home, #return-button").click(function () {
        $("#preloadBlock").preloader();
        location.reload();
        $("#return-button").hide()
        $(".jumbotron").show()
    });

    
    // expand individual result cards
    $(document).on("click", ".container.card", function () {
        let id = $(this).attr("id")
        $(`#exp-${id}`).slideToggle()
    })


    $(".btn.select-category").click(function () {

        // SET the selected Category
        selectedCategory = $(".bg-info").attr("id");

        if (!selectedCategory) {
            let proceedHeader = `<div class="alert alert-success text-center proceed-error" role="alert">
                <h4 class="alert-heading">Choose a Category</h4>
                <hr>
                <p class="mb-0"> Must select an entertainment Category before proceeding 
                </p>
            </div>`;
            $(".proceed").append(proceedHeader);

            $("html, body").animate({ scrollTop: $(document).height() }, 1500)
        } else {
            console.log(selectedCategory)

            //Hide any previously shown proceed-error
            $(".proceed-error").hide();

            $(".select-category").hide();
            $(".basic-options").hide();
            $("#preloadBlock").preloader();

                // hide welcome message
            $(".jumbotron").hide()
            $("#return-button").show()
            
            

            // FILTERS PER CATEGORY
            let genreSelectors;
            let categoryOptions;

            if (selectedCategory === "Book") {
                genreSelectors = bookGenres
                categoryOptions = bookOptions
            } else if (selectedCategory === "Movie") {
                genreSelectors = filmGenres
                categoryOptions = movieOptions
            } else {
                genreSelectors = filmGenres
                categoryOptions = tvOptions
            }


            // GENRE MENU
            let heading = `<div class="alert alert-success text-center genre" role="alert">
                <h4 class="alert-heading">Genres</h4>
                <hr>
                <p class="mb-0">
                    Select at least one ${selectedCategory === "Series" ? "TV Show" : selectedCategory} genre <em><strong>(*required)</strong></em>
                </p>
            </div>`

            $(".genreHeading").append(heading);

            // GENRE MENU OPTIONS
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


            // OTHER FILTERS
            $.each(categoryOptions, (option, val) => {
                let filterId = `book-${option}`
                let $container = `<div id="${option}"></div>`;
                let heading = `<div class="alert alert-success text-center filter-header" role="alert">
                    <h4 class="alert-heading">${option}</h4>
                    <hr>
                    <p class="mb-0">Select ${val.text + " <em><strong>(optional)</strong></em>"}</p>
                    </div>`
                
                $(".searchBlock").append($container)
                $(`#${option}`).append(heading)
                
                if (val.type === "slider") {
                    // create a range slider
                    let slider = `<div id="${filterId}" class="range"></div>`;
                    $(`#${option}`).append(slider)
                    rangeSelector(`#${filterId}`, val.start, val.end, val.step, categoryOptions[option])
                }
                else if (val.type === "dropdown") {
                    // create a dropdown menu
                    let dropdown = `<div id="${filterId}" class="dropdown-container"></div>`;
                    $(`#${option}`).append(dropdown)
                    dropdownMenu(`#${filterId}`, val.choices, categoryOptions[option])
                }
                else if (val.type === "radio") {
                    // create radio buttons
                    let radioForm = `<form id="${filterId}" class="radios"></form>`;
                    $(`#${option}`).append(radioForm)
                    radioButtons(`#${filterId}`, categoryOptions[option])
                }
            })


            // SEARCH BUTTON CLICK
            let search = `<button id="search" type="button" class="btn btn-primary select-category">
                <a href="#header-${selectedCategory}">Search</a>
            </button>`;
            $(".search").append(search);
            $("#preloadBlock").preloader("remove");
            $(".basic-options").hide();
            $(".searchBlock").show();

            $(document).on("click", ".genreSelector", function () {
                $(this).toggleClass("bg-info");
            });

            $("#search").click(function () {
                // $(".searchBlock").hide();
                $("#preloadBlock").preloader();

                // hide any previosly shown error message
                $(".result-message").hide();

                // clear results block in case doing a modified search
                $(".resultBlock").empty()

                var selectedGenres = "";
                let genre;

                $(".genreSelector.bg-info").each((index, element) => {
                    if (selectedCategory === "Book") {
                        genre = "dbr:" + $(element).attr("id");
                    }
                    else {
                        genre = "ent:" + $(element).attr("id");
                    }

                    selectedGenres += genre; //genre1 genre2 genre3 ...
                    selectedGenres += " ";
                });

                // check that user has selected at least one genre
                let genreSet = selectedGenres.trim() !== ""

                
                $(".resultBlock").hide();

                
                let query;
                let resultsLabel = selectedCategory + "s"
                if (selectedCategory === "Book") {
                    query = bookQuery(selectedGenres)
                } else if (selectedCategory === "Movie") {
                    query = videoQuery(selectedCategory, selectedGenres, movieOptions)
                } else {
                    resultsLabel = "Shows"
                    query = videoQuery(selectedCategory, selectedGenres, tvOptions)
                }

                console.log(query)

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
                        // REQUEST ERR message
                        let resultHeader;
                        resultHeader = `<div class="alert alert-success text-center result-message" role="alert">
                            <h4 class="alert-heading">Search Results</h4>
                            <hr>
                            <p class="mb-0">Sorry, There was an error during search. Please try again</p>
                        </div>`;
                        $(".resultBlock").append(resultHeader);
                    },
                    success: function (response) {
                        let resultHeader;
                        var results = response.results.bindings;
                        if (results.length === 0) {
                            // No-matching-results message
                            if (genreSet) {
                                resultHeader = `<div class="alert alert-success text-center result-message" role="alert">
                                    <h4 class="alert-heading">Search Results</h4>
                                    <hr>
                                    <p class="mb-0"> Sorry, the selected search criteria did not return any results. 
                                        Please try searching again with different criteria. 
                                        \nTIP: Select more genres to broaden the search
                                    </p>
                                </div>`;
                                $(".resultBlock").append(resultHeader);
                            } else {
                                // Genre-not-set message
                                resultHeader = `<div class="alert alert-success text-center result-message" role="alert">
                                    <h4 class="alert-heading">Search Error</h4>
                                    <hr>
                                    <p class="mb-0">You did not select any genres. Must select at least one genre</p>
                                </div>`;
                                $(".resultBlock").append(resultHeader);
                            }
                            
                        } else {
                            resultHeader = `<div id=header-${selectedCategory} class="result-header alert alert-success text-center" role="alert">
                                <h4 class="alert-heading">Recomended ${resultsLabel}</h4>
                                <hr>
                                <p class="mb-0">You may be interested in the following ${resultsLabel.toLowerCase()}</p>
                            </div>`;
                            // $(".search").hide()

                            let instruction = `<h5 id="view-instruction">Click on each result to view more details and click again to hide details</h5>`

                            $(".resultBlock").append(resultHeader);
                            $(".resultBlock").append(instruction);

                        }

                        let imdbIds = ""
                        let isbns = ""

                        // RESULTS
                        $.each(results, (index, row) => {

                            // fields common to all three
                            let title = row.title.value;
                            let year = row.year.value;
                            let plot = row.plot.value;
                            let country = row.country.value;
                            // let genreLabels = row.genreLabels.value.split(",")
                            let genreLabels = row.genreLabels.value.replace(/,/g, ", ")

                            let firstGenre = genreLabels.split(", ")[0]
                            let genreIcon = genreSelectors[`${firstGenre}`];

                            let thumbnail, categoryIcon, resultId

                            // Book fields
                            let author, pageCount, wikipediaLink, isbn;

                            // movie/show fields
                            let imdbID, rating, language, length, actorNames, platform, award, director


                            if (selectedCategory === "Book") {
                                isbn = row.isbn.value;
                                // hacky fix for duplicates
                                if (isbns.includes(isbn)) {
                                    return
                                }
                                isbns += isbn + " "
                                resultId = isbn

                                let plainISBN = isbn.replace(/-/g, "")

                                genreIcon = genreSelectors[`${firstGenre.replace(" ", "_")}`];
                                author = row.authorName.value;
                                pageCount = row.pageCount.value;
                                thumbnail = `http://covers.openlibrary.org/b/isbn/${plainISBN}-M.jpg`;

                                thumbnail = !thumbnail ? "https://img.icons8.com/nolan/512/books-1.png" : thumbnail
                                wikipediaLink = row.wikipedia.value;

                                categoryIcon = categorySelectors[`${selectedCategory}`];

                            } else {
                                // MOVIE & SERIES
                                imdbID = row.imdbID.value;
                                if (imdbIds.includes(imdbID)) {
                                    return
                                }
                                imdbIds += imdbID + " "

                                resultId = imdbID

                                thumbnail = row.poster.value;
                                
                                rating = row.rating.value;
                                language = row.language.value;
                                length = row.duration.value;
                                actorNames = row.actorNames.value.replace(/,/g, ", ")
                                platform = row.platform.value;
                                award = row.award ? row.award.value : "Unknown"

                                if (selectedCategory === "Movie") {
                                    director = row.director.value
                                }

                                categoryIcon = categorySelectors[`${selectedCategory}`];
                            }


                            let secondColumn, secondColumnTitle, fourthColumn, fourthColumnTitle;

                            if (selectedCategory === "Book") {
                                secondColumn = pageCount;
                                secondColumnTitle = "Page Count";
                                fourthColumn = author;
                                fourthColumnTitle = "Author";
                            } else {
                                secondColumn = length;
                                fourthColumn = rating;
                                fourthColumnTitle = "IMDB Rating";
                                if (selectedCategory === "Series") {
                                    secondColumnTitle = "Number of Seasons";
                                }
                                if (selectedCategory === "Movie") {
                                    secondColumn += " min";
                                    secondColumnTitle = "Runtime";
                                }
                            }

                            let result = `
                            <div id=${resultId} title="Click to toggle details" class="container d-flex h-100 card mb-3 text-center list-group-item preloadResults" style="max-height: 300px;">
                                <div class="row justify-content-center ">
                                    <h4 class="card-h4">${title}</h5>
                                </div>

                                <div class="row justify-content-center row-cols-5">
                                    <div class="col mb-4">
                                        <div class="resultCard justify-content-center image">
                                            <img src="${thumbnail}" class="card-img-top resultImg" alt="...">
                                        </div>
                                    </div>

                                    <div class="col mb-4">
                                        <div class="card resultCard">
                                            <img src="${genreIcon}" class="card-img-top" alt="...">
                                        </div>
                                        <div class="card-footer text-center font-weight-bold">
                                            <p class="card-title category">${firstGenre}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="col mb-4 ">
                                        <div class="card card-body resultCard justify-content-center">
                                            <h1 class=""><length>${secondColumn}</length></h1>
                                        </div>
                                        <div class="card-footer text-center font-weight-bold">
                                            <p class="card-title">${secondColumnTitle}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="col mb-4">
                                        <div class="card card-body resultCard justify-content-center">
                                            <h3 class="">${fourthColumn}</h3>
                                        </div>
                                        <div class="card-footer text-center font-weight-bold">
                                            <p class="card-title">${fourthColumnTitle}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="col mb-4">
                                        <div class="card card-body resultCard justify-content-center">
                                            <h1 class=""><year>${year}</year></h1>
                                        </div>
                                        <div class="card-footer text-center font-weight-bold">
                                            <p class="card-title">Release Year</p>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                            let expandedView;

                            if (selectedCategory === "Book") {
                                expandedView = `
                                <div id=exp-${resultId} class="expanded-view">
                                    <div class="plot">
                                        <p><span>Plot:</span> ${plot}</p>
                                    </div>
                                    <div class="details">
                                        <p><span>Country:</span> ${country}</p>
                                        <p><span>Genres:</span> ${genreLabels}</p>
                                        <a href=${wikipediaLink} target="_blank">More Info</a>
                                    </div>
                                </div>`
                            } else {
                                expandedView = `
                                <div id=exp-${resultId} class="expanded-view">
                                    <div class="plot">
                                        <p><span>Plot:</span> ${plot}</p>
                                        <p><span>Genres:</span> ${genreLabels}</p>
                                        <p><span>Language:</span> ${language}</p>
                                        <p><span>Country:</span> ${country}</p>
                                    </div>
                                    <div class="details">
                                        <p id=${resultId + platform.replace(" ", "")}><span>Available on:</span> ${platform}</p>
                                        <p id=${resultId + award.replace(" ", "")}"><span>Awards:</span> ${award}</p>
                                        <p><span>Cast: </span>${actorNames}</p>
                                `

                                if (selectedCategory === "Movie") {
                                    expandedView += `<p><span>Director:</span> ${director}</p>`
                                }

                                expandedView += `<a href=https://www.imdb.com/title/${imdbID} target="_blank">More Info</a>`
                                expandedView += `</div></div>`
                            }

                            $(".resultBlock").append(result);
                            $(".resultBlock").append(expandedView);
                            $(".expanded-view").hide()
                        });

                        // window.location = $(`#header-${selectedCategory}`)
                    },
                });

                $("#preloadBlock").preloader("remove");
                // $(".searchBlock").hide();
                $("html, body").animate({ scrollTop: $(document).height() }, 2000)
                $(".resultBlock").show();

                $(document).on("click", ".preloadResults", function (event) {
                    $(this).toggleClass("bg-info");
                });
            });

        }
    });
});