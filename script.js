let currentsong = new Audio();
let mp3 = []
let rndmsgselected = false;
let shuffleque = []
let suffleonoff = false
let currentindex = 0;
let sleeptimer=null;


async function fetchingsngs() {


    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    console.log(response)

    let container = document.createElement("container")
    container.innerHTML = response;
    let mp = container.getElementsByTagName("a")
    console.log(mp)
    let mp3 = []
    for (let index = 0; index < mp.length; index++) {
        const element = mp[index];
        if (element.href.includes(".mp3")) {
            mp3.push(element.href.split("/songs/")[1])
        }
    }
    return mp3
}

const playingmusic = (currenttrack) => {


    currentsong.src = "/songs/" + currenttrack;
    currentsong.play()
    play.src = "assets/pause.svg";

    document.querySelector(".runtime").innerHTML = "00:00";
    document.querySelector(".totaldura").innerHTML = "00:00";
    document.querySelector(".trackinfo").innerHTML = decodeURI(currenttrack);

    // document.querySelector(".heart-container").innerHTML=`<img src="assets/heart.svg" alt="heart">`;

    document.querySelectorAll(".cards").forEach(card => {
        if (card.getAttribute("data-song-id") === currenttrack) {
            card.classList.add("choosenone");

        } else {
            card.classList.remove("choosenone");
        }

    })


    document.querySelectorAll(".cards").forEach(card => {
        card.addEventListener("click", () => {
            const currenttrack = card.getAttribute("data-song-id");
            li.classList.toggle("choosenone");
            const li = document.querySelector(`.cards[data-list-id="${currenttrack}"]`);
            card.classList.toggle("hehe", true);
        })
    })

    document.querySelectorAll(".que ul li").forEach(li => {
        if (li.getAttribute("data-list-id") === currenttrack) {
            li.classList.add("hehe");

        } else {
            li.classList.remove("hehe");
        }
    })


    // if (!rndmsgselected) {
    //     const randomindex = Math.floor(Math.random() * mp3.length);
    //     const randomsong = mp3[randomindex];
    //     playingmusic(randomsong);

    rndmsgselected = true;
}


