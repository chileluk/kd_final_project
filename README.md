
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]




<!-- PROJECT LOGO -->
<br />
<p align="center">
  
  <h1 align="center">Entertainment Finder</h1>

  <p align="center">
    Instructions on how to run the Entertainment Finder Web Application.
    <br />
    <a href="https://github.com/chileluk/kd_final_project"><strong>Explore the Docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/chileluk/kd_final_project">View Demo</a>
    ·
    <a href="https://github.com/chileluk/kd_final_project/issues">Report Bug</a>
    ·
    <a href="https://github.com/chileluk/kd_final_project/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [License](#license)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]]()

Entertainment Finder is a simple web application that lets you find the entertainment of your choice. In Entertainment finder you can search for Movies, TV series and Books and 
fine tune your search criteria in order to find entertainment that perfectly matches your taste.

Here are some of the criteria you can apply to fine tune your search for a perfect entertainment recommendation:

* Entertainment category. This has three options, which are TV Series, Movies and Books.
* Genres for these options include Comedy,
	History, Sci-Fi, Romance, Thriller, Action, Horror, Crime, Fantasy, Biography, Drama, Mystery, Sport, Adventure, Animation, Family, Documentary and Technology for TV Series and Mobies and Dark Comedy, Historical Novel, Science Fiction, Romance Novel, Novel, Spy Novel, Horror Fiction, Crime Fiction, Fantasy, Autobiography, Detective Fiction, Mystery Fiction, Young Adult Fiction, Adventure Novel, Memoir, Urban Fantasy, Fiction and Non Fiction for Books.
* For Movies and TV shows you have additonal options to choose like runtime, rating, streaming platform, relese year, awards won and language for the Books you can additionally choose the release year and maximum page numbers.



### Built With
These are the main technologies and frameworks used for this project:
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [ECMAScript](http://ecma-international.org)
* [HTML5](https://html.spec.whatwg.org)
* [CSS](https://w3.org/TR/CSS2)



<!-- GETTING STARTED -->
## Getting Started


To get a local copy up and running follow these simple steps:

### Prerequisites


* GraphDB installed on your machine


### Installation

This is a step by step guide on how to run this application.

1. Clone the repository.
```sh
git clone https://github.com/chileluk/kd_final_project.git
```

2. Create a repository in GraphDB and give it the id `finder`. Select the OWL Max(Optimized) ruleset.

3. Make this your default repository in GraphDB. (After following these steps you do not need to configure therepository URL in the code since it will automatically be set as `http://localhost:7200/repositories/finder` and it will be accessible to the application). However, in case of issues or if your triplestore has a different IP address than your local machine you will need to set the value of the `localEndpoint` variable in the app files to the exact url of your repository as follows:

    
    * Navigate to the `js` folder within the `finder` folder and open the `index.js` file.
    * On the first line of this file where you find:
    ```JS
    const localEndpoint = "http://localhost:7200/repositories/finder"
    ```
    replace `http://localhost:7200/repositories/finder` with the URL of the repository you created in GraphDB.
    
4. Upload the file `finder.ttl` into the repository you just created.
  
5. Open the `finder/index.html` file in a web browser, preferably Google Chrome.
    


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



[Repository](https://github.com/chileluk/kd_final_project)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [MIT License](https://choosealicense.com/licenses/mit/)
* [rangeRover](https://github.com/styopdev/rangeRover)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/badge/Contributors-4-green?logo=appveyor&style=for-the-badge
[contributors-url]: https://github.com/chileluk/kd_final_project/graphs/contributors
[forks-shield]: https://img.shields.io/badge/Forks-0-green?logo=appveyor&style=for-the-badge
[forks-url]: https://github.com/chileluk/kd_final_project/network/members
[stars-shield]: https://img.shields.io/badge/Stargazers-4-green?logo=appveyor&style=for-the-badge
[stars-url]: https://github.com/chileluk/kd_final_project/stargazers
[issues-shield]: https://img.shields.io/badge/Issues-0-green?logo=appveyor&style=for-the-badge
[issues-url]: https://github.com/chileluk/kd_final_project/issues
[license-shield]: https://img.shields.io/badge/Licence-MIT--Licence-green?logo=appveyor&style=for-the-badge
[license-url]: https://opensource.org/licenses/MIT
[product-screenshot]: /screenshot.png
