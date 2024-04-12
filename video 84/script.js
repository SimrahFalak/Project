let currentSong=new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;

}

function secondsToMinutesSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60); // Convert seconds to integer

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0'); // Ensure two digits

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track);
    currentSong.src="/songs/"+track;
    if(!pause){
        currentSong.play();
        Play.src="pause.svg";
    } 
    document.querySelector(".songname").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00/00:00";
}

async function main() {
    //get list of all songs
    let songs = await getSongs();
    playMusic(songs[0],true);
    console.log(songs);

    //show all the songs in playlist
    let songUl=document.querySelector(".songslist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+ `<li>
        <img src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
        <img class="invert" src="play.svg" alt="">
        </div>
    </li>`;
    }

    //Attach an eventListener to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
       }) 
    })

    //Attach an eventlistener to play next and previous
    Play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            Play.src="pause.svg";
        }
        else{
            currentSong.pause()
            Play.src="play.svg";

        }
    })

    // listen for time update 
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/ currentSong.duration)* 100 + "%";
    })

    //add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        // console.log(e.target.getBoundingClientRect(),e.offsetX);
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    })

    //add and eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })

    //add and eventlistener for close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%";
    })
}

main();

