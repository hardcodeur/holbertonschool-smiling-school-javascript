function carouselQuotes(id,url) {
    let carouselBox = $(`#${id}`);
    let carouselId= `cul_${id}`;

    $.get(url,(data,status)=>{
        if(status === "success"){
            carouselBox.empty();
            let carousel =$(`
                <div id="${carouselId}" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                    </div>
                    <a
                    class="carousel-control-prev arrow-left"
                    href="#${carouselId}"
                    role="button"
                    data-slide="prev"
                    >
                    <img
                        src="images/arrow_white_left.png"
                        alt="Quote Previous"
                        aria-hidden="true"
                    />
                    <span class="sr-only">Previous</span>
                    </a>
                    <a
                    class="carousel-control-next arrow-right"
                    href="#${carouselId}"
                    role="button"
                    data-slide="next"
                    >
                    <img
                        src="images/arrow_white_right.png"
                        alt="Quote Next"
                        aria-hidden="true"
                    />
                    <span class="sr-only">Next</span>
                    </a>
                </div>`);
            
            $(carouselBox).append(carousel);

            $.each(data,(index,element)=>{

                let itemActive = index == 0 ? "active" : "";

                $(`#${carouselId} > .carousel-inner`).append(`
                <div class="carousel-item ${itemActive}">
                    <div class="row mx-auto align-items-center">
                        <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                            <img 
                                src="${element.pic_url}" class="d-block align-self-center"
                                alt="Carousel Pic ${index+1}"
                            />
                        </div>
                        <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                            <div class="quote-text">
                                <p class="text-white">${element.text}</p>
                                <h4 class="text-white font-weight-bold">${element.name}</h4>
                                <span class="text-white">${element.title}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `);
            });
        }
    },"JSON")
    
}

function carouselVideo(id,url,title,colorWord) {
    let carouselBox = $(`#${id}`);
    let carouselId = `cul_${id}`
    let nbCardByRow = 4
    let titleSection=title.replace(colorWord, `<span class="main-color font-weight-bold">${colorWord}</span>`)

    $.get(url,(data,status)=>{
        if(status === "success"){
            carouselBox.empty();
            let carousel =$(`
                <header class="section-header">
                    <h2 class="text-center">
                        ${titleSection}
                    </h2>
                </header>
                <div id="${carouselId}" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                    </div>
                    <a
                    class="carousel-control-prev arrow-left"
                    href="#${carouselId}"
                    role="button"
                    data-slide="prev"
                    >
                    <img
                        src="images/arrow_black_left.png"
                        alt="tutorial Previous"
                        aria-hidden="true"
                    />
                    <span class="sr-only">Previous</span>
                    </a>
                    <a
                    class="carousel-control-next arrow-right"
                    href="#${carouselId}"
                    role="button"
                    data-slide="next"
                    >
                    <img
                        src="images/arrow_black_right.png"
                        alt="tutorial Next"
                        aria-hidden="true"
                    />
                    <span class="sr-only">Next</span>
                    </a>
                </div>`);
            
            $(carouselBox).append(carousel);

            let nbRow = Math.round(data.length / nbCardByRow);
            for (let index = 1; index <= nbRow; index++) {
                let rowActive = index == 1 ? "active" : "";

                let row = `
                    <div class="carousel-item ${rowActive}">
                        <div data-row="${index}" class="row align-items-center mx-auto"></div>
                    </div>
                `;

                $(`#${carouselId} > .carousel-inner`).append(row);
            }

            let rowIndex = 0;
            $.each(data,(idx,element)=>{

                if(idx % nbCardByRow === 0){
                    rowIndex ++;
                }

                let card = `
                    <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center">
                        <div data-card="${idx}" class="card">
                            <img src="${element.thumb_url}" class="card-img-top" alt="Video thumbnail" />
                            <div class="card-img-overlay text-center">
                            <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay"/>
                            </div>
                            <div class="card-body">
                            <h5 class="card-title font-weight-bold">
                                ${element.title}
                            </h5>
                            <p class="card-text text-muted">
                                ${element["sub-title"]}
                            </p>
                            <div class="creator d-flex align-items-center">
                                <img src="${element.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                                <h6 class="pl-3 m-0 main-color">${element.author}</h6>
                            </div>
                            <div class="info pt-3 d-flex justify-content-between">
                                <div class="rating">
                                </div>
                                <span class="main-color">${element.duration}</span>
                            </div>
                            </div>
                        </div>
                    </div>
                `
                
                $(`#${carouselId} .carousel-item  div[data-row=${rowIndex}]`).append(card);

                for (let i = 0; i < element.star; i++) {
                    $(`#${carouselId} div[data-row=${rowIndex}] div[data-card=${idx}] .rating`).append('<img src="images/star_on.png" alt="star on" width="15px" />');
                }
            });
        }
    },"JSON")
    
}