async function main() {



    let mp3 = await fetchingsngs();
    console.log(mp3);

    let songlist = document.querySelector(".que").getElementsByTagName("ul")[0];

    for (const song of mp3) {
        songlist.innerHTML = songlist.innerHTML +
            `<li class="song-item" data-list-id="${song}">
        <img src="assets/library.svg" alt="library" class="libimg">
                                <div class="info">
                                    <div> ${song.replaceAll("%20", " ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playmini">
                                    <span>Play</span>
                                <img src="assets/play-mini-card.svg" alt="play">
                            </div></li>`;
    }

    Array.from(document.querySelector(".que").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playingmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    play.addEventListener("click", () => {

        if (!rndmsgselected) {
            const randomindex = Math.floor(Math.random() * mp3.length);
            const randomsong = mp3[randomindex];
            playingmusic(randomsong);
            const songtoplay= suffleonoff?getnextsuffle():mp3[0];
            playingmusic(songtoplay);
        } else {

            if (currentsong.paused) {
                currentsong.play();
                play.style.transform = "scale(1)";
                play.style.opacity = "0";
                setTimeout(() => {
                    play.src = "assets/pause.svg";
                    play.style.opacity = "1";
                    li.classList.add("hehe");

                }, 200);
            } else {
                currentsong.pause()
                play.style.transform = "scale(1)";
                play.style.opacity = "0";
                setTimeout(() => {
                    play.style.opacity = "1";
                }, 200);
                play.src = "assets/play.svg";

            }

        }

        
    });

    document.querySelector(".shuffle").addEventListener("click",()=>{
        suffleonoff=!suffleonoff

        if (suffleonoff){
            document.querySelector(".shuffle").classList.add("active");
        }else{
            document.querySelector(".shuffle").classList.remove("active");
            shuffleque=[]
        }
    })

    function getnextsuffle(){
        if (shuffleque.length===0){
            shuffleque=[...mp3];
        }

        const randomindex = Math.floor(Math.random()*shuffleque.length);
        const nextsng = shuffleque[randomindex];

        shuffleque.splice(randomindex,1);
        return nextsng
        console.log("huu")
    }

    function playrandomnextsng(){
        if(suffleonoff){
            const nextsng = getnextsuffle();
            playingmusic(nextsng)
        }else{
            let currentrndmindex=mp3.indexOf(currentsong.src.split("/").pop())
            let nextindex=(currentrndmindex)%mp3.length;
            playingmusic(mp3[nextindex]);
        }
    }



    currentsong.addEventListener("loadedmetadata", () => {
        let duration = currentsong.duration;
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);
        let time = minutes + ":" + seconds;
        document.querySelector(".totaldura").innerHTML = `${minutes}:${seconds}`;
        console.log(time);
    })

    currentsong.addEventListener("timeupdate", () => {
        let duration = currentsong.duration;
        let currenttime = currentsong.currentTime;
        let min = Math.floor(currenttime / 60);
        let sec = Math.floor(currenttime % 60);
        let min1 = Math.floor(duration / 60);
        let sec1 = Math.floor(duration % 60);
        document.querySelector(".runtime").innerHTML = `${min}:${sec}`;
        document.querySelector(".circle").style.width = `${(currenttime / duration) * 100}%`
    })

    document.querySelector(".playbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        document.querySelector(".circle").style.width = (percent * 100) + "%";
        currentsong.currentTime = percent * currentsong.duration;
        // console.log("Seek Percent:", percent, "New Current Time:", currentsong.currentTime);
    });

    previous.addEventListener("click", () => {
        let previndex = mp3.indexOf(currentsong.src.split("/").slice(-1)[0]);
        let previouslastindex = (previndex - 1) % mp3.length;
        playingmusic(mp3[previouslastindex]);
        console.log("clic")

    })

    next.addEventListener("click", () => {

        let nextindex = mp3.indexOf(currentsong.src.split("/").slice(-1)[0]);
        let nextlastindex = (nextindex + 1) % mp3.length;
        playingmusic(mp3[nextlastindex]);
        playrandomnextsng();
    })


    document.querySelector(".slider input").addEventListener("input", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })

    // let currentsong = new Audio();

    async function fetchSongs() {
        let response = await fetch("http://127.0.0.1:3000/songs/");
        let text = await response.text();
        let container = document.createElement("div");
        container.innerHTML = text;

        let songLinks = Array.from(container.getElementsByTagName("a"))
            .map(link => link.href)
            .filter(href => href.endsWith(".mp3"));

        return songLinks.map(song => song.split("/songs/")[1]);
    }

    function createCard(song, thumbnail, title = "Unknown Title", artist = "Unknown Artist") {
        return `
        <div class="cards" data-song-id="${song}">
            
            <img src="${thumbnail}" alt="Thumbnail" onerror="this.src='/thumbnails/default.jpg'">
            <div class="btntrns1">
            
                <button class="btn-95" data-song="${song}">
                    <svg viewBox="0 0 24 24">
                        <path d="M7.75194 5.43872L18.2596 11.5682C18.4981 11.7073 18.5787 12.0135 18.4396 12.252C18.3961 12.3265 18.3341 12.3885 18.2596 12.432L7.75194 18.5615C7.51341 18.7006 7.20725 18.62 7.06811 18.3815C7.0235 18.305 7 18.2181 7 18.1296V5.87061C7 5.59446 7.22386 5.37061 7.5 5.37061C7.58853 5.37061 7.67547 5.39411 7.75194 5.43872Z"></path>
                    </svg>
                </button>
            </div>
            <h3>${title}</h3>
         
        </div>
    `;
    }

    async function loadSongsIntoCards() {
        const songs = await fetchSongs();
        const cardContainer = document.querySelector(".cardcontainer");

        cardContainer.innerHTML = ""; // Clear existing content

        for (const song of songs) {
            const thumbnail = `/thumbnails/${song.replace(".mp3", ".jpg")}`; // Assume separate thumbnails
            const title = decodeURI(song.replace(".mp3", "")); // Decode and remove file extension

            // Add each card dynamically
            const cardHTML = createCard(song, thumbnail, title);
            cardContainer.innerHTML += cardHTML;

        }

        // Add play functionality to buttons
        document.querySelectorAll(".btn-95").forEach(button => {
            button.addEventListener("click", e => {
                const selectedSong = e.currentTarget.dataset.song;
                playingmusic(selectedSong);
            });
        });
    }

    async function checkImageExists(thumbnails) {
        try {
            const response = await fetch(thumbnails, { method: "HEAD" });
            return response.ok;
        } catch (error) {
            console.error(`Error checking image: ${thumbnails / cat.jpg}`, error);
            return false;
        }
    }

    loadSongsIntoCards();


    document.querySelector(".likor").addEventListener("click", () => {
        //how can i add a link of another web page when the user clicks it
        window.open("https://music.youtube.com/");
    })


    document.querySelector(".ok").addEventListener("click",()=>{
        const close = document.querySelector(".alert");
        close.style.display="none";
    })

    document.querySelector(".timeupbtn").addEventListener("click",()=>{
        const timeup = document.querySelector(".timeup");
        timeup.style.display="none";
    })

    document.querySelector(".timercancelbtn").addEventListener("click",()=>{
        const timecancel = document.querySelector(".timercancel");
        timecancel.style.display="none";
    })

    document.getElementById("settimer").addEventListener("click",()=>{
        const minutes = parseInt(document.getElementById("timer").value);
        if (isNaN(minutes)|| minutes <=0){
            // alert("Please Enter A valid meow");
            document.querySelector(".alert").style.display="inline-block";
            return;
        }
        const duration = minutes *60 *1000;

        if(sleeptimer){
            clearTimeout(sleeptimer);
        }

        sleeptimer=setTimeout(()=>{
            currentsong.pause();
            alert("Time's Up");
          document.querySelector(".timeup").style.display="inline-block";
        },duration)

        alert(`timer set for ${minutes}minutes`)
        // document.getElementById("canceltimer").style.display="inline-block";

    });

    document.getElementById("canceltimer").addEventListener("click",()=>{
        if(sleeptimer){
            clearTimeout(sleeptimer);
            alert("sleeptimer was cancer")
            document.querySelector(".timercancel").style.display="inline-block";
            // document.querySelector(".canceltimer").style.display = "none";
        }
    })

    document.querySelector(".btn-65").addEventListener("click",()=>{
        const maintimer= document.querySelector(".timmings")
        maintimer.style.display="none";
    })

    document.querySelector(".timerimg").addEventListener("click",()=>{
        const maintimerdisplay= document.querySelector(".timmings")
        maintimerdisplay.style.display="inline-block";
    })

}

main();

