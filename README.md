
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
    A manual on how to run the Entertainment Finder Web Application.
    <br />
    <a href="https://github.com/chileluk/kd_final_project"><strong>Explore the docs »</strong></a>
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
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Entertainment Finder is a simple web application that lets you find the entertainment of your choice. In Entertainment finder you can search for Movies, TV series and Books and 
fine tune your search criteria in order to find a perfect entertainment that match your taste.

Here are some of the criteria you can apply you fine tune your search for a perfect entertainment:

* Entertainment category. This has three oprions which are TV Series, Movies and Books.
* Genres which are Comedy,
	History, Sci-Fi, Romance, Thriller, Action, Horror, Crime, Fantasy, Biography, Drama, Mystery, Sport, Adventure, Animation, Family, Documentary and Technology for TV Series and Mobies and Dark Comedy, Historical Novel, Science Fiction, Romance Novel, Novel, Spy Novel, Horror Fiction, Crime Fiction, Fantasy, Autobiography, Detective Fiction, Mystery Fiction, Young Adult Fiction, Adventure Novel, Memoir, Urban Fantasy, Fiction and Non Fiction for Books.
* For Movies and TV shows you have additonal options to choose like runtime, rating, platform, relese year, awards won and language for the Books you can additionally choose the release year and maximum page numbers.



### Built With
These are the main technologies and frameworks used for this project.
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [ECMAScript](http://ecma-international.org)
* [HTML5](https://html.spec.whatwg.org)
* [CSS](https://w3.org/TR/CSS2)



<!-- GETTING STARTED -->
## Getting Started


To get a local copy up and running follow these simple example steps.

### Prerequisites


* None


### Installation

This is a step by step guide on how to run this application.

1. Clone the repository.
```sh
git clone https://github.com/chileluk/kd_final_project.git
```
2. Set up a triplestore. You may choose any triplestore but we recommend GraphDB since that is what we have been using during this project and hence we can offer you support in case of technical difficulties.

3. Create a repository in GraphDB and call it `ent_ontology`.

4. Make this repository as your default repository in GraphDB. After following these steps you do not need to configure repository URL since it will automatically be set as `http://localhost:7200/repositories/ent_ontology` and it will be accessesed by the application. In case if you run into a problem or if your triplestore have a different IP address than your local machine you will need to configure the `localEndpoint` into the exact urlof your repository. This should be done in the following step.

    
    * Open `index.js` file.
    * At line 1 where you find:
    ```JS
    const localEndpoint = "http://localhost:7200/repositories/ent_ontology"
    ```
    replace `http://localhost:7200/repositories/ent_ontology` with your repository URL.
    
4. Upload the file `ent_ontology.ttl` into your repository you just created.
  
5. Navigate to the root folder of the project.
  
6. Run the following command in the terminal
```sh
start index.html
```
    



<!-- USAGE EXAMPLES -->
## Usage




<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/chileluk/kd_final_project/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch
```sh
git checkout -b feature/AmazingFeature
```
3. Commit your Changes
```sh
git commit -m 'Add some AmazingFeature'
```
4. Push to the Branch
```sh
git push origin feature/AmazingFeature
```
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

[Hamoud Khamis](mailto:h.o.khamis@student.vu.nl)
[Chileshe]
[Denise]
[Gabriela]

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