function initSearchBar(){
    dropdownMenu();
    searchTrigger();
    searchVideos(getSearchPara("keyword"),getSearchPara("topic"),getSearchPara("sort"));
}


function dropdownMenu(){
    let searchDropdowns = [
        {
            id : "dropdownTopic",
            apiKey : "topic"
        },
        {
            id : "dropdownSort",
            apiKey : "sort"
        }
    ]

    let url = "https://smileschool-api.hbtn.info/courses";
    $.get(url,(data,status)=>{
        if(status === "success"){
            searchDropdowns.forEach((dropdown)=>{
                let element = $(`#${dropdown.id}`);
                element.empty();
                element.append(`
                <a class="btn dropdown-toggle text-left" href="#" role="button" id="dropdownMenuLink_${dropdown.apiKey}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span>${formatTextApi(data[dropdown.apiKey])}</span>
                </a>
                <div class="dropdown-menu mt-0" aria-labelledby="dropdownMenuLink_${dropdown.apiKey}"></div>
                `);

                data[dropdown.apiKey+"s"].forEach(topic => {
                    $(`#${dropdown.id} .dropdown-menu`).append(`<a onclick="updateDropdownValue($(this))" class="dropdown-item" href="#">${formatTextApi(topic)}</a>`);
                });
            });
        }
    },"JSON");
}

function searchVideos(keyword,topic,sort){
    let url = "https://smileschool-api.hbtn.info/courses";
    $.get(url,(data,status)=>{
        if(status === "success"){
            let dataDisplay = data.courses;
            if(topic !== "all"){
                dataDisplay = dataDisplay.filter((course) => course.topic !== topic)
            }
            if(keyword !== ""){
                dataDisplay = dataDisplay.filter((course) => course.keywords.includes(keyword))
            }
            if(sort === "Most popular"){
                dataDisplay.sort((a, b) => (a.star > b.star ? -1 : 1))
            }else if(sort === "Most recent"){
                dataDisplay.sort((a, b) => (a.published_at > b.published_at ? -1 : 1))
            }else{
                dataDisplay.sort((a, b) => (a.views > b.views ? -1 : 1))
            }
            listVideo("listVideoCourses",dataDisplay);
        }
    },"JSON");
}


function listVideo(id,data) {
    let listBox = $(`#${id}`);
    listBox.empty();


    let list = `
    <div class="section-title">
        <span class="text-muted video-count">${data.length} videos</span>
    </div>
    <div class="row"></div>
    `
    $(listBox).append(list);

    $.each(data,(i,element)=>{

        let card = `
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center">
            <div data-card="${i}" class="card">
                <img src="${element.thumb_url}" class="card-img-top" alt="Video thumbnail" />
                <div class="card-img-overlay text-center">
                <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay"/>
                </div>
                <div class="card-body">
                <h5 class="card-title font-weight-bold">
                    ${element.title}
                </h5>
                <p class="card-text text-muted">
                    ${element["sub-title"]}
                </p>
                <div class="creator d-flex align-items-center">
                    <img src="${element.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                    <h6 class="pl-3 m-0 main-color">${element.author}</h6>
                </div>
                <div class="info pt-3 d-flex justify-content-between">
                    <div class="rating"></div>
                    <span class="main-color">${element.duration}</span>
                </div>
                </div>
            </div>
        </div>`

        $(`#${id} .row`).append(card);
        for (let idx = 0; idx < element.star; idx++) {
            $(`#${id} .row div[data-card=${i}] .rating`).append('<img src="images/star_on.png" alt="star on" width="15px" />');
        }
    });

}

function getSearchPara(param) {
    if(param === "keyword"){
        return $("#keywords").val();
    }else if (param === "topic"){
        return $("#dropdownTopic > a > span").text();
    }else if (param === "sort"){
        return $("#dropdownSort > a > span").text();
    }
}


function updateDropdownValue(elt) {
    let valueSelected = elt.text();
    let dropdownButtonId = elt.parent().attr("aria-labelledby");
    $(`#${dropdownButtonId} > span`).text(valueSelected);
}

function searchTrigger(){

    $("#keywords").keypress((e)=>{
        // Touche entrer
        if(e.which == 13){
            searchVideos(getSearchPara("keyword"),getSearchPara("topic"),getSearchPara("sort"));
        }
    })

    $("#dropdownTopic").click((e)=>{
        searchVideos(getSearchPara("keyword"),getSearchPara("topic"),getSearchPara("sort"));
    })

    $("#dropdownSort").click((e)=>{
        searchVideos(getSearchPara("keyword"),getSearchPara("topic"),getSearchPara("sort"));
    })
}


function formatTextApi(text){
    let textFormat = text.replace("_", ' ');
    textFormat = textFormat.charAt(0).toUpperCase() + textFormat.slice(1);
    return textFormat;
}




